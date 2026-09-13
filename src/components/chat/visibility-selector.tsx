"use client";

export type VisibilityType = "private" | "public";

export const visibilityOptions: { value: VisibilityType; label: string }[] = [
  { label: "Private", value: "private" },
  { label: "Public", value: "public" },
];
