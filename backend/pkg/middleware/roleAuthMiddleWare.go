package middleware

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func RoleMiddleware(requiredRole string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userRole, ok := c.Locals("userRole").(string)
		if !ok || userRole == "" {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized: User role not found",
			})
		}

		if userRole != requiredRole && userRole != "admin" {
			return c.Status(http.StatusForbidden).JSON(fiber.Map{
				"error": "Access denied: Insufficient permissions",
			})
		}

		return c.Next()
	}
}
