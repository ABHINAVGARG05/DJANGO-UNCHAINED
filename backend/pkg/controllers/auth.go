package controllers

import (
	"context"
	"os"
	"time"

	"github.com/ABHINAVGARG05/DJANGO_UNCHAINED/pkg/db"
	"github.com/ABHINAVGARG05/DJANGO_UNCHAINED/pkg/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

func Register(c *fiber.Ctx) error {
	var userCollection = db.GetCollection("users")

	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	user.ID = primitive.NewObjectID()
	if user.Role == "enterprise_customer" && user.Enterprise == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Enterprise name required"})
	}

	_, err := userCollection.InsertOne(context.TODO(), user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not register user"})
	}

	return c.JSON(fiber.Map{"message": "User registered successfully"})
}

func Login(c *fiber.Ctx) error {
	var userCollection = db.GetCollection("users")

	var creds models.Credentials
	if err := c.BodyParser(&creds); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	var user models.User
	err := userCollection.FindOne(context.TODO(), bson.M{"username": creds.Username}).Decode(&user)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &models.Claims{
		Username:   creds.Username,
		Role:       user.Role,
		Enterprise: user.Enterprise,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not generate token"})
	}

	return c.JSON(fiber.Map{"token": tokenString})
}
