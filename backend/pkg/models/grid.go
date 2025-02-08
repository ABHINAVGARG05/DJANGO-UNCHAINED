package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Grid struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Ward        string             `json:"ward"`
	Consumption float64            `json:"consumption"`
	Predicted   float64            `json:"predicted"`
	UpdatedAt   int64              `json:"updated_at"`
}
