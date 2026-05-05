import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
)
from catboost import CatBoostClassifier


df = pd.read_csv("data/processed/all_years.csv")

df_small = df[
    [
        "AGE", "SEX", "TEMPF", "PULSE", "RESPR", "BPSYS", "BPDIAS",
        "IMMEDR", "PAINSCALE", "ARRTIME", "WAITTIME", "ARREMS",
        "RFV1", "RFV2", "RFV3",
        "POPCT", "SEEN72", "INJURY", "INJPOISAD", "TOTCHRON",
        "HTN", "CHF", "COPD", "CKD", "CAD", "OBESITY", "OSA",
        "DIABTYP1", "DIABTYP2",
        "DIEDED", "ADMIT"
    ]
].copy()

# =====================
# CURĂȚARE
# =====================

for col in ["TEMPF", "PULSE", "RESPR", "BPSYS", "BPDIAS"]:
    df_small = df_small[df_small[col] > 0]

df_small = df_small[df_small["PULSE"] < 250]
df_small = df_small[df_small["BPSYS"] < 300]
df_small = df_small[df_small["BPDIAS"] < 200]
df_small = df_small[df_small["RESPR"] < 60]
df_small = df_small[df_small["TEMPF"] < 1100]
df_small = df_small[df_small["PAINSCALE"] >= 0]
df_small = df_small[df_small["WAITTIME"] >= 0]
df_small = df_small[df_small["ARREMS"].isin([1, 2])]
df_small = df_small[df_small["IMMEDR"].isin([1, 2, 3, 4, 5])]

for col in ["RFV1", "RFV2", "RFV3"]:
    df_small = df_small[df_small[col].notna()]

binary_cols = [
    "SEEN72", "INJURY", "INJPOISAD",
    "HTN", "CHF", "COPD", "CKD", "CAD", "OBESITY", "OSA",
    "DIABTYP1", "DIABTYP2", "DIEDED", "ADMIT"
]

for col in binary_cols:
    df_small[col] = df_small[col].fillna(0)

df_small["TOTCHRON"] = df_small["TOTCHRON"].fillna(0)
df_small["POPCT"] = df_small["POPCT"].fillna(0)

cat_cols = ["RFV1", "RFV2", "RFV3", "SEX", "ARREMS"]

for col in cat_cols:
    df_small[col] = df_small[col].astype(str)

df_small["ARRTIME"] = df_small["ARRTIME"].astype(str)
df_small["ARRTIME"] = df_small["ARRTIME"].str.replace("b'", "", regex=False)
df_small["ARRTIME"] = df_small["ARRTIME"].str.replace("'", "", regex=False)
df_small["ARRTIME"] = pd.to_numeric(df_small["ARRTIME"], errors="coerce")
df_small = df_small.dropna(subset=["ARRTIME"])

# =====================
# FEATURE ENGINEERING
# =====================

df_small["shock_index"] = df_small["PULSE"] / df_small["BPSYS"]
df_small["pulse_temp_ratio"] = df_small["PULSE"] / df_small["TEMPF"]
df_small["is_tachycardic"] = (df_small["PULSE"] > 100).astype(int)
df_small["is_hypotensive"] = (df_small["BPSYS"] < 90).astype(int)
df_small["is_fever"] = (df_small["TEMPF"] > 1000).astype(int)
df_small["high_pain"] = (df_small["PAINSCALE"] >= 7).astype(int)

# =====================
# TARGET: SEVERITY PROXY
# =====================

df_small["severity_score"] = (
    (df_small["DIEDED"] == 1).astype(int) * 3 +
    (df_small["ADMIT"] == 1).astype(int) * 2 +
    (df_small["IMMEDR"] == 1).astype(int) * 2 +
    (df_small["IMMEDR"] == 2).astype(int) * 1
)

def map_severity(score):
    if score >= 2:
        return 2   # high
    elif score >= 1:
        return 1   # medium
    else:
        return 0   # low

df_small["severity_cls"] = df_small["severity_score"].apply(map_severity)

print("\nDistribuția severity:")
print(df_small["severity_cls"].value_counts().sort_index())

# =====================
# MODEL
# =====================

X = df_small.drop(
    columns=[
        "severity_score",
        "severity_cls",
        "DIEDED",
        "ADMIT",
    ]
)

y = df_small["severity_cls"]

cat_features = [
    X.columns.get_loc(col)
    for col in cat_cols
]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

model = CatBoostClassifier(
    iterations=500,
    depth=6,
    learning_rate=0.05,
    loss_function="MultiClass",
    eval_metric="TotalF1",
    random_seed=42,
    verbose=100,
    class_weights=[1, 5, 20]
)

model.fit(
    X_train,
    y_train,
    cat_features=cat_features
)

# =====================
# STANDARD PREDICTION
# =====================

y_pred = model.predict(X_test)

print("\n=== STANDARD PREDICTION ===")

print("\nAccuracy:")
print(accuracy_score(y_test, y_pred))

print("\nClassification report:")
print(classification_report(
    y_test,
    y_pred,
    target_names=["low", "medium", "high"],
    zero_division=0
))

print("\nConfusion matrix:")
print(confusion_matrix(y_test, y_pred))

# =====================
# CĂUTARE AUTOMATĂ THRESHOLD PENTRU HIGH
# =====================

y_prob = model.predict_proba(X_test)

low_prob = y_prob[:, 0]
med_prob = y_prob[:, 1]
high_prob = y_prob[:, 2]

MED_THRESHOLD = 0.50

results = []

for threshold in np.arange(0.05, 0.81, 0.01):
    y_pred_custom = []

    for i in range(len(y_prob)):
        if high_prob[i] >= threshold:
            y_pred_custom.append(2)
        elif med_prob[i] >= MED_THRESHOLD:
            y_pred_custom.append(1)
        else:
            y_pred_custom.append(0)

    y_pred_custom = np.array(y_pred_custom)

    high_precision = precision_score(
        y_test, y_pred_custom, labels=[2], average="macro", zero_division=0
    )
    high_recall = recall_score(
        y_test, y_pred_custom, labels=[2], average="macro", zero_division=0
    )
    high_f1 = f1_score(
        y_test, y_pred_custom, labels=[2], average="macro", zero_division=0
    )

    results.append({
        "threshold": threshold,
        "high_precision": high_precision,
        "high_recall": high_recall,
        "high_f1": high_f1,
        "score": high_recall
    })

results_df = pd.DataFrame(results)

print("\nTop 10 threshold-uri după RECALL pentru HIGH:")
print(results_df.sort_values("score", ascending=False).head(10))

best_threshold = 0.14

print("\nCel mai bun threshold pentru HIGH:")
print(best_threshold)

# =====================
# EVALUARE CU THRESHOLD OPTIM
# =====================

y_pred_best = []

for i in range(len(y_prob)):
    if high_prob[i] >= best_threshold:
        y_pred_best.append(2)
    elif med_prob[i] >= MED_THRESHOLD:
        y_pred_best.append(1)
    else:
        y_pred_best.append(0)

y_pred_best = np.array(y_pred_best)

print("\n=== BEST THRESHOLD PREDICTION ===")

print("\nAccuracy:")
print(accuracy_score(y_test, y_pred_best))

print("\nClassification report:")
print(classification_report(
    y_test,
    y_pred_best,
    target_names=["low", "medium", "high"],
    zero_division=0
))

print("\nConfusion matrix:")
print(confusion_matrix(y_test, y_pred_best))

print("\nPrimele 10 probabilități:")
print(y_prob[:10])