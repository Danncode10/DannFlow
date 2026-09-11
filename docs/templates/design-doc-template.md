# Technical Design Document

**Project/Feature Name:** [Project Name]  
**Date:** [YYYY-MM-DD]  
**Author:** [Your Name]  
**Status:** [Draft / Under Review / Approved]

---

## 1. Architecture Overview

Briefly describe how this feature or system fits into the existing architecture. (e.g., frontend components, API endpoints, background jobs).

## 2. Database Schema Changes

List any new tables, modified columns, or new relationships in Supabase. Include new Row Level Security (RLS) policies if applicable.

- **Table:** `[table_name]`
  - `[column_name]` ([type]): [Description]

## 3. Core Components & Services

Detail the main logic blocks.

- **Frontend Components:** [List main components to be built/modified]
- **Services (src/services/):** [List service layer functions to be created/updated]
- **Types (src/types/):** [List type modifications]

## 4. API / Integration Details

If integrating with third-party tools (Stripe, Resend, etc.), list the endpoints or webhooks being used.

## 5. Security & Edge Cases

What could go wrong? How are we handling errors, validation, and authorization?

- [Edge Case 1 & Mitigation]
- [Edge Case 2 & Mitigation]
