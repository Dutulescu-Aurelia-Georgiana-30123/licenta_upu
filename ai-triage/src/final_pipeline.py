import os
import pandas as pd

from catboost import CatBoostClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score


CSV_PATH = "data/processed/all_years.csv"
KAGGLE_CSV_PATH = "data/processed/kaggle_triage.csv"

URGENT_THRESHOLD = 0.5
RED_THRESHOLD = 0.55
GREEN_THRESHOLD = 0.5


FEATURE_COLS = [
    "AGE", "SEX", "TEMPF", "PULSE", "RESPR", "BPSYS", "BPDIAS",
    "SPO2",
    "PAINSCALE", "ARRTIME", "ARREMS",
    "RFV1", "RFV2", "RFV3",
    "POPCT", "SEEN72", "INJURY", "INJPOISAD", "TOTCHRON",
    "HTN", "CHF", "COPD", "CKD", "CAD", "OBESITY", "OSA",
    "DIABTYP1", "DIABTYP2",
    "ASTHMA", "CANCER", "ESRD", "ALZHD", "DEPRN", "HYPLIPID",
]

ENGINEERED_COLS = [
    "shock_index",
    "pulse_temp_ratio",
    "is_tachycardic",
    "is_hypotensive",
    "is_fever",
    "high_pain",
    "critical_combo",
    "low_oxygen",
]

CAT_COLS = ["RFV1", "RFV2", "RFV3", "SEX", "ARREMS"]

FIELD_ALIASES = {
    "varsta": "AGE",
    "vârsta": "AGE",
    "age": "AGE",

    "sex": "SEX",

    "temperatura": "TEMPF",
    "temp": "TEMPF",

    "puls": "PULSE",
    "puls_bpm": "PULSE",
    "frecventa_cardiaca": "PULSE",
    "frecvență_cardiacă": "PULSE",

    "respiratie": "RESPR",
    "respirație": "RESPR",
    "frecventa_respiratorie": "RESPR",
    "frecvență_respiratorie": "RESPR",

    "ta_sistolica": "BPSYS",
    "ta_sistolică": "BPSYS",
    "tensiune_sistolica": "BPSYS",
    "tensiune_sistolică": "BPSYS",

    "ta_diastolica": "BPDIAS",
    "ta_diastolică": "BPDIAS",
    "tensiune_diastolica": "BPDIAS",
    "tensiune_diastolică": "BPDIAS",

    "saturatie": "SPO2",
    "saturație": "SPO2",
    "spo2": "SPO2",
    "oxygen_saturation": "SPO2",

    "durere": "PAINSCALE",
    "scor_durere": "PAINSCALE",

    "ora_prezentare": "ARRTIME",
    "ambulanta": "ARREMS",
    "ambulanță": "ARREMS",

    "motiv1": "RFV1",
    "motiv2": "RFV2",
    "motiv3": "RFV3",

    "fara_puls": "NO_PULSE",
    "fără_puls": "NO_PULSE",
    "apnee": "APNEA",
    "inconstient": "UNCONSCIOUS",
    "inconștient": "UNCONSCIOUS",
    "detresa_respiratorie_severa": "SEVERE_RESP_DISTRESS",
    "detresă_respiratorie_severă": "SEVERE_RESP_DISTRESS",
    "sangerare_majora": "MAJOR_BLEEDING",
    "sângerare_majoră": "MAJOR_BLEEDING",
}


def normalize_patient_input(patient: dict) -> dict:
    normalized = {}

    for key, value in patient.items():
        clean_key = str(key).strip().lower()
        target_key = FIELD_ALIASES.get(clean_key, key)
        normalized[target_key] = value

    return normalized


def add_engineered_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    if "SPO2" not in df.columns:
        df["SPO2"] = 98

    df["BPSYS"] = df["BPSYS"].replace(0, 120)
    df["TEMPF"] = df["TEMPF"].replace(0, 980)

    df["shock_index"] = df["PULSE"] / df["BPSYS"]
    df["pulse_temp_ratio"] = df["PULSE"] / df["TEMPF"]
    df["is_tachycardic"] = (df["PULSE"] > 100).astype(int)
    df["is_hypotensive"] = (df["BPSYS"] < 90).astype(int)
    df["is_fever"] = (df["TEMPF"] > 1000).astype(int)
    df["high_pain"] = (df["PAINSCALE"] >= 7).astype(int)

    df["critical_combo"] = (
        (df["PULSE"] > 110) &
        (df["BPSYS"] < 100) &
        (df["RESPR"] > 22)
    ).astype(int)

    df["low_oxygen"] = (df["SPO2"] < 92).astype(int)

    return df


def prepare_common_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    defaults = {
        "AGE": 40,
        "SEX": 1,
        "TEMPF": 980,
        "PULSE": 80,
        "RESPR": 18,
        "BPSYS": 120,
        "BPDIAS": 80,
        "SPO2": 98,
        "PAINSCALE": 0,
        "ARRTIME": 1200,
        "ARREMS": 2,
        "RFV1": "0",
        "RFV2": "0",
        "RFV3": "0",
        "POPCT": 0,
        "SEEN72": 0,
        "INJURY": 0,
        "INJPOISAD": 0,
        "TOTCHRON": 0,
        "HTN": 0,
        "CHF": 0,
        "COPD": 0,
        "CKD": 0,
        "CAD": 0,
        "OBESITY": 0,
        "OSA": 0,
        "DIABTYP1": 0,
        "DIABTYP2": 0,
        "ASTHMA": 0,
        "CANCER": 0,
        "ESRD": 0,
        "ALZHD": 0,
        "DEPRN": 0,
        "HYPLIPID": 0,
    }

    for col, val in defaults.items():
        if col not in df.columns:
            df[col] = val
        else:
            df[col] = df[col].fillna(val)

    df["ARRTIME"] = df["ARRTIME"].astype(str)
    df["ARRTIME"] = df["ARRTIME"].str.replace("b'", "", regex=False)
    df["ARRTIME"] = df["ARRTIME"].str.replace("'", "", regex=False)
    df["ARRTIME"] = pd.to_numeric(df["ARRTIME"], errors="coerce").fillna(1200)

    for col in CAT_COLS:
        df[col] = df[col].astype(str)

    df = add_engineered_features(df)

    return df[FEATURE_COLS + ENGINEERED_COLS + ["IMMEDR"]]


def load_and_prepare_base_data(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path, low_memory=False)

    needed_cols = [col for col in FEATURE_COLS if col in df.columns] + ["IMMEDR"]
    df = df[needed_cols].copy()

    for col in ["TEMPF", "PULSE", "RESPR", "BPSYS", "BPDIAS"]:
        df = df[df[col] > 0]

    df = df[df["PULSE"] < 250]
    df = df[df["BPSYS"] < 300]
    df = df[df["BPDIAS"] < 200]
    df = df[df["RESPR"] < 60]
    df = df[df["TEMPF"] < 1100]
    df = df[df["PAINSCALE"] >= 0]
    df = df[df["ARREMS"].isin([1, 2])]
    df = df[df["IMMEDR"].isin([1, 2, 3, 4, 5])]

    for col in ["RFV1", "RFV2", "RFV3"]:
        df = df[df[col].notna()]

    df = prepare_common_columns(df)

    return df


def map_kaggle_triage_to_immedr(level):
    if level == 3:
        return 1  # rosu
    if level == 2:
        return 2  # galben
    if level == 1:
        return 3  # verde
    return 5      # consult


def load_and_prepare_kaggle_data(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path)

    df = df.rename(columns={
        "age": "AGE",
        "heart_rate": "PULSE",
        "systolic_blood_pressure": "BPSYS",
        "oxygen_saturation": "SPO2",
        "body_temperature": "TEMPF",
        "pain_level": "PAINSCALE",
        "chronic_disease_count": "TOTCHRON",
        "previous_er_visits": "SEEN72",
        "arrival_mode": "ARREMS",
    })

    df["IMMEDR"] = df["triage_level"].apply(map_kaggle_triage_to_immedr)

    # Kaggle temperatura este în Celsius. O convertim în Fahrenheit x10,
    # ca să fie compatibilă cu NHAMCS/TEMPF.
    df["TEMPF"] = ((df["TEMPF"] * 9 / 5) + 32) * 10

    df["BPDIAS"] = df["BPSYS"] * 0.6
    df["RESPR"] = 18
    df["ARRTIME"] = 1200

    df["ARREMS"] = df["ARREMS"].map({
        "ambulance": 1,
        "walk_in": 2,
    }).fillna(2)

    df["RFV1"] = "0"
    df["RFV2"] = "0"
    df["RFV3"] = "0"

    df = df[df["PULSE"] > 0]
    df = df[df["BPSYS"] > 0]
    df = df[df["SPO2"] > 0]
    df = df[df["PAINSCALE"] >= 0]
    df = df[df["IMMEDR"].isin([1, 2, 3, 4, 5])]

    df = prepare_common_columns(df)

    return df


def load_training_data() -> pd.DataFrame:
    print("Se încarcă NHAMCS...")
    df_nhamcs = load_and_prepare_base_data(CSV_PATH)
    df_nhamcs["DATA_SOURCE"] = "NHAMCS"

    if os.path.exists(KAGGLE_CSV_PATH):
        print("Se încarcă Kaggle triage...")
        df_kaggle = load_and_prepare_kaggle_data(KAGGLE_CSV_PATH)
        df_kaggle["DATA_SOURCE"] = "KAGGLE"

        df_all = pd.concat([df_nhamcs, df_kaggle], ignore_index=True)
    else:
        print(f"Nu am găsit {KAGGLE_CSV_PATH}. Se folosește doar NHAMCS.")
        df_all = df_nhamcs

    print("\nDistribuție sursă date:")
    print(df_all["DATA_SOURCE"].value_counts())

    print("\nDistribuție IMMEDR:")
    print(df_all["IMMEDR"].value_counts().sort_index())

    return df_all


def get_feature_cols():
    return FEATURE_COLS + ENGINEERED_COLS


def get_cat_feature_indices(columns):
    return [columns.get_loc(col) for col in CAT_COLS]


def train_binary_model(
    df: pd.DataFrame,
    target_col: str,
    model_name: str,
    class_weights=None,
    eval_metric="Recall",
):
    X = df[get_feature_cols()]
    y = df[target_col]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    model = CatBoostClassifier(
        iterations=700,
        depth=6,
        learning_rate=0.05,
        loss_function="Logloss",
        eval_metric=eval_metric,
        random_seed=42,
        verbose=100,
        class_weights=class_weights,
    )

    print(f"\nAntrenăm {model_name}")
    print("\nDistribuție target:")
    print(y.value_counts())

    model.fit(
        X_train,
        y_train,
        cat_features=get_cat_feature_indices(X.columns),
    )

    y_pred = model.predict(X_test).astype(int).ravel()

    print(f"\n=== EVALUARE {model_name} ===")
    print("\nAccuracy:")
    print(accuracy_score(y_test, y_pred))

    print("\nClassification report:")
    print(classification_report(y_test, y_pred, zero_division=0))

    print("\nConfusion matrix:")
    print(confusion_matrix(y_test, y_pred))

    return model


def train_all_models(df: pd.DataFrame):
    df = df.copy()

    df["target_urgent"] = df["IMMEDR"].apply(lambda x: 1 if x in [1, 2] else 0)

    model_urgent = train_binary_model(
        df=df,
        target_col="target_urgent",
        model_name="Model 1: urgent vs nonurgent",
        class_weights=[1, 5],
        eval_metric="Recall",
    )

    df_rg = df[df["IMMEDR"].isin([1, 2])].copy()
    df_rg["target_red"] = df_rg["IMMEDR"].apply(lambda x: 1 if x == 1 else 0)

    model_red = train_binary_model(
        df=df_rg,
        target_col="target_red",
        model_name="Model 2: rosu vs galben",
        class_weights=[1, 20],
        eval_metric="Recall",
    )

    df_gc = df[df["IMMEDR"].isin([3, 4, 5])].copy()
    df_gc["target_green"] = df_gc["IMMEDR"].apply(lambda x: 1 if x == 3 else 0)

    model_green = train_binary_model(
        df=df_gc,
        target_col="target_green",
        model_name="Model 3: verde vs consult",
        class_weights=[1, 1],
        eval_metric="F1",
    )

    return model_urgent, model_red, model_green


def save_models(model_urgent, model_red, model_green, models_dir="models"):
    os.makedirs(models_dir, exist_ok=True)

    model_urgent.save_model(os.path.join(models_dir, "model_urgent.cbm"))
    model_red.save_model(os.path.join(models_dir, "model_red.cbm"))
    model_green.save_model(os.path.join(models_dir, "model_green.cbm"))

    print("\nModelele au fost salvate în folderul models/")


def prepare_single_patient(patient: dict) -> pd.DataFrame:
    patient = normalize_patient_input(patient)
    df = pd.DataFrame([patient])

    defaults = {
        "AGE": 40,
        "SEX": 1,
        "TEMPF": 980,
        "PULSE": 80,
        "RESPR": 18,
        "BPSYS": 120,
        "BPDIAS": 80,
        "SPO2": 98,
        "PAINSCALE": 0,
        "ARRTIME": 1200,
        "ARREMS": 2,
        "RFV1": "0",
        "RFV2": "0",
        "RFV3": "0",
        "POPCT": 0,
        "SEEN72": 0,
        "INJURY": 0,
        "INJPOISAD": 0,
        "TOTCHRON": 0,
        "HTN": 0,
        "CHF": 0,
        "COPD": 0,
        "CKD": 0,
        "CAD": 0,
        "OBESITY": 0,
        "OSA": 0,
        "DIABTYP1": 0,
        "DIABTYP2": 0,
        "ASTHMA": 0,
        "CANCER": 0,
        "ESRD": 0,
        "ALZHD": 0,
        "DEPRN": 0,
        "HYPLIPID": 0,
    }

    for col, val in defaults.items():
        if col not in df.columns:
            df[col] = val

    df["ARRTIME"] = pd.to_numeric(df["ARRTIME"], errors="coerce").fillna(1200)

    # Dacă utilizatorul introduce temperatura în Celsius, o convertim automat.
    if df["TEMPF"].iloc[0] < 60:
        df["TEMPF"] = ((df["TEMPF"] * 9 / 5) + 32) * 10

    df = add_engineered_features(df)

    for col in CAT_COLS:
        df[col] = df[col].astype(str)

    return df[get_feature_cols()]


def apply_safety_rules(patient: dict):
    patient = normalize_patient_input(patient)

    pain = patient.get("PAINSCALE", 0)
    pulse = patient.get("PULSE", 80)
    respr = patient.get("RESPR", 18)
    bpsys = patient.get("BPSYS", 120)
    spo2 = patient.get("SPO2", 98)

    if patient.get("NO_PULSE", 0) == 1:
        return "rosu", ["Fără puls: intervenție salvatoare de viață necesară."]

    if patient.get("APNEA", 0) == 1:
        return "rosu", ["Apnee: risc vital imediat."]

    if patient.get("UNCONSCIOUS", 0) == 1:
        return "rosu", ["Inconștiență: modificare acută severă a statusului mental."]

    if patient.get("SEVERE_RESP_DISTRESS", 0) == 1:
        return "rosu", ["Detresă respiratorie severă."]

    if patient.get("MAJOR_BLEEDING", 0) == 1:
        return "rosu", ["Sângerare majoră: control imediat necesar."]

    if bpsys < 80:
        return "rosu", ["Hipotensiune severă: BPSYS < 80."]

    if spo2 < 88:
        return "rosu", ["Saturație oxigen foarte scăzută: SPO2 < 88%."]

    if respr >= 30:
        return "rosu", ["Detresă respiratorie/tahipnee severă: RESPR >= 30."]

    if pulse >= 140:
        return "rosu", ["Tahicardie severă: PULSE >= 140."]

    if pulse > 120 and bpsys < 100 and respr > 24:
        return "rosu", ["Pattern critic: tahicardie + hipotensiune + tahipnee."]

    if spo2 < 92:
        return "galben", ["Saturație oxigen scăzută: SPO2 < 92%."]

    if pain >= 7:
        return "galben", ["Durere severă: PAINSCALE >= 7."]

    if bpsys < 90:
        return "galben", ["Hipotensiune: BPSYS < 90."]

    return None, []


def predict_triage(
    patient: dict,
    model_urgent,
    model_red,
    model_green,
    urgent_threshold=URGENT_THRESHOLD,
    red_threshold=RED_THRESHOLD,
    green_threshold=GREEN_THRESHOLD,
):
    patient = normalize_patient_input(patient)

    safety_label, safety_reasons = apply_safety_rules(patient)

    if safety_label == "rosu":
        return {
            "predictie_finala": "rosu",
            "sursa_decizie": "safety_rules",
            "reguli_siguranta_aplicate": safety_reasons,
        }

    patient_df = prepare_single_patient(patient)

    prob_urgent = model_urgent.predict_proba(patient_df)[0][1]

    if prob_urgent >= urgent_threshold:
        prob_red = model_red.predict_proba(patient_df)[0][1]

        if prob_red >= red_threshold:
            final_label = "rosu"
        else:
            final_label = "galben"

        if safety_label == "galben":
            final_label = "galben"

        return {
            "decizie_etapa_1": "urgent",
            "predictie_finala": final_label,
            "prob_urgent": float(prob_urgent),
            "prob_red": float(prob_red),
            "reguli_siguranta_aplicate": safety_reasons,
            "sursa_decizie": "model_ierarhic",
        }

    prob_green = model_green.predict_proba(patient_df)[0][1]
    final_label = "verde" if prob_green >= green_threshold else "consult"

    if safety_label == "galben":
        final_label = "galben"

    return {
        "decizie_etapa_1": "nonurgent",
        "predictie_finala": final_label,
        "prob_urgent": float(prob_urgent),
        "prob_green": float(prob_green),
        "reguli_siguranta_aplicate": safety_reasons,
        "sursa_decizie": "model_ierarhic",
    }


