package main

import (
	"net/http"

	"github.com/ABHINAVGARG05/DJANGO_UNCHAINED/pkg/models"
	"github.com/gofiber/fiber/v2"
)

func main() {

	app := fiber.New()

	app.Get("/ping", func(c *fiber.Ctx) error {
		return c.Status(http.StatusOK).JSON(&models.Response{
			Status:  "success",
			Message: "pong",
		})
	})

	app.Listen(":8080")

}
