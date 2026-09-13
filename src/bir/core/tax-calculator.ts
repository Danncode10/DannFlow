/**
 * BIR Tax Calculator
 * Pure functions for computing Philippine taxes (TRAIN/CREATE/EOPT compliant).
 */

/**
 * Computes the standard 3% percentage tax on gross receipts.
 * Reverted from 1% to 3% effective July 1, 2023 (post-CREATE Act).
 */
export function computeGrossPercentageTax(grossReceipts: number): number {
  if (grossReceipts < 0) return 0;
  return grossReceipts * 0.03;
}

/**
 * Computes the 8% flat income tax rate.
 * The 8% tax is based on gross sales/receipts in excess of ₱250,000.
 * This is in lieu of the graduated income tax AND the 3% percentage tax.
 */
export function computeEightPercentTax(grossReceipts: number): number {
  if (grossReceipts < 0) return 0;

  const taxableAmount = Math.max(0, grossReceipts - 250_000);
  return taxableAmount * 0.08;
}

/**
 * Computes income tax using the 2023+ Graduated Income Tax Table.
 *
 * Brackets:
 * - Not over ₱250k: 0
 * - ₱250k to ₱400k: 15% of excess over ₱250k
 * - ₱400k to ₱800k: ₱22,500 + 20% of excess over ₱400k
 * - ₱800k to ₱2M: ₱102,500 + 25% of excess over ₱800k
 * - ₱2M to ₱8M: ₱402,500 + 30% of excess over ₱2M
 * - Over ₱8M: ₱2,202,500 + 35% of excess over ₱8M
 */
export function computeGraduatedTax(taxableIncome: number): number {
  if (taxableIncome <= 250_000) {
    return 0;
  }

  if (taxableIncome <= 400_000) {
    return (taxableIncome - 250_000) * 0.15;
  }

  if (taxableIncome <= 800_000) {
    return 22_500 + (taxableIncome - 400_000) * 0.2;
  }

  if (taxableIncome <= 2_000_000) {
    return 102_500 + (taxableIncome - 800_000) * 0.25;
  }

  if (taxableIncome <= 8_000_000) {
    return 402_500 + (taxableIncome - 2_000_000) * 0.3;
  }

  // Over 8M
  return 2_202_500 + (taxableIncome - 8_000_000) * 0.35;
}

/**
 * Compares the total tax liability under the 8% flat rate vs. the graduated rates.
 * Note: Under graduated rates, the taxpayer is ALSO liable for the 3% percentage tax.
 * Note: The 8% rate is only available if gross receipts do not exceed ₱3,000,000.
 *
 * @returns '8_percent' if cheaper and eligible, otherwise 'graduated'
 */
export function determineOptimalTaxScheme(
  grossReceipts: number,
  expenses: number,
): "8_percent" | "graduated" {
  // If gross sales exceed 3M, they are not eligible for 8% rate.
  if (grossReceipts > 3_000_000) {
    return "graduated";
  }

  const taxEightPercent = computeEightPercentTax(grossReceipts);

  // Under graduated scheme, tax base is gross - expenses
  const taxableIncomeGraduated = Math.max(0, grossReceipts - expenses);
  const incomeTaxGraduated = computeGraduatedTax(taxableIncomeGraduated);

  // Also add 3% percentage tax which applies when using graduated rates for Non-VAT
  const percentageTax = computeGrossPercentageTax(grossReceipts);

  const totalTaxGraduated = incomeTaxGraduated + percentageTax;

  if (taxEightPercent <= totalTaxGraduated) {
    return "8_percent";
  }

  return "graduated";
}
