package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PowerGeneration struct {
	ID                  primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Timestamp           time.Time          `json:"timestamp" bson:"timestamp"`
	TotalGenerationMW   float64            `json:"total_generation_mw" bson:"total_generation_mw"`
	SolarMW             float64            `json:"solar_mw" bson:"solar_mw"`
	WindMW              float64            `json:"wind_mw" bson:"wind_mw"`
	ConventionalMW      float64            `json:"conventional_mw" bson:"conventional_mw"`
	RenewablePercentage float64            `json:"renewable_percentage" bson:"renewable_percentage"`
	Efficiency          float64            `json:"efficiency" bson:"efficiency"`
}

type PowerDemandSupply struct {
	ID                  primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	ZoneID              string             `json:"zone_id" bson:"zone_id"`
	Timestamp           time.Time          `json:"timestamp" bson:"timestamp"`
	DemandKW            float64            `json:"demand_kw" bson:"demand_kw"`
	SupplyKW            float64            `json:"supply_kw" bson:"supply_kw"`
	RenewablePercentage float64            `json:"renewable_percentage" bson:"renewable_percentage"`
}

type PowerForecast struct {
	ID                  primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Timestamp           time.Time          `json:"timestamp" bson:"timestamp"`
	ZoneID              string             `json:"zone_id" bson:"zone_id"`
	ForecastedSupplyKW  float64            `json:"forecasted_supply_kw" bson:"forecasted_supply_kw"`
	ForecastedDemandKW  float64            `json:"forecasted_demand_kw" bson:"forecasted_demand_kw"`
	RenewablePercentage float64            `json:"renewable_percentage" bson:"renewable_percentage"`
}

type Outage struct {
	ID             primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	OutageID       string             `json:"outage_id" bson:"outage_id"`
	ZoneID         string             `json:"zone_id" bson:"zone_id"`
	IncidentType   string             `json:"incident_type" bson:"incident_type"`
	StartTime      time.Time          `json:"start_time" bson:"start_time"`
	EndTime        *time.Time         `json:"end_time,omitempty" bson:"end_time,omitempty"`
	ImpactLevel    string             `json:"impact_level" bson:"impact_level"`
	Cause          string             `json:"cause" bson:"cause"`
	ImpactedUsers  int                `json:"impacted_users" bson:"impacted_users"`
	Status         string             `json:"status" bson:"status"`
	ResolutionTime *time.Duration     `json:"resolution_time,omitempty" bson:"resolution_time,omitempty"`
	ActionsTaken   string             `json:"actions_taken" bson:"actions_taken"`
}

type Incident struct {
	ID              primitive.ObjectID   `json:"id" bson:"_id,omitempty"`
	IncidentID      string               `json:"incident_id" bson:"incident_id"`
	Timestamp       time.Time            `json:"timestamp" bson:"timestamp"`
	Description     string               `json:"description" bson:"description"`
	Severity        string               `json:"severity" bson:"severity"`
	AffectedSources []primitive.ObjectID `json:"affected_sources" bson:"affected_sources"`
}

type AIRecommendation struct {
	ID             primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Timestamp      time.Time          `json:"timestamp" bson:"timestamp"`
	Recommendation string             `json:"recommendation" bson:"recommendation"`
	TargetArea     string             `json:"target_area" bson:"target_area"`
	ExpectedImpact string             `json:"expected_impact" bson:"expected_impact"`
}

const (
	StatusResolving = "resolving"
	StatusResolved  = "resolved"
)

type IncidentHistory struct {
	ID             primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Date           primitive.DateTime `json:"date" bson:"date"`
	Duration       int64              `json:"duration" bson:"duration"`
	Area           string             `json:"area" bson:"area"`
	Cause          string             `json:"cause" bson:"cause"`
	ImpactedUsers  int64              `json:"impacted" bson:"impacted"`
	Status         string             `json:"status" bson:"status"`
	ResolutionTime primitive.DateTime `json:"res_time" bson:"res_time"`
	Action         string             `json:"action" bson:"action"`
}