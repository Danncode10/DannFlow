/**
 * BIR Core Form Types
 * Shared TypeScript interfaces for Philippine BIR form data structures.
 */

export type BIRTaxpayerClassification = "micro" | "small" | "medium" | "large";

export type EOPTFilingPeriod = {
  quarter: 1 | 2 | 3 | 4;
  year: number;
};

export interface BIRForm2307Data {
  payee_tin: string;
  payee_branch_code: string;
  payee_name: string;
  payee_address: string;
  payor_tin: string;
  payor_branch_code: string;
  payor_name: string;
  payor_address: string;
  period_from: string; // YYYY-MM-DD
  period_to: string; // YYYY-MM-DD
  atc: string;
  nature_of_income_payment: string;
  tax_base: number;
  tax_withheld: number;
}

export interface BIRForm1701QData {
  tin: string;
  branch_code: string;
  rdo_code: string;
  taxpayer_type: "single_proprietor" | "professional" | "mixed_income";
  name: string;
  registered_address: string;
  atc: string;
  method_of_deduction: "itemized" | "osd" | "8_percent";
  gross_sales: number;
  cost_of_sales: number; // For itemized
  operating_expenses: number; // For itemized
  taxable_income: number;
  tax_due: number;
  tax_credits: number; // Includes 2307 withholding
  tax_payable: number;
  period: EOPTFilingPeriod;
}

export interface BIRForm2551QData {
  tin: string;
  branch_code: string;
  rdo_code: string;
  line_of_business: string;
  registered_name: string;
  registered_address: string;
  atc: string; // Usually PT010
  taxable_amount: number; // Gross sales/receipts
  tax_rate: number; // Typically 3%
  tax_due: number;
  tax_credits: number;
  tax_payable: number;
  period: EOPTFilingPeriod;
}
