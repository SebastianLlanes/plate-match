export const normalizePlate = (plate) =>
  plate.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();