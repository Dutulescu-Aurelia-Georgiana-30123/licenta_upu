import pandas as pd
import numpy as np

from catboost import CatBoostClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score


# =====================
# CONFIG
# =====================

CSV_PATH = "data/processed/all_years.csv"

URGENT_THRESHOLD = 0.40
RED_THRESHOLD = 0.07
GREEN_THRESHOLD = 0.50
SEVERITY_HIGH_THRESHOLD = 0.14
SEVERITY_MED_THRESHOLD = 0.50


# =====================
# LOAD DATA
# =====================

df = pd.read_csv(CSV_PATH)

cols = [
    "AGE", "SEX", "TEMPF", "PULSE", "RESPR", "BPSYS", "BPDIAS",
    "IMMEDR", "PAINSCALE", "ARRTIME", "WAITTIME", "ARREMS",
    "RFV1", "RFV2", "RFV3",
    "POPCT", "SEEN72", "INJURY", "INJPOISAD", "TOTCHRON",
    "HTN", "CHF", "COPD", "CKD", "CAD", "OBESITY", "OSA",
    "DIABTYP1", "DIABTYP2",
    "DIEDED", "ADMIT"
]

df = df[cols].copy()


# =====================
# PREPROCESS TRAIN DATA
# =====================

def clean_training_data(df):
    df = df.copy()

    for col in ["TEMPF", "PULSE", "RESPR", "BPSYS", "BPDIAS"]:
        df = df[df[col] > 0]

    df = df[df["PULSE"] < 250]
    df = df[df["BPSYS"] < 300]
    df = df[df["BPDIAS"] < 200]
    df = df[df["RESPR"] < 60]
    df = df[df["TEMPF"] < 1100]
    df = df[df["PAINSCALE"] >= 0]
    df = df[df["WAITTIME"] >= 0]
    df = df[df["ARREMS"].isin([1, 2])]
    df = df[df["IMMEDR"].isin([1, 2, 3, 4, 5])]

    for col in ["RFV1", "RFV2", "RFV3"]:
        df = df[df[col].notna()]

    binary_cols = [
        "SEEN72", "INJURY", "INJPOISAD",
        "HTN", "CHF", "COPD", "CKD", "CAD", "OBESITY", "OSA",
        "DIABTYP1", "DIABTYP2", "DIEDED", "ADMIT"
    ]

    for col in binary_cols:
        df[col] = df[col].fillna(0)

    df["TOTCHRON"] = df["TOTCHRON"].fillna(0)
    df["POPCT"] = df["POPCT"].fillna(0)

    cat_cols = ["RFV1", "RFV2", "RFV3", "SEX", "ARREMS"]

    for col in cat_cols:
        df[col] = df[col].astype(str)

    df["ARRTIME"] = df["ARRTIME"].astype(str)
    df["ARRTIME"] = df["ARRTIME"].str.replace("b'", "", regex=False)
    df["ARRTIME"] = df["ARRTIME"].str.replace("'", "", regex=False)
    df["ARRTIME"] = pd.to_numeric(df["ARRTIME"], errors="coerce")
    df = df.dropna(subset=["ARRTIME"])

    df["shock_index"] = df["PULSE"] / df["BPSYS"]
    df["pulse_temp_ratio"] = df["PULSE"] / df["TEMPF"]
    df["is_tachycardic"] = (df["PULSE"] > 100).astype(int)
    df["is_hypotensive"] = (df["BPSYS"] < 90).astype(int)
    df["is_fever"] = (df["TEMPF"] > 1000).astype(int)
    df["high_pain"] = (df["PAINSCALE"] >= 7).astype(int)

    return df


df = clean_training_data(df)

cat_cols = ["RFV1", "RFV2", "RFV3", "SEX", "ARREMS"]

base_features = [
    "AGE", "SEX", "TEMPF", "PULSE", "RESPR", "BPSYS", "BPDIAS",
    "PAINSCALE", "ARRTIME", "WAITTIME", "ARREMS",
    "RFV1", "RFV2", "RFV3",
    "POPCT", "SEEN72", "INJURY", "INJPOISAD", "TOTCHRON",
    "HTN", "CHF", "COPD", "CKD", "CAD", "OBESITY", "OSA",
    "DIABTYP1", "DIABTYP2",
    "shock_index", "pulse_temp_ratio",
    "is_tachycardic", "is_hypotensive", "is_fever", "high_pain"
]

severity_features = base_features + ["IMMEDR"]


# =====================
# TRAIN MODEL 1: URGENT VS NON-URGENT
# =====================

df["target_urgent"] = df["IMMEDR"].apply(lambda x: 1 if x in [1, 2] else 0)

X = df[base_features]
y = df["target_urgent"]

cat_features = [X.columns.get_loc(col) for col in cat_cols]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model_urgent = CatBoostClassifier(
    iterations=500,
    depth=6,
    learning_rate=0.05,
    loss_function="Logloss",
    eval_metric="Recall",
    random_seed=42,
    verbose=100
)

print("\nAntrenăm Model 1: urgent vs non-urgent")
model_urgent.fit(X_train, y_train, cat_features=cat_features)


# =====================
# TRAIN MODEL 2: ROSU VS GALBEN
# =====================

df_rg = df[df["IMMEDR"].isin([1, 2])].copy()
df_rg["target_red"] = df_rg["IMMEDR"].apply(lambda x: 1 if x == 1 else 0)

X = df_rg[base_features]
y = df_rg["target_red"]

cat_features = [X.columns.get_loc(col) for col in cat_cols]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model_red = CatBoostClassifier(
    iterations=500,
    depth=6,
    learning_rate=0.05,
    loss_function="Logloss",
    eval_metric="Recall",
    random_seed=42,
    verbose=100
)

print("\nAntrenăm Model 2: rosu vs galben")
model_red.fit(X_train, y_train, cat_features=cat_features)


# =====================
# TRAIN MODEL 3: VERDE VS ALBASTRU
# =====================

df_gb = df[df["IMMEDR"].isin([3, 4, 5])].copy()
df_gb["target_green"] = df_gb["IMMEDR"].apply(lambda x: 1 if x == 3 else 0)

X = df_gb[base_features]
y = df_gb["target_green"]

cat_features = [X.columns.get_loc(col) for col in cat_cols]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model_green = CatBoostClassifier(
    iterations=500,
    depth=6,
    learning_rate=0.05,
    loss_function="Logloss",
    eval_metric="TotalF1",
    random_seed=42,
    verbose=100
)

print("\nAntrenăm Model 3: verde vs albastru")
model_green.fit(X_train, y_train, cat_features=cat_features)


# =====================
# TRAIN MODEL 4: SEVERITY
# =====================

df["severity_score"] = (
    (df["DIEDED"] == 1).astype(int) * 3 +
    (df["ADMIT"] == 1).astype(int) * 2 +
    (df["IMMEDR"] == 1).astype(int) * 2 +
    (df["IMMEDR"] == 2).astype(int) * 1
)

def map_severity(score):
    if score >= 2:
        return 2
    elif score >= 1:
        return 1
    else:
        return 0

df["severity_cls"] = df["severity_score"].apply(map_severity)

X = df[severity_features]
y = df["severity_cls"]

cat_features = [X.columns.get_loc(col) for col in cat_cols]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model_severity = CatBoostClassifier(
    iterations=500,
    depth=6,
    learning_rate=0.05,
    loss_function="MultiClass",
    eval_metric="TotalF1",
    random_seed=42,
    verbose=100,
)

print("\nAntrenăm Model 4: severity")
model_severity.fit(X_train, y_train, cat_features=cat_features)

y_prob = model_severity.predict_proba(X_test)

high_prob = y_prob[:, 2]
med_prob = y_prob[:, 1]

y_pred_sev = []

for i in range(len(y_prob)):
    if high_prob[i] >= SEVERITY_HIGH_THRESHOLD:
        y_pred_sev.append(2)
    elif med_prob[i] >= SEVERITY_MED_THRESHOLD:
        y_pred_sev.append(1)
    else:
        y_pred_sev.append(0)

y_pred_sev = np.array(y_pred_sev)

print("\n=== SEVERITY MODEL TEST ===")
print("\nAccuracy:")
print(accuracy_score(y_test, y_pred_sev))

print("\nClassification report:")
print(classification_report(
    y_test,
    y_pred_sev,
    target_names=["low", "medium", "high"],
    zero_division=0
))

print("\nConfusion matrix:")
print(confusion_matrix(y_test, y_pred_sev))


# =====================
# PREPROCESS PACIENT NOU
# =====================

def preprocess_patient(patient):
    p = pd.DataFrame([patient])

    defaults = {
        "AGE": 40,
        "SEX": "1",
        "TEMPF": 980,
        "PULSE": 80,
        "RESPR": 18,
        "BPSYS": 120,
        "BPDIAS": 80,
        "PAINSCALE": 0,
        "ARRTIME": 1200,
        "WAITTIME": 0,
        "ARREMS": "2",
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
    }

    for col, val in defaults.items():
        if col not in p.columns:
            p[col] = val

    for col in cat_cols:
        p[col] = p[col].astype(str)

    p["ARRTIME"] = pd.to_numeric(p["ARRTIME"], errors="coerce").fillna(1200)

    p["shock_index"] = p["PULSE"] / p["BPSYS"]
    p["pulse_temp_ratio"] = p["PULSE"] / p["TEMPF"]
    p["is_tachycardic"] = (p["PULSE"] > 100).astype(int)
    p["is_hypotensive"] = (p["BPSYS"] < 90).astype(int)
    p["is_fever"] = (p["TEMPF"] > 1000).astype(int)
    p["high_pain"] = (p["PAINSCALE"] >= 7).astype(int)

    return p


# =====================
# PREDICT FINAL PATIENT
# =====================

def predict_final_patient(patient):
    p = preprocess_patient(patient)

    X_base = p[base_features]

    prob_urgent = model_urgent.predict_proba(X_base)[0][1]

    if prob_urgent >= URGENT_THRESHOLD:
        decision_stage_1 = "urgent"

        prob_red = model_red.predict_proba(X_base)[0][1]

        if prob_red >= RED_THRESHOLD:
            initial_color = "rosu"
            immedr_proxy = 1
        else:
            initial_color = "galben"
            immedr_proxy = 2

    else:
        decision_stage_1 = "non-urgent"

        prob_green = model_green.predict_proba(X_base)[0][1]

        if prob_green >= GREEN_THRESHOLD:
            initial_color = "verde"
            immedr_proxy = 3
        else:
            initial_color = "albastru"
            immedr_proxy = 4

    p["IMMEDR"] = immedr_proxy

    X_sev = p[severity_features]
    sev_prob = model_severity.predict_proba(X_sev)[0]

    prob_low = sev_prob[0]
    prob_medium = sev_prob[1]
    prob_high = sev_prob[2]

    if prob_high >= SEVERITY_HIGH_THRESHOLD:
        severity = "high"
    elif prob_medium >= SEVERITY_MED_THRESHOLD:
        severity = "medium"
    else:
        severity = "low"

    final_color = initial_color

    if severity == "high":
        if prob_high >= 0.50:
            final_color = "rosu"
        elif initial_color in ["albastru", "verde"]:
            final_color = "galben"

    elif severity == "medium":
        if initial_color == "albastru":
            final_color = "verde"

    return {
        "decizie_etapa_1": decision_stage_1,
        "culoare_initiala": initial_color,
        "severity": severity,
        "prob_urgent": float(prob_urgent),
        "prob_low": float(prob_low),
        "prob_medium": float(prob_medium),
        "prob_high": float(prob_high),
        "culoare_finala": final_color
    }


# =====================
# TEST MAI MULȚI PACIENȚI
# =====================

pacienti_test = [
    {
        "nume": "Pacient 1 - ușor",
        "AGE": 24,
        "SEX": "2",
        "TEMPF": 982,
        "PULSE": 76,
        "RESPR": 16,
        "BPSYS": 122,
        "BPDIAS": 78,
        "PAINSCALE": 2,
        "ARRTIME": 1100,
        "WAITTIME": 40,
        "ARREMS": "2",
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
    },
    {
        "nume": "Pacient 2 - durere moderată",
        "AGE": 45,
        "SEX": "1",
        "TEMPF": 986,
        "PULSE": 92,
        "RESPR": 18,
        "BPSYS": 135,
        "BPDIAS": 85,
        "PAINSCALE": 6,
        "ARRTIME": 1300,
        "WAITTIME": 20,
        "ARREMS": "2",
        "RFV1": "1545",
        "RFV2": "0",
        "RFV3": "0",
        "POPCT": 0,
        "SEEN72": 0,
        "INJURY": 0,
        "INJPOISAD": 0,
        "TOTCHRON": 1,
        "HTN": 1,
        "CHF": 0,
        "COPD": 0,
        "CKD": 0,
        "CAD": 0,
        "OBESITY": 0,
        "OSA": 0,
        "DIABTYP1": 0,
        "DIABTYP2": 0,
    },
    {
        "nume": "Pacient 3 - febră/tahicardie",
        "AGE": 62,
        "SEX": "2",
        "TEMPF": 1015,
        "PULSE": 118,
        "RESPR": 24,
        "BPSYS": 105,
        "BPDIAS": 68,
        "PAINSCALE": 5,
        "ARRTIME": 1730,
        "WAITTIME": 10,
        "ARREMS": "2",
        "RFV1": "0",
        "RFV2": "0",
        "RFV3": "0",
        "POPCT": 0,
        "SEEN72": 0,
        "INJURY": 0,
        "INJPOISAD": 0,
        "TOTCHRON": 2,
        "HTN": 1,
        "CHF": 0,
        "COPD": 1,
        "CKD": 0,
        "CAD": 0,
        "OBESITY": 0,
        "OSA": 0,
        "DIABTYP1": 0,
        "DIABTYP2": 1,
    },
    {
        "nume": "Pacient 4 - critic",
        "AGE": 72,
        "SEX": "1",
        "TEMPF": 1012,
        "PULSE": 128,
        "RESPR": 28,
        "BPSYS": 88,
        "BPDIAS": 55,
        "PAINSCALE": 8,
        "ARRTIME": 1430,
        "WAITTIME": 5,
        "ARREMS": "1",
        "RFV1": "1545",
        "RFV2": "0",
        "RFV3": "0",
        "POPCT": 0,
        "SEEN72": 0,
        "INJURY": 0,
        "INJPOISAD": 0,
        "TOTCHRON": 3,
        "HTN": 1,
        "CHF": 1,
        "COPD": 0,
        "CKD": 1,
        "CAD": 1,
        "OBESITY": 0,
        "OSA": 0,
        "DIABTYP1": 0,
        "DIABTYP2": 1,
    },
    {
        "nume": "Pacient 5 - borderline",
        "AGE": 58,
        "SEX": "1",
        "TEMPF": 995,
        "PULSE": 104,
        "RESPR": 21,
        "BPSYS": 112,
        "BPDIAS": 72,
        "PAINSCALE": 7,
        "ARRTIME": 900,
        "WAITTIME": 15,
        "ARREMS": "2",
        "RFV1": "1545",
        "RFV2": "0",
        "RFV3": "0",
        "POPCT": 0,
        "SEEN72": 1,
        "INJURY": 0,
        "INJPOISAD": 0,
        "TOTCHRON": 2,
        "HTN": 1,
        "CHF": 0,
        "COPD": 0,
        "CKD": 0,
        "CAD": 1,
        "OBESITY": 0,
        "OSA": 0,
        "DIABTYP1": 0,
        "DIABTYP2": 1,
    },
]

print("\n=== TEST MAI MULȚI PACIENȚI ===")

for pacient in pacienti_test:
    nume = pacient.pop("nume")
    rezultat = predict_final_patient(pacient)

    print("\n" + "=" * 60)
    print(nume)
    print(rezultat)