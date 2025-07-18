
from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI()
model = joblib.load("crowe_yield_predictor_rf.pkl")

class YieldInput(BaseModel):
    species: str
    substrate_type: str
    incubation_temp: float
    fruiting_temp: float
    humidity_avg: float
    co2_ppm: float
    light_hours: float
    flush_number: int

@app.post("/predict-yield")
def predict_yield(data: YieldInput):
    df = pd.DataFrame([data.dict()])
    df = pd.get_dummies(df).reindex(columns=model.feature_names_in_, fill_value=0)
    pred = model.predict(df)[0]
    return {"predicted_yield": round(pred, 2)}
