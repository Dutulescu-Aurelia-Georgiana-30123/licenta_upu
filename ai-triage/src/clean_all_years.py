import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from xgboost import XGBClassifier

# citim toate datele combinate
df = pd.read_csv("data/processed/all_years.csv")

df_small = df[
    [
        "AGE",
        "SEX",
        "TEMPF",
        "PULSE",
        "RESPR",
        "BPSYS",
        "BPDIAS",
        "IMMEDR",
        "PAINSCALE",
        "ARRTIME",
        "WAITTIME",
        "ARREMS",
        "RFV1",
        "RFV2",
        "RFV3",
        "YEAR_SRC",
    ]
]

# =====================
# CURĂȚARE
# =====================

df_clean = df_small.copy()

for col in ["TEMPF", "PULSE", "RESPR", "BPSYS", "BPDIAS"]:
    df_clean = df_clean[df_clean[col] > 0]

df_clean = df_clean[df_clean["PULSE"] < 250]
df_clean = df_clean[df_clean["BPSYS"] < 300]
df_clean = df_clean[df_clean["BPDIAS"] < 200]
df_clean = df_clean[df_clean["RESPR"] < 60]
df_clean = df_clean[df_clean["TEMPF"] < 1100]
df_clean = df_clean[df_clean["PAINSCALE"] >= 0]
df_clean = df_clean[df_clean["WAITTIME"] >= 0]
df_clean = df_clean[df_clean["ARREMS"].isin([1, 2])]
df_clean = df_clean[df_clean["IMMEDR"].isin([1, 2, 3, 4, 5])]

for col in ["RFV1", "RFV2", "RFV3"]:
    df_clean = df_clean[df_clean[col].notna()]

print("\nShape după curățare:")
print(df_clean.shape)

# target multiclass
def map_triage(x):
    if x == 1:
        return "rosu"
    elif x == 2:
        return "galben"
    elif x == 3:
        return "verde"
    elif x == 4 or x == 5:
        return "albastru"

df_clean["target"] = df_clean["IMMEDR"].apply(map_triage)

print("\nDistribuția target:")
print(df_clean["target"].value_counts())

label_map = {
    "albastru": 0,
    "verde": 1,
    "galben": 2,
    "rosu": 3
}

df_clean["target_num"] = df_clean["target"].map(label_map)

# feature engineering
df_clean["shock_index"] = df_clean["PULSE"] / df_clean["BPSYS"]
df_clean["pulse_temp_ratio"] = df_clean["PULSE"] / df_clean["TEMPF"]
df_clean["is_tachycardic"] = (df_clean["PULSE"] > 100).astype(int)
df_clean["is_hypotensive"] = (df_clean["BPSYS"] < 90).astype(int)
df_clean["is_fever"] = (df_clean["TEMPF"] > 1000).astype(int)
df_clean["high_pain"] = (df_clean["PAINSCALE"] >= 7).astype(int)

# encode RFV
for col in ["RFV1", "RFV2", "RFV3"]:
    le = LabelEncoder()
    df_clean[col] = df_clean[col].astype(str)
    df_clean[col] = le.fit_transform(df_clean[col])

# convert ARRTIME to numeric
df_clean["ARRTIME"] = df_clean["ARRTIME"].astype(str)
df_clean["ARRTIME"] = df_clean["ARRTIME"].str.replace("b'", "", regex=False)
df_clean["ARRTIME"] = df_clean["ARRTIME"].str.replace("'", "", regex=False)
df_clean["ARRTIME"] = pd.to_numeric(df_clean["ARRTIME"], errors="coerce")
df_clean = df_clean.dropna(subset=["ARRTIME"])

X = df_clean.drop(columns=["IMMEDR", "target", "target_num"])
y = df_clean["target_num"]

print("\nColoane folosite:")
print(X.columns)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print("\nDistribuție train:")
print(y_train.value_counts())

print("\nDistribuție test:")
print(y_test.value_counts())

smote = SMOTE(random_state=42)
X_train_res, y_train_res = smote.fit_resample(X_train, y_train)

print("\nDistribuție DUPĂ SMOTE:")
print(y_train_res.value_counts())

weights = y_train_res.map({
    0: 1,   # albastru
    1: 1,   # verde
    2: 2,   # galben
    3: 15   # rosu
})

xgb = XGBClassifier(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.1,
    random_state=42,
    eval_metric="mlogloss"
)

xgb.fit(X_train_res, y_train_res, sample_weight=weights)

y_pred = xgb.predict(X_test)

print("\nAccuracy:")
print(accuracy_score(y_test, y_pred))

print("\nClassification report:")
print(classification_report(
    y_test,
    y_pred,
    target_names=["albastru", "verde", "galben", "rosu"],
    zero_division=0
))

print("\nConfusion matrix:")
print(confusion_matrix(y_test, y_pred))