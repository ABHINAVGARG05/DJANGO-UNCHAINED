package routes

import (
	"github.com/ABHINAVGARG05/DJANGO_UNCHAINED/pkg/controllers"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")
	api.Get("/grids", controllers.GetGrids)
	api.Patch("/grid/:id", controllers.UpdateGrid)
}
