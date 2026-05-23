import CheckboxField from "../../CheckboxField";

export default function PickupVitalFunctionsSection({ preform, setPreform }) {
  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>
        Funcții vitale la preluare
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 10,
        }}
      >
        <CheckboxField
          label="35 - Decedat"
          checked={preform.pickupDeceased}
          onChange={(value) =>
            setPreform({ ...preform, pickupDeceased: value })
          }
        />

        <CheckboxField
          label="36 - Stop CR"
          checked={preform.pickupStopCr}
          onChange={(value) =>
            setPreform({ ...preform, pickupStopCr: value })
          }
        />

        <CheckboxField
          label="37 - Cu manevre de resuscitare în curs de desfășurare"
          checked={preform.pickupResuscitationInProgress}
          onChange={(value) =>
            setPreform({
              ...preform,
              pickupResuscitationInProgress: value,
            })
          }
        />

        <CheckboxField
          label="38 - Traumă"
          checked={preform.pickupTrauma}
          onChange={(value) =>
            setPreform({ ...preform, pickupTrauma: value })
          }
        />

        <div
          style={{
            gridColumn: "1 / -1",
            display: "grid",
            gridTemplateColumns: "220px auto auto 180px",
            gap: 12,
            alignItems: "center",
          }}
        >
          <label>
            39 - Resuscitare la ora
            <input
              value={preform.resuscitationHour}
              onChange={(e) =>
                setPreform({
                  ...preform,
                  resuscitationHour: e.target.value,
                })
              }
              style={{
                width: 120,
                padding: 8,
                marginTop: 6,
              }}
            />
          </label>

          <CheckboxField
            label="40 - Reușit"
            checked={preform.resuscitationSuccessful}
            onChange={(value) =>
              setPreform({
                ...preform,
                resuscitationSuccessful: value,
              })
            }
          />

          <CheckboxField
            label="41 - Nereușit"
            checked={preform.resuscitationFailed}
            onChange={(value) =>
              setPreform({
                ...preform,
                resuscitationFailed: value,
              })
            }
          />

          <input
            placeholder="Ora deces"
            value={preform.deathHour}
            onChange={(e) =>
              setPreform({ ...preform, deathHour: e.target.value })
            }
            style={{
              width: "100%",
              padding: 8,
              marginTop: 22,
            }}
          />
        </div>

        <label style={{ gridColumn: "1 / -1" }}>
          42 - Motivul neînceperii resuscitării
          <input
            value={preform.resuscitationNotStartedReason}
            onChange={(e) =>
              setPreform({
                ...preform,
                resuscitationNotStartedReason: e.target.value,
              })
            }
            style={{
              width: "100%",
              padding: 8,
              marginTop: 6,
            }}
          />
        </label>
      </div>
    </div>
  );
}