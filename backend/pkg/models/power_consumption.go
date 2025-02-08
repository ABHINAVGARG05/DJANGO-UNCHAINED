package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PowerConsumption struct {
	ID             primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	ZoneID         string             `json:"zone_id" bson:"zone_id"`
	Timestamp      time.Time          `json:"timestamp" bson:"timestamp"`
	PowerUsage     float64            `json:"power_usage" bson:"power_usage"`     
	PeakDemand     float64            `json:"peak_demand" bson:"peak_demand"`         
	LoadPercentage float64            `json:"load_percentage" bson:"load_percentage"` 
}

type HistoryResponse struct {
	TotalPowerConsumption float64 `json:"total_power_consumption"`
	AveragePeakDemand     float64 `json:"average_peak_demand"`
	AverageLoad           float64 `json:"average_load"`
	Period                string  `json:"period"`
}
