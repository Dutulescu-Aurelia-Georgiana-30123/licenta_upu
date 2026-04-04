export const toIntOrNull = (v) =>
  v === "" ? null : Number.isFinite(Number(v)) ? Math.trunc(Number(v)) : null;

export const toFloatOrNull = (v) =>
  v === "" ? null : Number.isFinite(Number(v)) ? Number(v) : null;