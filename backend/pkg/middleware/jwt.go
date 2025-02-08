package middleware

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/ABHINAVGARG05/DJANGO_UNCHAINED/pkg/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)


var jwtSecret = []byte(os.Getenv("JWTSECRET"))

const UserKey = "userID"

func CreateJWT(userID string) (string, error) {
	expirationString := os.Getenv("JWTEXPINSEC")
	expirationSeconds, err := strconv.Atoi(expirationString)
	if err != nil {
		log.Println("Error parsing JWT expiration time:", err)
		expirationSeconds = 3600 
	}

	expiration := time.Duration(expirationSeconds) * time.Second

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID":    userID,
		"expiredAt": time.Now().Add(expiration).Unix(),
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}

	log.Printf("Created Token: %s", tokenString)
	return tokenString, nil
}

func WithJWTAuth() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Missing or invalid token"})
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
		}

		claims, _ := token.Claims.(jwt.MapClaims)
		c.Locals("role", claims["role"])
		c.Locals("enterprise", claims["enterprise"])

		return c.Next()
	}
}


func getTokenFromRequest(c *fiber.Ctx) string {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return ""
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return ""
	}

	return parts[1]
}

func validateJWT(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})
}

func permissionDenied(c *fiber.Ctx) error {
	return c.Status(http.StatusUnauthorized).JSON(&models.Response{
		Status:  "fail",
		Message: "Unauthorized",
	})
}

func GetUserIDFromContext(ctx context.Context) string {
	userID, ok := ctx.Value(UserKey).(string)
	if !ok {
		return "nil"
	}
	return userID
}
