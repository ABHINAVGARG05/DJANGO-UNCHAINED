package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Meter struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	Location   string             `bson:"location"`
	WardID     primitive.ObjectID `bson:"ward_id"`
	Status     string             `bson:"status"`
	LastUpdate int64              `bson:"last_update"`
}
