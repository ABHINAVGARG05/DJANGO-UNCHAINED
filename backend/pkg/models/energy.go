package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type EnergyConsumption struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	WardID     string             `bson:"ward_id"`
	PowerUsage float64            `bson:"power_usage"`
	Timestamp  int64              `bson:"timestamp"`
}
