package controllers

import (
	"context"
	"time"

	"github.com/ABHINAVGARG05/DJANGO_UNCHAINED/pkg/models"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type PowerHandler struct {
	db *mongo.Database
}

func NewPowerHandler(db *mongo.Database) *PowerHandler {
	return &PowerHandler{db: db}
}

func (h *PowerHandler) GetRealTimePowerGeneration(c *fiber.Ctx) error {
	opts := options.FindOne().SetSort(bson.M{"timestamp": -1})

	var generation models.PowerGeneration
	err := h.db.Collection("power_generation").FindOne(
		context.Background(),
		bson.M{},
		opts,
	).Decode(&generation)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch power generation data",
		})
	}

	return c.JSON(generation)
}

// GetZoneDemandSupply gets real-time demand and supply for a zone
func (h *PowerHandler) GetZoneDemandSupply(c *fiber.Ctx) error {
	zoneID := c.Query("zone_id")
	if zoneID == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Zone ID is required",
		})
	}

	opts := options.FindOne().SetSort(bson.M{"timestamp": -1})

	var demandSupply models.PowerDemandSupply
	err := h.db.Collection("power_demand_supply").FindOne(
		context.Background(),
		bson.M{"zone_id": zoneID},
		opts,
	).Decode(&demandSupply)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch demand and supply data",
		})
	}

	return c.JSON(demandSupply)
}

// GetPowerForecast gets forecasted power data for a specific date
func (h *PowerHandler) GetPowerForecast(c *fiber.Ctx) error {
	dateStr := c.Query("date")
	if dateStr == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Date is required (YYYY-MM-DD)",
		})
	}

	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid date format",
		})
	}

	nextDay := date.AddDate(0, 0, 1)

	var forecasts []models.PowerForecast
	cursor, err := h.db.Collection("power_forecasts").Find(
		context.Background(),
		bson.M{
			"timestamp": bson.M{
				"$gte": date,
				"$lt":  nextDay,
			},
		},
	)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch forecast data",
		})
	}

	if err := cursor.All(context.Background(), &forecasts); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to process forecast data",
		})
	}

	return c.JSON(forecasts)
}

// GetActiveOutages gets all active outages
func (h *PowerHandler) GetActiveOutages(c *fiber.Ctx) error {
	var outages []models.Outage
	cursor, err := h.db.Collection("outages").Find(
		context.Background(),
		bson.M{"status": "Ongoing"},
	)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch outages",
		})
	}

	if err := cursor.All(context.Background(), &outages); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to process outages data",
		})
	}

	return c.JSON(outages)
}

// GetIncidents gets incident reports filtered by severity
func (h *PowerHandler) GetIncidents(c *fiber.Ctx) error {
	severity := c.Query("severity", "all")

	filter := bson.M{}
	if severity != "all" {
		filter["severity"] = severity
	}

	var incidents []models.Incident
	cursor, err := h.db.Collection("incidents").Find(
		context.Background(),
		filter,
	)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch incidents",
		})
	}

	if err := cursor.All(context.Background(), &incidents); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to process incidents data",
		})
	}

	return c.JSON(incidents)
}

// GetAIRecommendations gets AI-driven recommendations
func (h *PowerHandler) GetAIRecommendations(c *fiber.Ctx) error {
	var recommendations []models.AIRecommendation
	cursor, err := h.db.Collection("ai_recommendations").Find(
		context.Background(),
		bson.M{},
		options.Find().SetSort(bson.M{"timestamp": -1}).SetLimit(10),
	)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch recommendations",
		})
	}

	if err := cursor.All(context.Background(), &recommendations); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to process recommendations data",
		})
	}

	return c.JSON(recommendations)
}
