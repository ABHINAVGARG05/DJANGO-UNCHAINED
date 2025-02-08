package controllers

import (
	"context"
	"fmt"
	"math"
	"sort"
	"time"

	"github.com/ABHINAVGARG05/DJANGO_UNCHAINED/pkg/models"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type GridDistributionHandler struct {
	db *mongo.Database
}

func NewGridDistributionHandler(db *mongo.Database) *GridDistributionHandler {
	return &GridDistributionHandler{db: db}
}

func (h *GridDistributionHandler) handleExcessDemand(grid *models.GridNetwork) ([]models.EnergyTransfer, error) {
	var transfers []models.EnergyTransfer
	var nodesWithExcess, nodesWithDeficit []models.ChildNode

	// 1. Classify nodes
	for _, node := range grid.ChildNodes {
		if node.AllocatedPower > node.CurrentDemand {
			nodesWithExcess = append(nodesWithExcess, node)
		} else if node.AllocatedPower < node.CurrentDemand {
			nodesWithDeficit = append(nodesWithDeficit, node)
		}
	}

	fmt.Println("Nodes with Excess:", len(nodesWithExcess))
	fmt.Println("Nodes with Deficit:", len(nodesWithDeficit))

	// 2. Sort excess nodes by highest surplus, then by distance
	sort.Slice(nodesWithExcess, func(i, j int) bool {
		if nodesWithExcess[i].AllocatedPower-nodesWithExcess[i].CurrentDemand !=
			nodesWithExcess[j].AllocatedPower-nodesWithExcess[j].CurrentDemand {
			return (nodesWithExcess[i].AllocatedPower - nodesWithExcess[i].CurrentDemand) >
				(nodesWithExcess[j].AllocatedPower - nodesWithExcess[j].CurrentDemand)
		}
		return nodesWithExcess[i].Distance < nodesWithExcess[j].Distance
	})

	sort.Slice(nodesWithDeficit, func(i, j int) bool {
		return nodesWithDeficit[i].Distance < nodesWithDeficit[j].Distance
	})

	// 3. Process Transfers
	for dIdx, deficitNode := range nodesWithDeficit {
		deficit := deficitNode.CurrentDemand - deficitNode.AllocatedPower

		for eIdx := range nodesWithExcess {
			if deficit <= 0 {
				break
			}

			excess := nodesWithExcess[eIdx].AllocatedPower - nodesWithExcess[eIdx].CurrentDemand
			if excess <= 0 {
				continue
			}

			distance := calculateDistance(nodesWithExcess[eIdx].Location, deficitNode.Location)
			lossRate := calculateLossRate(distance)
			transferAmount := math.Min(deficit/(1-lossRate), excess)

			if transferAmount <= 0 {
				continue
			}

			transfer := models.EnergyTransfer{
				FromNodeID:   nodesWithExcess[eIdx].ID,
				ToNodeID:     deficitNode.ID,
				Amount:       transferAmount,
				TransferTime: time.Now(),
				LossEstimate: lossRate * 100,
			}
			transfers = append(transfers, transfer)

			fmt.Printf("Transfer -> From: %s, To: %s, Amount: %f\n",
				transfer.FromNodeID.Hex(), transfer.ToNodeID.Hex(), transfer.Amount)

			deficit -= transferAmount * (1 - lossRate)
			nodesWithExcess[eIdx].AllocatedPower -= transferAmount

			for j := range grid.ChildNodes {
				if grid.ChildNodes[j].ID == nodesWithExcess[eIdx].ID {
					grid.ChildNodes[j].AllocatedPower = nodesWithExcess[eIdx].AllocatedPower
				}
				if grid.ChildNodes[j].ID == deficitNode.ID {
					grid.ChildNodes[j].AllocatedPower += transferAmount * (1 - lossRate)
				}
			}
			nodesWithDeficit[dIdx].AllocatedPower += transferAmount * (1 - lossRate)
		}
	}

	// 4. Persist Updated Grid to MongoDB
	_, err := h.db.Collection("grid_networks").UpdateOne(
		context.Background(),
		bson.M{"_id": grid.ID},
		bson.M{"$set": bson.M{"child_nodes": grid.ChildNodes}},
	)
	if err != nil {
		return nil, fmt.Errorf("failed to update grid: %v", err)
	}

	return transfers, nil
}

func (h *GridDistributionHandler) BalanceGridEnergy(c *fiber.Ctx) error {
	gridID, err := primitive.ObjectIDFromHex(c.Params("gridId"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid grid ID"})
	}

	var grid models.GridNetwork
	err = h.db.Collection("grid_networks").FindOne(context.Background(), bson.M{"_id": gridID}).Decode(&grid)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Grid network not found"})
	}

	transfers, err := h.handleExcessDemand(&grid)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to handle excess demand"})
	}

	// Step 1: Calculate base distribution
	err = h.calculateBaseDistribution(&grid)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to calculate base distribution"})
	}

	// Step 2: Handle excess demand and get new transfers

	// Step 3: Store transfers in `energy_transfers`
	if len(transfers) > 0 {
		var transferDocs []interface{}
		for _, t := range transfers {
			transferDocs = append(transferDocs, bson.M{
				"from":          t.FromNodeID,
				"to":            t.ToNodeID,
				"amount":        t.Amount,
				"transfer_time": t.TransferTime,
				"loss_estimate": t.LossEstimate,
			})
		}
		_, err = h.db.Collection("energy_transfers").InsertMany(context.Background(), transferDocs)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to record energy transfers"})
		}
	}

	// Step 4: Update grid balancing time
	grid.LastBalanced = time.Now()
	_, err = h.db.Collection("grid_networks").UpdateOne(
		context.Background(),
		bson.M{"_id": gridID},
		bson.M{"$set": bson.M{"child_nodes": grid.ChildNodes, "last_balanced": grid.LastBalanced}},
	)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update grid network"})
	}

	// Step 5: Return updated grid (but fetch transfers from `energy_transfers`)
	return c.JSON(fiber.Map{
		"grid":      grid,
		"transfers": transfers, // Transfers are still returned, but they are stored in energy_transfers
	})
}

func (h *GridDistributionHandler) calculateBaseDistribution(grid *models.GridNetwork) error {
    totalDemand := 0.0
    for _, node := range grid.ChildNodes {
        totalDemand += node.CurrentDemand
    }

    fmt.Printf("Total Demand: %f, Total Capacity: %f\n", totalDemand, grid.TotalCapacity)

    if totalDemand <= grid.TotalCapacity {
        for i := range grid.ChildNodes {
            grid.ChildNodes[i].AllocatedPower = grid.ChildNodes[i].CurrentDemand
            fmt.Printf("Node: %s allocated exact demand: %f\n", grid.ChildNodes[i].ID.Hex(), grid.ChildNodes[i].AllocatedPower)
			fmt.Printf("Node: %s allocated exact supply: %f\n", grid.ChildNodes[i].ID.Hex(), grid.ChildNodes[i].CurrentDemand)
        }
    }

    return nil
}



func calculateDistance(loc1, loc2 models.Location) float64 {
	const R = 6371

	lat1 := loc1.Latitude * math.Pi / 180
	lat2 := loc2.Latitude * math.Pi / 180
	dLat := (loc2.Latitude - loc1.Latitude) * math.Pi / 180
	dLon := (loc2.Longitude - loc1.Longitude) * math.Pi / 180

	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Cos(lat1)*math.Cos(lat2)*
			math.Sin(dLon/2)*math.Sin(dLon/2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	return R * c
}

func calculateLossRate(distance float64) float64 {
	return math.Min(0.005*(distance/10), 0.5)
}
