package controllers

import (
	"context"

	"github.com/ABHINAVGARG05/DJANGO_UNCHAINED/pkg/db"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func UpdateRole(c *fiber.Ctx) error {
	id, _ := primitive.ObjectIDFromHex(c.Params("id"))
	var req struct {
		Role       string `json:"role"`
		Enterprise string `json:"enterprise,omitempty"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	updateData := bson.M{"role": req.Role}
	if req.Role == "enterprise_customer" && req.Enterprise != "" {
		updateData["enterprise"] = req.Enterprise
	}

	_, err := db.GetCollection("users").UpdateOne(context.TODO(), bson.M{"_id": id}, bson.M{"$set": updateData})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not update role"})
	}

	return c.JSON(fiber.Map{"message": "Role updated successfully"})
}
