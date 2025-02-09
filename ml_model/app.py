from fastapi import FastAPI
import pandas as pd
import numpy as np
import joblib
from pydantic import BaseModel
import uvicorn

# Load the trained model
from yantra_model import xgb_model, scaler

# Load dataset
df = pd.read_csv("updated_solar.csv")
df.fillna(method='ffill', inplace=True)  # Handle missing values

# Define FastAPI app
app = FastAPI()

# Define request body model
class ForecastRequest(BaseModel):
    date: str  # Expected format: 'YYYY-MM-DD'

# Feature columns used in training
feature_columns = [
    "hour_sin", "hour_cos", "dayofyear_sin", "dayofyear_cos",
    "DE_ALLSKY_SFC_SW_DNI", "DE_T2M", "DE_RH2M", "DE_PRECTOTCORR", "DE_PS"
]

def preprocess_input(date: str):
    """Prepares input features for the model."""
    filtered_data = df[df['datetime'].str.contains(date)].copy()
    
    if filtered_data.empty:
        return None
    
    X = filtered_data[feature_columns]
    X_scaled = scaler.transform(X)  # Scale features
    return X_scaled, filtered_data

@app.post("/forecast")
def forecast_energy(data: ForecastRequest):
    """Returns forecasted supply and demand."""
    X_scaled, filtered_data = preprocess_input(data.date)
    
    if X_scaled is None:
        return {"error": "No data available for the given date."}
    
    # Predict energy supply using model
    forecasted_supply = xgb_model.predict(X_scaled).tolist()
    
    # Get demand forecast from dataset
    forecasted_demand = filtered_data['DE_load_actual_entsoe_transparency'].tolist()
    
    renewable_energy = filtered_data['DE_solar_generation_actual'] / filtered_data['DE_load_actual_entsoe_transparency']
    renewable_energy = (renewable_energy.fillna(0) * 100).tolist()
    
    response = []
    for i in range(len(forecasted_supply)):
        response.append({
            "timestamp": filtered_data.iloc[i]['datetime'],
            "forecasted_supply_kw": round(forecasted_supply[i], 2),
            "forecasted_demand_kw": round(forecasted_demand[i], 2),
            "renewable_energy_%": round(renewable_energy[i], 2)
        })
    
    return response

@app.get("/")
def home():
    return {"message": "Welcome to the Energy Forecast API! Use /forecast with a date parameter."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)