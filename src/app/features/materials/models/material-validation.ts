export function isValidMaterialPrice(price: number): boolean {
  const cents = price * 100;
  return (
    Number.isFinite(price) &&
    price >= 0 &&
    Number.isSafeInteger(Math.round(cents)) &&
    Math.abs(cents - Math.round(cents)) < 0.000001
  );
}
