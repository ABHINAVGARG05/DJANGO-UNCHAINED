package routes

import (
	"github.com/ABHINAVGARG05/DJANGO_UNCHAINED/pkg/controllers"
	"github.com/ABHINAVGARG05/DJANGO_UNCHAINED/pkg/middleware"
	"github.com/gofiber/fiber/v2"
)

func AuthRoutes(app *fiber.App) {
	api := app.Group("/api")

	api.Post("/register", controllers.Register)
	api.Post("/login", controllers.Login)

	protected := api.Group("/admin", middleware.WithJWTAuth())
	protected.Patch("/user/:id/role", controllers.UpdateRole)
}
