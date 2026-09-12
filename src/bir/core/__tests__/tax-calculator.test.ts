import { describe, test, expect } from "vitest";
import { classifyTaxpayer } from "../eopt-engine";
import {
  computeGrossPercentageTax,
  computeEightPercentTax,
  computeGraduatedTax,
  determineOptimalTaxScheme,
} from "../tax-calculator";
import { computeWithholdingTax } from "../withholding-tax";

describe("EOPT Engine", () => {
  test("classifies correctly by gross sales", () => {
    expect(classifyTaxpayer(0)).toBe("micro");
    expect(classifyTaxpayer(2_999_999)).toBe("micro");
    expect(classifyTaxpayer(3_000_000)).toBe("small");
    expect(classifyTaxpayer(19_999_999)).toBe("small");
    expect(classifyTaxpayer(20_000_000)).toBe("medium");
    expect(classifyTaxpayer(999_999_999)).toBe("medium");
    expect(classifyTaxpayer(1_000_000_000)).toBe("large");
  });

  test("throws on negative sales", () => {
    expect(() => classifyTaxpayer(-1)).toThrow();
  });
});

describe("Tax Calculator", () => {
  describe("Percentage Tax", () => {
    test("computes 3% of gross receipts", () => {
      expect(computeGrossPercentageTax(100_000)).toBe(3_000);
      expect(computeGrossPercentageTax(0)).toBe(0);
    });
  });

  describe("8% Flat Rate", () => {
    test("computes 8% of excess over 250k", () => {
      expect(computeEightPercentTax(200_000)).toBe(0); // Under 250k
      expect(computeEightPercentTax(250_000)).toBe(0); // Exactly 250k
      expect(computeEightPercentTax(350_000)).toBe(8_000); // (350k - 250k) * 0.08
    });
  });

  describe("Graduated Income Tax", () => {
    test("computes correct bracket rates", () => {
      // Bracket 1: <= 250k
      expect(computeGraduatedTax(250_000)).toBe(0);

      // Bracket 2: 250k - 400k (15% of excess)
      expect(computeGraduatedTax(300_000)).toBe(7_500); // 50k * 0.15
      expect(computeGraduatedTax(400_000)).toBe(22_500); // 150k * 0.15

      // Bracket 3: 400k - 800k (22.5k + 20% of excess)
      expect(computeGraduatedTax(500_000)).toBe(42_500); // 22.5k + (100k * 0.20)

      // Bracket 4: 800k - 2M (102.5k + 25% of excess)
      expect(computeGraduatedTax(1_000_000)).toBe(152_500); // 102.5k + (200k * 0.25)

      // Bracket 5: 2M - 8M (402.5k + 30% of excess)
      expect(computeGraduatedTax(3_000_000)).toBe(702_500); // 402.5k + (1M * 0.30)

      // Bracket 6: > 8M (2.2025M + 35% of excess)
      expect(computeGraduatedTax(10_000_000)).toBe(2_902_500); // 2.2025M + (2M * 0.35)
    });
  });

  describe("Optimal Scheme Determination", () => {
    test("recommends graduated if gross > 3M regardless of math", () => {
      // Very high expenses, graduated would be cheaper, but 8% is not allowed anyway.
      expect(determineOptimalTaxScheme(4_000_000, 3_900_000)).toBe("graduated");
    });

    test("recommends 8% when it yields lower tax", () => {
      // Low expenses, high margin -> 8% usually wins
      const gross = 1_000_000;
      const expenses = 100_000;
      expect(determineOptimalTaxScheme(gross, expenses)).toBe("8_percent");
    });

    test("recommends graduated when expenses are very high", () => {
      // High expenses, low margin -> graduated usually wins (even with 3% PT)
      const gross = 1_000_000;
      const expenses = 900_000; // Taxable income 100k -> 0 income tax. Only 30k PT.
      expect(determineOptimalTaxScheme(gross, expenses)).toBe("graduated");
    });
  });
});

describe("Withholding Tax", () => {
  test("computes 5% for micro individuals", () => {
    expect(computeWithholdingTax(100_000, "micro")).toBe(5_000);
  });

  test("computes 10% for non-micro individuals", () => {
    expect(computeWithholdingTax(100_000, "small")).toBe(10_000);
    expect(computeWithholdingTax(100_000, "medium")).toBe(10_000);
    expect(computeWithholdingTax(100_000, "large")).toBe(10_000);
  });

  test("computes 15% for corporate as simplified fallback", () => {
    expect(computeWithholdingTax(100_000, "small", true)).toBe(15_000);
  });
});
