from typing import Dict, Any

from fastapi import FastAPI
from catboost import CatBoostClassifier

from src.final_pipeline import predict_triage,normalize_patient_input,prepare_single_patient,apply_safety_rules
from fastapi.middleware.cors import CORSMiddleware


MODEL_URGENT_PATH = "models/model_urgent.cbm"
MODEL_RED_PATH = "models/model_red.cbm"
MODEL_GREEN_PATH = "models/model_green.cbm"

app = FastAPI(title="AI Triage API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_urgent = CatBoostClassifier()
model_red = CatBoostClassifier()
model_green = CatBoostClassifier()

model_urgent.load_model(MODEL_URGENT_PATH)
model_red.load_model(MODEL_RED_PATH)
model_green.load_model(MODEL_GREEN_PATH)


@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "AI Triage API rulează. Intră pe /docs pentru testare."
    }


@app.post("/predict")
def predict(patient: Dict[str, Any]):
    rezultat = predict_triage(
        patient,
        model_urgent,
        model_red,
        model_green,
    )

    return rezultat