package routes

import (
	"github.com/ABHINAVGARG05/DJANGO_UNCHAINED/pkg/controllers"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func SetupPowerRoutes(app *fiber.App, db *mongo.Database) {
	handler := controllers.NewPowerHandler(db)

	power := app.Group("/api/power")
	power.Get("/generation", handler.GetRealTimePowerGeneration)
	power.Get("/demand", handler.GetZoneDemandSupply)
	power.Get("/forecast", handler.GetPowerForecast)

	outages := app.Group("/api/outages")
	outages.Get("/active", handler.GetActiveOutages)

	incidents := app.Group("/api/incidents")
	incidents.Get("/", handler.GetIncidents)

	ai := app.Group("/api/ai")
	ai.Get("/recommendations", handler.GetAIRecommendations)
}
