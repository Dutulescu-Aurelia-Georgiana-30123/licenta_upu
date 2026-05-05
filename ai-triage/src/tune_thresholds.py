import itertools
import pandas as pd

from catboost import CatBoostClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    recall_score,
    precision_score,
    f1_score,
)

from final_pipeline import (
    load_training_data,
    get_feature_cols,
    get_cat_feature_indices,
)


def map_immedr_to_label(x):
    if x == 1:
        return "rosu"
    if x == 2:
        return "galben"
    if x == 3:
        return "verde"
    return "consult"


def train_model(X_train, y_train, class_weights=None, eval_metric="Recall"):
    model = CatBoostClassifier(
        iterations=700,
        depth=6,
        learning_rate=0.05,
        loss_function="Logloss",
        eval_metric=eval_metric,
        random_seed=42,
        verbose=0,
        class_weights=class_weights,
    )

    model.fit(
        X_train,
        y_train,
        cat_features=get_cat_feature_indices(X_train.columns),
    )

    return model


def main():
    print("Se încarcă datele...")
    df = load_training_data()

    df["label_real"] = df["IMMEDR"].apply(map_immedr_to_label)

    train_df, val_df = train_test_split(
        df,
        test_size=0.2,
        random_state=42,
        stratify=df["IMMEDR"],
    )

    features = get_feature_cols()

    train_df["target_urgent"] = train_df["IMMEDR"].apply(lambda x: 1 if x in [1, 2] else 0)

    model_urgent = train_model(
        train_df[features],
        train_df["target_urgent"],
        class_weights=[1, 5],
        eval_metric="Recall",
    )

    train_rg = train_df[train_df["IMMEDR"].isin([1, 2])].copy()
    train_rg["target_red"] = train_rg["IMMEDR"].apply(lambda x: 1 if x == 1 else 0)

    model_red = train_model(
        train_rg[features],
        train_rg["target_red"],
        class_weights=[1, 20],
        eval_metric="Recall",
    )

    train_gc = train_df[train_df["IMMEDR"].isin([3, 4, 5])].copy()
    train_gc["target_green"] = train_gc["IMMEDR"].apply(lambda x: 1 if x == 3 else 0)

    model_green = train_model(
        train_gc[features],
        train_gc["target_green"],
        class_weights=[1, 1],
        eval_metric="F1",
    )

    X_val = val_df[features]
    y_true = val_df["label_real"].values

    prob_urgent = model_urgent.predict_proba(X_val)[:, 1]
    prob_red = model_red.predict_proba(X_val)[:, 1]
    prob_green = model_green.predict_proba(X_val)[:, 1]

    urgent_thresholds = [0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60]
    red_thresholds = [0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.60]
    green_thresholds = [0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60]

    results = []

    for urgent_t, red_t, green_t in itertools.product(
        urgent_thresholds,
        red_thresholds,
        green_thresholds,
    ):
        preds = []

        for i in range(len(val_df)):
            if prob_urgent[i] >= urgent_t:
                if prob_red[i] >= red_t:
                    preds.append("rosu")
                else:
                    preds.append("galben")
            else:
                if prob_green[i] >= green_t:
                    preds.append("verde")
                else:
                    preds.append("consult")

        red_recall = recall_score(y_true, preds, labels=["rosu"], average="macro", zero_division=0)
        red_precision = precision_score(y_true, preds, labels=["rosu"], average="macro", zero_division=0)
        galben_recall = recall_score(y_true, preds, labels=["galben"], average="macro", zero_division=0)

        macro_f1 = f1_score(
            y_true,
            preds,
            labels=["consult", "verde", "galben", "rosu"],
            average="macro",
            zero_division=0,
        )

        score = (
            red_recall * 3 +
            red_precision * 2 +
            galben_recall * 1.5 +
            macro_f1
        )

        results.append({
            "urgent_threshold": urgent_t,
            "red_threshold": red_t,
            "green_threshold": green_t,
            "red_recall": red_recall,
            "red_precision": red_precision,
            "galben_recall": galben_recall,
            "macro_f1": macro_f1,
            "score": score,
        })

    results_df = pd.DataFrame(results).sort_values("score", ascending=False)

    print("\n=== TOP 15 COMBINAȚII THRESHOLD ===")
    print(results_df.head(15))

    best = results_df.iloc[0]

    print("\n=== BEST THRESHOLDS ===")
    print(f"URGENT_THRESHOLD = {best['urgent_threshold']}")
    print(f"RED_THRESHOLD = {best['red_threshold']}")
    print(f"GREEN_THRESHOLD = {best['green_threshold']}")

    final_preds = []

    for i in range(len(val_df)):
        if prob_urgent[i] >= best["urgent_threshold"]:
            if prob_red[i] >= best["red_threshold"]:
                final_preds.append("rosu")
            else:
                final_preds.append("galben")
        else:
            if prob_green[i] >= best["green_threshold"]:
                final_preds.append("verde")
            else:
                final_preds.append("consult")

    print("\n=== EVALUARE CU BEST THRESHOLDS ===")
    print(classification_report(
        y_true,
        final_preds,
        labels=["consult", "verde", "galben", "rosu"],
        zero_division=0,
    ))

    print("\nConfusion matrix:")
    print(confusion_matrix(
        y_true,
        final_preds,
        labels=["consult", "verde", "galben", "rosu"],
    ))


if __name__ == "__main__":
    main()