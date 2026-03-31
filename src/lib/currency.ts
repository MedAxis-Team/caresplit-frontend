// Utility to format numbers as Nigerian Naira currency
export function formatNaira(amount: number): string {
  return amount.toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
