package routes

import (
	"github.com/ABHINAVGARG05/DJANGO_UNCHAINED/pkg/controllers"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func SetupHistoryRoutes(app *fiber.App, db *mongo.Database) {
    handler := controllers.NewHistoryHandler(db)
    
    history := app.Group("/api/history")
    history.Get("/zone/:zoneId", handler.GetZoneHistory)
}