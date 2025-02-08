package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type GridNetwork struct {
	ID            primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	ParentNodeID  primitive.ObjectID `json:"parent_node_id" bson:"parent_node_id"`
	ChildNodes    []ChildNode        `json:"child_nodes" bson:"child_nodes"`
	TotalCapacity float64            `json:"total_capacity" bson:"total_capacity"` // in MW
	CurrentLoad   float64            `json:"current_load" bson:"current_load"`     // in MW
	LastBalanced  time.Time          `json:"last_balanced" bson:"last_balanced"`
}

type ChildNode struct {
	ID             primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name           string             `json:"name" bson:"name"`
	Location       Location           `json:"location" bson:"location"`
	Capacity       float64            `json:"capacity" bson:"capacity"`               // in MW
	CurrentDemand  float64            `json:"current_demand" bson:"current_demand"`   // in MW
	AllocatedPower float64            `json:"allocated_power" bson:"allocated_power"` // in MW
	Distance       float64            `json:"distance" bson:"distance"`               // distance from parent in km
}

type EnergyTransfer struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	FromNodeID   primitive.ObjectID `json:"from_node_id" bson:"from_node_id"`
	ToNodeID     primitive.ObjectID `json:"to_node_id" bson:"to_node_id"`
	Amount       float64            `json:"amount" bson:"amount"` // in MW
	TransferTime time.Time          `json:"transfer_time" bson:"transfer_time"`
	LossEstimate float64            `json:"loss_estimate" bson:"loss_estimate"` // in %
}
