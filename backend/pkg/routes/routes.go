package routes

import (
	"github.com/ABHINAVGARG05/DJANGO_UNCHAINED/pkg/controllers"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func SetupGridDistributionRoutes(app *fiber.App, db *mongo.Database) {
	handler := controllers.NewGridDistributionHandler(db)
	
	grid := app.Group("/api/grid-distribution")
	grid.Post("/balance/:gridId", handler.BalanceGridEnergy)
} 