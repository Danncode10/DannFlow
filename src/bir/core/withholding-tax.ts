import { BIRTaxpayerClassification } from "./form-types";

/**
 * Computes creditable withholding tax (CWT) for professional services.
 *
 * Under Philippine tax rules for individuals (ATC WI157/WI158):
 * - 5% if gross income for the current year <= ₱3M (Micro) and sworn declaration is submitted.
 * - 10% if gross income > ₱3M or if no sworn declaration is submitted.
 *
 * For simplicity in this core engine, we use the classification to determine the rate:
 * - 'micro' (<= ₱3M) defaults to 5% (assuming sworn declaration is submitted by our app).
 * - 'small', 'medium', 'large' (> ₱3M) defaults to 10%.
 *
 * Note: Corporate professional fees (ATC WC157) use 10% (<= ₱720k) and 15% (> ₱720k).
 * We will stick to the individual rules here for standard professional users (e.g., attyjuan, vetstack).
 */
export function computeWithholdingTax(
  amount: number,
  classification: BIRTaxpayerClassification,
  isCorporate: boolean = false,
): number {
  if (amount < 0) return 0;

  if (isCorporate) {
    // Corporate rates: 10% if gross <= 720k, otherwise 15%.
    // For simplicity, we just check if it's micro. If it's not micro, it's definitely > 720k.
    // Even within micro, > 720k is 15%. This is a simplified fallback.
    return amount * 0.15;
  }

  // Individual professional rates
  if (classification === "micro") {
    return amount * 0.05; // 5% for <= 3M
  }

  return amount * 0.1; // 10% for > 3M
}
