export default function ArrivalSection({ preform, setPreform }) {
  return (
    <>
      <div>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Adus de</div>

        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 8,
          }}
        >
          {[
            ["13_SAJ", "13 - SAJ"],
            ["14_SMURD", "14 - SMURD"],
            ["15_MIJLOACE_PROPRII", "15 - Mijloace proprii"],
            ["16_ALT", "16 - Alt"],
          ].map(([value, label]) => (
            <label key={value}>
              <input
                type="radio"
                name="broughtByCode"
                checked={preform.broughtByCode === value}
                onChange={() =>
                  setPreform({ ...preform, broughtByCode: value })
                }
              />{" "}
              {label}
            </label>
          ))}
        </div>

        <input
          placeholder="Completează dacă ai ales Alt"
          value={preform.broughtByOther}
          onChange={(e) =>
            setPreform({ ...preform, broughtByOther: e.target.value })
          }
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Adus de la</div>

        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 8,
          }}
        >
          {[
            ["17_DOMICILIU", "17 - Domiciliu"],
            ["18_UNITATE_SANITARA", "18 - Unitate sanitară"],
            ["19_LOC_PUBLIC", "19 - Loc public"],
            ["20_LOC_MUNCA", "20 - Loc muncă"],
            ["21_ALTUL", "21 - Altul"],
          ].map(([value, label]) => (
            <label key={value}>
              <input
                type="radio"
                name="broughtFromCode"
                checked={preform.broughtFromCode === value}
                onChange={() =>
                  setPreform({ ...preform, broughtFromCode: value })
                }
              />{" "}
              {label}
            </label>
          ))}
        </div>

        <input
          placeholder="Completează dacă ai ales Altul"
          value={preform.broughtFromOther}
          onChange={(e) =>
            setPreform({ ...preform, broughtFromOther: e.target.value })
          }
          style={{ width: "100%", padding: 8 }}
        />
      </div>
    </>
  );
}