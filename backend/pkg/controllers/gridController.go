package controllers

import (
	"context"
	"time"

	"github.com/ABHINAVGARG05/DJANGO_UNCHAINED/pkg/db"
	"github.com/ABHINAVGARG05/DJANGO_UNCHAINED/pkg/models"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetGrids(c *fiber.Ctx) error {
	var grids []models.Grid
	cursor, err := db.GetCollection("grids").Find(context.TODO(), bson.M{})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Error fetching grids"})
	}
	cursor.All(context.TODO(), &grids)
	return c.JSON(grids)
}

func UpdateGrid(c *fiber.Ctx) error {
	id, _ := primitive.ObjectIDFromHex(c.Params("id"))
	var updateData models.Grid
	if err := c.BodyParser(&updateData); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	_, err := db.GetCollection("grids").UpdateOne(context.TODO(),
		bson.M{"_id": id},
		bson.M{"$set": bson.M{
			"consumption": updateData.Consumption,
			"updated_at":  time.Now().Unix(),
		}},
	)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not update grid"})
	}
	return c.JSON(fiber.Map{"message": "Grid updated successfully"})
}
