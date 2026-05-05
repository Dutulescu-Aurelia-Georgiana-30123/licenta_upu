from catboost import CatBoostClassifier

from final_pipeline import (
    predict_triage,
)


MODEL_URGENT_PATH = "models/model_urgent.cbm"
MODEL_RED_PATH = "models/model_red.cbm"
MODEL_GREEN_PATH = "models/model_green.cbm"


def load_models():
    model_urgent = CatBoostClassifier()
    model_red = CatBoostClassifier()
    model_green = CatBoostClassifier()

    model_urgent.load_model(MODEL_URGENT_PATH)
    model_red.load_model(MODEL_RED_PATH)
    model_green.load_model(MODEL_GREEN_PATH)

    return model_urgent, model_red, model_green


if __name__ == "__main__":
    model_urgent, model_red, model_green = load_models()

    pacient = {
        "varsta": 68,
        "sex": 1,
        "temperatura": 38.4,
        "puls": 118,
        "respiratie": 26,
        "ta_sistolica": 92,
        "ta_diastolica": 58,
        "saturatie": 91,
        "durere": 8,
        "ora_prezentare": 1345,
        "ambulanta": 1,
        "motiv1": "1055",
        "motiv2": "0",
        "motiv3": "0",
    }

    rezultat = predict_triage(
        pacient,
        model_urgent,
        model_red,
        model_green,
    )

    print("\nRezultat predicție:")
    print(rezultat)