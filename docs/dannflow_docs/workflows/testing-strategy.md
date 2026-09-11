# Testing Strategy

This document outlines the standard testing strategy for DannFlow and any projects built on it.

## 1. Testing Philosophy

Because we use a strict "Holy Trinity" architecture separating the DB, Types, and Service Layer, testing becomes highly isolated and straightforward.

- **Service Layer Tests:** Unit test the core logic. Since UI never calls the DB directly, validating the Service Layer ensures data integrity.
- **UI Tests:** Use tools like React Testing Library or Playwright to test the UI components with mocked Service Layer functions.

## 2. Tools

- **Unit Testing:** Vitest (or Jest)
- **E2E Testing:** Playwright or Cypress

## 3. Mocking Supabase

When testing the Service layer, avoid hitting the live production database. Use a local Supabase instance (`supabase start`) or mock the Supabase client entirely.
