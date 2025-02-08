package models

import (
	"time"

	"github.com/golang-jwt/jwt/v4"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	Name       string             `bson:"name"`
	Email      string             `bson:"email"`
	Password   string             `bson:"password"`
	Role       string             `json:"role"`
	Enterprise string             `json:"enterprise,omitempty"`
}

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Claims struct {
	Username   string `json:"username"`
	Role       string `json:"role"`
	Enterprise string `json:"enterprise,omitempty"`
	jwt.RegisteredClaims
}

func (c *Claims) Valid() error {
	if c.ExpiresAt.Time.Before(time.Now()) {
		return jwt.ErrTokenExpired
	}
	return nil
}
