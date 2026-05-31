import {
  cardStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  tableHeadCellStyle,
  tableCellStyle,
} from "./adminStyles";

export default function AdminPersonal({
  tabs,
  activeRoleTab,
  setActiveRoleTab,
  showCreateForm,
  setShowCreateForm,
  createForm,
  setCreateForm,
  onCreateUser,
  editingUser,
  editForm,
  setEditForm,
  onUpdateUser,
  onCancelEditUser,
  resetUser,
  resetPasswordForm,
  setResetPasswordForm,
  onResetPassword,
  onCancelResetPassword,
  loadingUsers,
  filteredUsers,
  onEditUser,
  onOpenResetPassword,
  onToggleActive,
}) {
  return (
    <div style={cardStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: "#102033", fontSize: 24 }}>
            Gestionare personal
          </h2>

          <div style={{ color: "#64748b", marginTop: 4, fontWeight: 700 }}>
            Creare, editare, activare/dezactivare și disponibilitate
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateForm((prev) => !prev)}
          style={primaryButtonStyle}
        >
          {showCreateForm ? "Închide formularul" : "+ Creează cont"}
        </button>
      </div>

      {showCreateForm && (
        <form
          onSubmit={onCreateUser}
          style={{
            marginBottom: 18,
            padding: 18,
            borderRadius: 24,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            display: "grid",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <input
              type="text"
              placeholder="Prenume"
              value={createForm.firstName}
              onChange={(e) =>
                setCreateForm({ ...createForm, firstName: e.target.value })
              }
              required
              style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
            />

            <input
              type="text"
              placeholder="Nume"
              value={createForm.lastName}
              onChange={(e) =>
                setCreateForm({ ...createForm, lastName: e.target.value })
              }
              required
              style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
            />

            <input
              type="email"
              placeholder="Email"
              value={createForm.email}
              onChange={(e) =>
                setCreateForm({ ...createForm, email: e.target.value })
              }
              required
              style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
            />

            <input
              type="password"
              placeholder="Parolă"
              value={createForm.password}
              onChange={(e) =>
                setCreateForm({ ...createForm, password: e.target.value })
              }
              required
              style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
            />

            <input
              type="text"
              placeholder="Telefon"
              value={createForm.phoneNumber}
              onChange={(e) =>
                setCreateForm({ ...createForm, phoneNumber: e.target.value })
              }
              style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
            />

            <select
              value={createForm.role}
              onChange={(e) =>
                setCreateForm({ ...createForm, role: e.target.value })
              }
              style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
            >
              <option value="DOCTOR">Medic</option>
              <option value="NURSE">Asistent</option>
              <option value="RECEPTION">Recepție</option>
            </select>

            <select
              value={createForm.availabilityStatus}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  availabilityStatus: e.target.value,
                })
              }
              style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="BUSY">BUSY</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              style={secondaryButtonStyle}
            >
              Anulează
            </button>

            <button type="submit" style={primaryButtonStyle}>
              Salvează cont
            </button>
          </div>
        </form>
      )}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
        {tabs.map((tab) => {
          const isActive = activeRoleTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveRoleTab(tab.key)}
              style={{
                padding: "11px 15px",
                borderRadius: 16,
                border: isActive ? "none" : "1px solid rgba(8,184,179,0.25)",
                background: isActive
                  ? "linear-gradient(135deg, #08b8b3, #069a96)"
                  : "#e6fffd",
                color: isActive ? "white" : "#069a96",
                fontWeight: 900,
                cursor: "pointer",
                boxShadow: isActive
                  ? "0 14px 28px rgba(8,184,179,0.22)"
                  : "none",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {editingUser && (
        <form
          onSubmit={onUpdateUser}
          style={{
            marginBottom: 18,
            padding: 18,
            borderRadius: 24,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            display: "grid",
            gap: 12,
          }}
        >
          <div style={{ fontWeight: 900, color: "#102033" }}>
            Editează utilizator: {editingUser.firstName} {editingUser.lastName}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <input
              type="text"
              placeholder="Prenume"
              value={editForm.firstName}
              onChange={(e) =>
                setEditForm({ ...editForm, firstName: e.target.value })
              }
              required
              style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
            />

            <input
              type="text"
              placeholder="Nume"
              value={editForm.lastName}
              onChange={(e) =>
                setEditForm({ ...editForm, lastName: e.target.value })
              }
              required
              style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
            />

            <input
              type="email"
              placeholder="Email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              required
              style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
            />

            <input
              type="text"
              placeholder="Telefon"
              value={editForm.phoneNumber}
              onChange={(e) =>
                setEditForm({ ...editForm, phoneNumber: e.target.value })
              }
              style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
            />

            <select
              value={editForm.role}
              onChange={(e) =>
                setEditForm({ ...editForm, role: e.target.value })
              }
              style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
            >
              <option value="DOCTOR">Medic</option>
              <option value="NURSE">Asistent</option>
              <option value="RECEPTION">Recepție</option>
            </select>

            <select
              value={editForm.availabilityStatus}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  availabilityStatus: e.target.value,
                })
              }
              style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="BUSY">BUSY</option>
            </select>

            <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setEditForm({
        ...editForm,
        profileImage: reader.result,
      });
    };

    reader.readAsDataURL(file);
  }}
  style={{
    padding: 12,
    borderRadius: 14,
    border: "1px solid #cbd5e1",
  }}
/>
          </div>

          {editForm.profileImage && (
  <img
    src={editForm.profileImage}
    alt="Poză profil"
    style={{
      width: 90,
      height: 90,
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid #e2e8f0",
    }}
  />
)}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button type="button" onClick={onCancelEditUser} style={secondaryButtonStyle}>
              Anulează
            </button>

            <button type="submit" style={primaryButtonStyle}>
              Salvează modificările
            </button>
          </div>
        </form>
      )}

      {resetUser && (
        <form
          onSubmit={onResetPassword}
          style={{
            marginBottom: 18,
            padding: 18,
            borderRadius: 24,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            display: "grid",
            gap: 12,
          }}
        >
          <div style={{ fontWeight: 900, color: "#102033" }}>
            Resetează parola pentru: {resetUser.firstName} {resetUser.lastName}
          </div>

          <input
            type="password"
            placeholder="Parolă nouă"
            value={resetPasswordForm.newPassword}
            onChange={(e) =>
              setResetPasswordForm({
                ...resetPasswordForm,
                newPassword: e.target.value,
              })
            }
            required
            style={{
              padding: 12,
              borderRadius: 14,
              border: "1px solid #cbd5e1",
              maxWidth: 360,
            }}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button
              type="button"
              onClick={onCancelResetPassword}
              style={secondaryButtonStyle}
            >
              Anulează
            </button>

            <button type="submit" style={primaryButtonStyle}>
              Salvează parola nouă
            </button>
          </div>
        </form>
      )}

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            background: "#ffffff",
          }}
        >
          <thead>
            <tr>
              <th style={tableHeadCellStyle}>Nume</th>
              <th style={tableHeadCellStyle}>Email</th>
              <th style={tableHeadCellStyle}>Rol</th>
              <th style={tableHeadCellStyle}>Telefon</th>
              <th style={tableHeadCellStyle}>Status</th>
              <th style={tableHeadCellStyle}>Disponibilitate</th>
              <th style={tableHeadCellStyle}>Acțiuni</th>
            </tr>
          </thead>

          <tbody>
            {loadingUsers && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: 20 }}>
                  Se încarcă...
                </td>
              </tr>
            )}

            {filteredUsers.map((item) => (
              <tr key={item.id}>
                <td style={tableCellStyle}>
                  {item.firstName} {item.lastName}
                </td>

                <td style={tableCellStyle}>{item.email}</td>
                <td style={tableCellStyle}>{item.role}</td>
                <td style={tableCellStyle}>{item.phoneNumber}</td>

                <td style={tableCellStyle}>
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: item.isActive ? "#dcfce7" : "#fee2e2",
                      color: item.isActive ? "#166534" : "#991b1b",
                      fontWeight: 900,
                      fontSize: 12,
                    }}
                  >
                    {item.isActive ? "ACTIV" : "INACTIV"}
                  </span>
                </td>

                <td style={tableCellStyle}>{item.availabilityStatus}</td>

                <td style={tableCellStyle}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => onEditUser(item)}
                      style={secondaryButtonStyle}
                    >
                      Editează
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenResetPassword(item)}
                      style={secondaryButtonStyle}
                    >
                      Reset parolă
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleActive(item.id)}
                      style={secondaryButtonStyle}
                    >
                      {item.isActive ? "Dezactivează" : "Activează"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: 22,
                    color: "#64748b",
                    fontWeight: 800,
                  }}
                >
                  Nu există utilizatori în această categorie.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}