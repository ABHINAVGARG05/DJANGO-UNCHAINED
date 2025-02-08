package controllers

import (
	"context"
	"time"

	"github.com/ABHINAVGARG05/DJANGO_UNCHAINED/pkg/models"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type HistoryHandler struct {
	db *mongo.Database
}

func NewHistoryHandler(db *mongo.Database) *HistoryHandler {
	return &HistoryHandler{db: db}
}

func (h *HistoryHandler) GetZoneHistory(c *fiber.Ctx) error {
	zoneID := c.Params("zoneId")
	period := c.Query("period")

	endDate := time.Now()
	var startDate time.Time

	switch period {
	case "7days":
		startDate = endDate.AddDate(0, 0, -7)
	case "30days":
		startDate = endDate.AddDate(0, 0, -30)
	case "quarter":
		startDate = endDate.AddDate(0, -3, 0)
	case "year":
		startDate = endDate.AddDate(-1, 0, 0)
	default:
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid period specified",
		})
	}

	pipeline := []bson.M{
		{
			"$match": bson.M{
				"zone_id": zoneID,
				"timestamp": bson.M{
					"$gte": startDate,
					"$lte": endDate,
				},
			},
		},
		{
			"$group": bson.M{
				"_id":                     nil,
				"total_power_consumption": bson.M{"$sum": "$power_usage"},
				"average_peak_demand":     bson.M{"$avg": "$peak_demand"},
				"average_load":            bson.M{"$avg": "$load_percentage"},
			},
		},
	}

	cursor, err := h.db.Collection("power_consumption").Aggregate(context.Background(), pipeline)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch history data",
		})
	}

	var results []bson.M
	if err := cursor.All(context.Background(), &results); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to process history data",
		})
	}

	if len(results) == 0 {
		return c.JSON(models.HistoryResponse{
			TotalPowerConsumption: 0,
			AveragePeakDemand:     0,
			AverageLoad:           0,
			Period:                period,
		})
	}

	response := models.HistoryResponse{
		TotalPowerConsumption: results[0]["total_power_consumption"].(float64),
		AveragePeakDemand:     results[0]["average_peak_demand"].(float64),
		AverageLoad:           results[0]["average_load"].(float64),
		Period:                period,
	}

	return c.JSON(response)
}
