package models

type Ward struct {
	Name         string  `json:"name"`
	Location     string  `json:"location"`
	Power_Demand float64 `json:"ps"`
	Power_Supply float64 `json:"pd"`
	Renewable    float64 `json:"r"`
}
