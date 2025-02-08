package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/ABHINAVGARG05/DJANGO_UNCHAINED/pkg/models"
	"github.com/gofiber/fiber/v2"
)

type PredictionRequest struct {
	Ward  string  `json:"ward"`
	Usage float64 `json:"usage"`
}

type PredictionResponse struct {
	Predicted float64 `json:"predicted"`
}

func GetPrediction(ward string, usage float64, c *fiber.Ctx) ( error) {
	requestBody, _ := json.Marshal(PredictionRequest{Ward: ward, Usage: usage})
	resp, err := http.Post("http://localhost:8000/predict", "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(&models.Response{
			Status:"fail",
			Message:err.Error(),
		})
	}
	defer resp.Body.Close()

	var result PredictionResponse
	json.NewDecoder(resp.Body).Decode(&result)
	return c.Status(http.StatusOK).JSON(&models.Response{
		Status:"success",
		Message: "Result fetched successfully",
		Data:result.Predicted,
	})
}
