// ── Currency utility ─────────────────────────────────────────────
// All prices in products.js are stored in USD.
// We convert to NGN using a fixed rate and format with ₦ symbol.
// When you connect a real backend, swap USD_TO_NGN for a live rate.

const USD_TO_NGN = 1600; // approximate rate — update as needed

/**
 * Convert a USD price to formatted Naira string.
 * e.g. formatNaira(899) → "₦1,438,400"
 */
export function formatNaira(usdPrice) {
  if (!usdPrice && usdPrice !== 0) return "";
  const naira = Math.round(usdPrice * USD_TO_NGN);
  return "₦" + naira.toLocaleString("en-NG");
}

export default formatNaira;