import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from catboost import CatBoostClassifier

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
        "POPCT",
        "SEEN72",
        "INJURY",
        "INJPOISAD",
        "TOTCHRON",
        "HTN",
        "CHF",
        "COPD",
        "CKD",
        "CAD",
        "OBESITY",
        "OSA",
        "DIABTYP1",
        "DIABTYP2",
    ]
]

# curățare
df_clean = df_small.copy()

for col in ["TEMPF", "PULSE", "RESPR", "BPSYS", "BPDIAS"]:
    df_clean = df_clean[df_clean[col] > 0]

binary_cols = [
    "SEEN72", "INJURY", "INJPOISAD",
    "HTN", "CHF", "COPD", "CKD",
    "CAD", "OBESITY", "OSA",
    "DIABTYP1", "DIABTYP2"
]

for col in binary_cols:
    df_clean[col] = df_clean[col].fillna(0)

df_clean["TOTCHRON"] = df_clean["TOTCHRON"].fillna(0)
df_clean["POPCT"] = df_clean["POPCT"].fillna(0)

df_clean = df_clean[df_clean["PULSE"] < 250]
df_clean = df_clean[df_clean["BPSYS"] < 300]
df_clean = df_clean[df_clean["BPDIAS"] < 200]
df_clean = df_clean[df_clean["RESPR"] < 60]
df_clean = df_clean[df_clean["TEMPF"] < 1100]
df_clean = df_clean[df_clean["PAINSCALE"] >= 0]
df_clean = df_clean[df_clean["WAITTIME"] >= 0]
df_clean = df_clean[df_clean["ARREMS"].isin([1, 2])]
df_clean = df_clean[df_clean["IMMEDR"].isin([3, 4, 5])]

for col in ["RFV1", "RFV2", "RFV3"]:
    df_clean = df_clean[df_clean[col].notna()]

print("\nDistribuția IMMEDR:")
print(df_clean["IMMEDR"].value_counts())

# target: verde vs albastru
def map_green_blue(x):
    if x == 3:
        return 1   # verde
    else:
        return 0   # albastru (4 sau 5)

df_clean["target"] = df_clean["IMMEDR"].apply(map_green_blue)

print("\nDistribuția target:")
print(df_clean["target"].value_counts())

# feature engineering
df_clean["shock_index"] = df_clean["PULSE"] / df_clean["BPSYS"]
df_clean["pulse_temp_ratio"] = df_clean["PULSE"] / df_clean["TEMPF"]
df_clean["is_tachycardic"] = (df_clean["PULSE"] > 100).astype(int)
df_clean["is_hypotensive"] = (df_clean["BPSYS"] < 90).astype(int)
df_clean["is_fever"] = (df_clean["TEMPF"] > 1000).astype(int)
df_clean["high_pain"] = (df_clean["PAINSCALE"] >= 7).astype(int)

# categorice pentru CatBoost
for col in ["RFV1", "RFV2", "RFV3", "SEX", "ARREMS"]:
    df_clean[col] = df_clean[col].astype(str)

# convert ARRTIME
df_clean["ARRTIME"] = df_clean["ARRTIME"].astype(str)
df_clean["ARRTIME"] = df_clean["ARRTIME"].str.replace("b'", "", regex=False)
df_clean["ARRTIME"] = df_clean["ARRTIME"].str.replace("'", "", regex=False)
df_clean["ARRTIME"] = pd.to_numeric(df_clean["ARRTIME"], errors="coerce")
df_clean = df_clean.dropna(subset=["ARRTIME"])

X = df_clean.drop(columns=["IMMEDR", "target"])
y = df_clean["target"]

print("\nColoane folosite:")
print(X.columns)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print("\nDistribuție train:")
print(y_train.value_counts())

print("\nDistribuție test:")
print(y_test.value_counts())

cat_features = [
    X.columns.get_loc(col)
    for col in ["RFV1", "RFV2", "RFV3", "SEX", "ARREMS"]
]

model = CatBoostClassifier(
    iterations=500,
    depth=6,
    learning_rate=0.05,
    loss_function="Logloss",
    eval_metric="F1",
    random_seed=42,
    verbose=100
)

model.fit(
    X_train,
    y_train,
    cat_features=cat_features
)

# probabilități pentru clasa verde
y_prob = model.predict_proba(X_test)[:, 1]

threshold = 0.50
y_pred = (y_prob > threshold).astype(int)

print("\nThreshold folosit:", threshold)

print("\nAccuracy:")
print(accuracy_score(y_test, y_pred))

print("\nClassification report:")
print(classification_report(
    y_test,
    y_pred,
    target_names=["albastru", "verde"],
    zero_division=0
))

print("\nConfusion matrix:")
print(confusion_matrix(y_test, y_pred))