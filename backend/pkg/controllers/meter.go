package controllers

import (
	"context"
	"log"
	"time"

	"github.com/ABHINAVGARG05/DJANGO_UNCHAINED/pkg/db"
	"github.com/ABHINAVGARG05/DJANGO_UNCHAINED/pkg/models"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

func GetMeters(c *fiber.Ctx) error {
	collection := db.DB.Collection("meters")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}
	defer cursor.Close(ctx)

	var meters []models.Meter
	if err := cursor.All(ctx, &meters); err != nil {
		log.Fatal(err)
	}

	return c.JSON(meters)
}
