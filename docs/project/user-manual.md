# User Manual

**Project Name:** [Your Project Name] (Built on DannFlow)
**Date:** [YYYY-MM-DD]

> **⚠️ REPOSITORY MODE RULE:**
>
> - If you are in the `DannFlow` template repository, **DO NOT** add specific product workflows or custom user instructions here. Keep this file as the generic baseline.
> - If you are in a **Project Mode** repository (built from DannFlow), you **MUST** update this file to reflect your specific application's user workflows.

---

## 1. DannFlow Baseline Interactions

Out of the box, DannFlow provides the following user workflows. _(Update these as your specific application replaces or expands upon them.)_

### Account Creation & Login

- **Navigation:** Users navigate to the `/login` or `/signup` route.
- **Methods:**
  - **OAuth:** Click "Continue with [Provider]" (e.g., Google, GitHub).
  - **Email/Password:** Enter email and a secure password.
- **Post-Login:** Users are redirected based on the logic in the auth callback.

### Profile Management

- **Navigation:** Users can manage their account settings via the profile dropdown.
- **Capabilities:** View account details, update basic profile information (driven by the `profiles` table in Supabase), and securely log out.

## 2. Project-Specific Operational Guide

_(Document the primary ways an end-user or admin interacts with your specific application here. Provide clear operational guides for the system.)__

### [Specific Workflow 1: e.g., Creating a Dashboard]

- **Navigate to:** `/dashboard`
- **Action:** Click "New Item" and fill out the form.
- **Result:** A new item is generated and displayed in the table.

### [Specific Workflow 2: e.g., Admin Analytics]

- **Navigate to:** `/admin`
- **Action:** Select date range.
- **Result:** Admin sees aggregate usage data.
