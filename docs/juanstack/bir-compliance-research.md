# BIR Compliance Research (RA 11976 EOPT Act)

This document outlines the findings required to generate accurate forms for the BIR Module in JuanStack, specifically incorporating changes from Republic Act No. 11976 (Ease of Paying Taxes Act).

## 1. EOPT Act (RA 11976) Key Changes

- **Taxpayer Classification**: Taxpayers are now strictly classified by gross sales, which dictates their penalties, tax rates, and filing privileges.
  - **Micro**: Less than ₱3,000,000
  - **Small**: ₱3,000,000 to less than ₱20,000,000
  - **Medium**: ₱20,000,000 to less than ₱1,000,000,000
  - **Large**: ₱1,000,000,000 and above
- **Invoicing Rules**: The distinction between "Official Receipts" (for services) and "Sales Invoices" (for goods) is abolished. All transactions now use an **"Invoice"**.
- **File and Pay Anywhere**: Taxpayers can now file returns and pay taxes at any Authorized Agent Bank (AAB), RDO, or authorized tax software provider, regardless of their registered RDO. However, the registered RDO code is still required on all forms.
- **Registration Fee**: The ₱500 Annual Registration Fee is abolished.

## 2. Form Requirements

### BIR Form 2551Q (Quarterly Percentage Tax)

Required by Non-VAT businesses earning under ₱3,000,000 annually.

- **TIN & Branch Code**
- **RDO Code**
- **Line of Business / PSIC**
- **Registered Name & Address**
- **ATC (Alphanumeric Tax Code)**: Usually `PT010` (Percentage tax under Sec. 116).
- **Taxable Amount**: Gross Sales/Receipts for the quarter.
- **Tax Rate**: 3% (reverted from 1% post-CREATE Act as of July 2023).

### BIR Form 1701Q (Quarterly Income Tax)

Required for self-employed individuals, professionals, and sole proprietors.

- **TIN, Branch Code, RDO, Name, Address**
- **Taxpayer Type**: Single Proprietor, Professional, or Mixed Income.
- **ATC**: E.g., `II012` for Business Income, `II014` for Professionals.
- **Method of Deduction**:
  1. **Itemized Deduction**
  2. **OSD (Optional Standard Deduction)**: 40% of gross sales/receipts.
  3. **8% Flat Income Tax Rate**: In lieu of both Income and Percentage Tax (if gross sales < ₱3M).
- **Tax Credits/Payments**: Including Creditable Tax Withheld from Form 2307.

### BIR Form 2307 (Certificate of Creditable Tax Withheld at Source)

Issued by the payor (client) to the payee (professional/business) to prove tax was withheld.

- **Payee Details**: TIN, Branch, Name, Address.
- **Payor Details**: TIN, Branch, Name, Address.
- **Period Covered**: From (MM/DD/YY) to (MM/DD/YY).
- **Nature of Income Payment & ATC**: e.g., `WI157` (Professional fees 5% or 10%), `WC157` (Corporate 10% or 15%).
- **Tax Base**: The amount of income payment.
- **Tax Withheld**: The computed withholding tax amount.

## 3. Schema Updates

The `business.schema.json` has been updated to include these required fields under `bir_rules` so the AI Secretary can autonomously fill out these forms:

- `rdo_code`
- `registered_address`
- `psic_code`
- `line_of_business`
- `vat_status`
- `atc_percentage_tax`
- `atc_income_tax`
- `atc_withholding_tax`
