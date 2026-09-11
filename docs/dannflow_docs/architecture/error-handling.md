# Error Handling & Logging

Standard practices for handling errors and logs within DannFlow's architecture.

## 1. Next.js Error Boundaries

- Use Next.js `error.tsx` and `global-error.tsx` files to gracefully catch unexpected errors in Server and Client components.
- Never expose raw database stack traces to the UI.

## 2. Service Layer Error Handling

All functions in `src/services/` should follow a consistent try/catch pattern.

- Log the actual error to your server console or observability platform (e.g. Sentry).
- Return a standardized error object to the UI (e.g. `{ success: false, error: 'User-friendly message' }`).

```typescript
// Example Service Layer function
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error("[getUserProfile Error]:", err);
    return { success: false, error: "Could not load user profile." };
  }
}
```

## 3. Logging

- Keep server logs clean. Only `console.error` critical failures that need developer attention.
- Avoid logging PII (Personally Identifiable Information) or secure tokens in the server logs.
