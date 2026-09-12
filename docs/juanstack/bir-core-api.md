# BIR Core Engine API Reference

The `src/bir/core/` module is the single source of truth for all Philippine tax computations within JuanStack. Vertical-specific logic MUST rely on these pure functions to ensure compliance with RA 11976 (Ease of Paying Taxes Act), CREATE, and TRAIN laws.

## EOPT Engine (`eopt-engine.ts`)

### `classifyTaxpayer(annualGrossSales: number): BIRTaxpayerClassification`

Classifies a taxpayer based on the strictly defined EOPT thresholds.

- **Returns**: `'micro' | 'small' | 'medium' | 'large'`
- **Thresholds**:
  - `< ₱3,000,000` = Micro
  - `< ₱20,000,000` = Small
  - `< ₱1,000,000,000` = Medium
  - `>= ₱1,000,000,000` = Large

---

## Tax Calculator (`tax-calculator.ts`)

### `computeGrossPercentageTax(grossReceipts: number): number`

Computes the standard 3% percentage tax. (Reverted from the temporary 1% CREATE Act rate effective July 2023).

### `computeEightPercentTax(grossReceipts: number): number`

Computes the 8% flat income tax rate.

- Applies to gross receipts _in excess of ₱250,000_.
- Note: Taxpayers must be eligible (e.g., non-VAT, Micro classification) to use this rate.

### `computeGraduatedTax(taxableIncome: number): number`

Computes income tax using the 2023+ Graduated Income Tax Table.

- **Taxable Income** is typically (Gross Receipts - Allowable Expenses).
- Note: Taxpayers using the graduated rate are _also_ liable for Percentage Tax if they are non-VAT.

### `determineOptimalTaxScheme(grossReceipts: number, expenses: number): '8_percent' | 'graduated'`

Compares the total tax liability (Income Tax + Percentage Tax) of both schemes and returns the cheaper option.

- Automatically forces `'graduated'` if gross receipts exceed ₱3,000,000.

---

## Withholding Tax (`withholding-tax.ts`)

### `computeWithholdingTax(amount: number, classification: BIRTaxpayerClassification, isCorporate?: boolean): number`

Computes creditable withholding tax (CWT) for professional services (Forms 2307).

- Micro individuals: **5%**
- Small/Medium/Large individuals: **10%**
- Corporate (fallback): **15%**

---

## Form Types (`form-types.ts`)

Contains TypeScript interfaces for structured data required by BIR Forms. Verticals should use these interfaces to type the props of their UI components or the payloads sent to the AI Secretary.

- `BIRForm2307Data`
- `BIRForm1701QData`
- `BIRForm2551QData`
- `EOPTFilingPeriod`
