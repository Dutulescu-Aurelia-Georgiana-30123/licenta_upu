import {
  calculateAgeFromBirthDate,
  formatBirthDateInput,
} from "../utils/preformHelpers";

export default function PatientInfoSection({ preform, setPreform }) {
  return (
    <>
      <div style={{ fontWeight: 700 }}>PACIENT</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <label>
          Prenume
          <input
            value={preform.firstName}
            onChange={(e) => setPreform({ ...preform, firstName: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Nume
          <input
            value={preform.lastName}
            onChange={(e) => setPreform({ ...preform, lastName: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Vârstă
          <input
            value={preform.age}
            readOnly
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Data nașterii
          <input
            type="text"
            placeholder="zz/ll/aaaa"
            value={preform.birthDate}
            onChange={(e) => {
              const formatted = formatBirthDateInput(e.target.value);

              setPreform({
                ...preform,
                birthDate: formatted,
                age: calculateAgeFromBirthDate(formatted),
              });
            }}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          CNP
          <input
            value={preform.cnp}
            onChange={(e) => setPreform({ ...preform, cnp: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Telefon
          <input
            value={preform.phoneNumber}
            onChange={(e) => setPreform({ ...preform, phoneNumber: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Email
          <input
            value={preform.email}
            onChange={(e) => setPreform({ ...preform, email: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Sex
          <select
            value={preform.sex}
            onChange={(e) => setPreform({ ...preform, sex: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          >
            <option value="">Selectează</option>
            <option value="M">M</option>
            <option value="F">F</option>
          </select>
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <label>
          Județ
          <input
            value={preform.county}
            onChange={(e) => setPreform({ ...preform, county: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Localitate
          <input
            value={preform.locality}
            onChange={(e) => setPreform({ ...preform, locality: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Strada
          <input
            value={preform.street}
            onChange={(e) => setPreform({ ...preform, street: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Nr.
          <input
            value={preform.streetNumber}
            onChange={(e) => setPreform({ ...preform, streetNumber: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Bl.
          <input
            value={preform.building}
            onChange={(e) => setPreform({ ...preform, building: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Sc.
          <input
            value={preform.staircase}
            onChange={(e) => setPreform({ ...preform, staircase: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Et.
          <input
            value={preform.floor}
            onChange={(e) => setPreform({ ...preform, floor: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Ap.
          <input
            value={preform.apartment}
            onChange={(e) => setPreform({ ...preform, apartment: e.target.value })}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>
      </div>
    </>
  );
}