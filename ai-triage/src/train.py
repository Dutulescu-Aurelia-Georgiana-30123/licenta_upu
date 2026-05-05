from final_pipeline import (
    load_training_data,
    train_all_models,
    save_models,
)


if __name__ == "__main__":
    print("Se încarcă datele pentru training...")
    df_all = load_training_data()

    model_urgent, model_red, model_green = train_all_models(df_all)

    save_models(
        model_urgent,
        model_red,
        model_green,
    )

    print("Training finalizat.")