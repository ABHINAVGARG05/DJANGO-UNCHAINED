package routes

import (
	"github.com/ABHINAVGARG05/DJANGO_UNCHAINED/pkg/controllers"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")
	api.Get("/grids", controllers.GetGrids)
	api.Patch("/grid/:id", controllers.UpdateGrid)
}

func SetupGridRoutes(app *fiber.App, db *mongo.Database) {
	handler := controllers.NewGridDistributionHandler(db)

	grid := app.Group("/api/grid")
	grid.Post("/balance/:gridId", handler.BalanceGridEnergy)
}
