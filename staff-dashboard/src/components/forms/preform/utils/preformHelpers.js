export function formatBirthDateInput(value) {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function calculateAgeFromBirthDate(value) {
  const parts = value.split("/");

  if (parts.length !== 3) return "";

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (!day || !month || !year) return "";

  const birthDate = new Date(year, month - 1, day);

  if (Number.isNaN(birthDate.getTime())) return "";

  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age >= 0 ? String(age) : "";
}

export function calculateGcsValue(data) {
  const m = Number(data.gcsM || 0);
  const v = Number(data.gcsV || 0);
  const o = Number(data.gcsO || 0);

  if (!m && !v && !o) return "";

  return String(m + v + o);
}