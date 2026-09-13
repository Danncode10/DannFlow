import { BIRTaxpayerClassification } from "./form-types";

/**
 * Classifies a taxpayer based on the Republic Act No. 11976 (Ease of Paying Taxes Act) thresholds.
 *
 * Thresholds:
 * - Micro: Less than ₱3,000,000
 * - Small: ₱3,000,000 to less than ₱20,000,000
 * - Medium: ₱20,000,000 to less than ₱1,000,000,000
 * - Large: ₱1,000,000,000 and above
 *
 * @param annualGrossSales The total gross sales/receipts for the taxable year in PHP.
 * @returns The BIRTaxpayerClassification string.
 */
export function classifyTaxpayer(
  annualGrossSales: number,
): BIRTaxpayerClassification {
  if (annualGrossSales < 0) {
    throw new Error("Annual gross sales cannot be negative.");
  }

  if (annualGrossSales < 3_000_000) {
    return "micro";
  }

  if (annualGrossSales < 20_000_000) {
    return "small";
  }

  if (annualGrossSales < 1_000_000_000) {
    return "medium";
  }

  return "large";
}
