import pandas as pd

def load_year(path, year):
    df = pd.read_sas(path)
    df["YEAR_SRC"] = year
    return df.copy()

df2015 = load_year("data/raw/ed2015-sas/ed2015-sas.sas7bdat", 2015)
df2016 = load_year("data/raw/ed2016_sas/ed2016_sas.sas7bdat", 2016)
df2017 = load_year("data/raw/ed2017_sas/ed2017_sas.sas7bdat", 2017)
df2018 = load_year("data/raw/ed2018_sas/ed2018_sas.sas7bdat", 2018)
df2019 = load_year("data/raw/ed2019_sas/ed2019_sas.sas7bdat", 2019)
df2020 = load_year("data/raw/ed2020_sas/ed2020_sas.sas7bdat", 2020)
df2021 = load_year("data/raw/ed2021_sas/ed2021_sas.sas7bdat", 2021)
df2022 = load_year("data/raw/ed2022_sas/ed2022_sas.sas7bdat", 2022)

common_cols = (
    set(df2015.columns)
    & set(df2016.columns)
    & set(df2017.columns)
    & set(df2018.columns)
    & set(df2019.columns)
    & set(df2020.columns)
    & set(df2021.columns)
    & set(df2022.columns)
)

common_cols = sorted(list(common_cols))

df2015 = df2015[common_cols]
df2016 = df2016[common_cols]
df2017 = df2017[common_cols]
df2018 = df2018[common_cols]
df2019 = df2019[common_cols]
df2020 = df2020[common_cols]
df2021 = df2021[common_cols]
df2022 = df2022[common_cols]

df_all = pd.concat(
    [df2015, df2016, df2017, df2018, df2019, df2020, df2021, df2022],
    ignore_index=True
)

print("Shape total:", df_all.shape)
print("\nAni:")
print(df_all["YEAR_SRC"].value_counts().sort_index())

df_all.to_csv("data/processed/all_years.csv", index=False)
print("\nSalvat: data/processed/all_years.csv")