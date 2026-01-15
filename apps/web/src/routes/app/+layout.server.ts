// Server-side load for app routes
// Note: Session verification is handled client-side in +layout.svelte
// because cookies don't transfer across ports in development (3000 vs 5173)
//
// For production with a single domain, you can enable server-side session verification

export const load = async () => {
  return {
    session: null, // Will be populated client-side
  };
};
