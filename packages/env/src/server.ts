import 'dotenv/config';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

const envSchema = createEnv({
  server: {
    // ═══════════════════════════════════════════════════════════════════
    // EXISTING VARIABLES (maintained for backward compatibility)
    // ═══════════════════════════════════════════════════════════════════

    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    CORS_ORIGIN: z.string().optional(), // Accept comma-separated origins
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3000),

    // ═══════════════════════════════════════════════════════════════════
    // ENCRYPTION CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Encryption key for API key storage (AES-256-GCM).
     *
     * This key is used to encrypt API keys at rest in the database.
     * Must be a 32-byte base64-encoded key (256 bits).
     *
     * Generate one with:
     * - OpenSSL: openssl rand -base64 32
     * - Node.js: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
     * - Bun: bun -e "console.log(crypto.randomBytes(32).toString('base64'))"
     *
     * SECURITY: Keep this key secret! Rotate it only with proper migration.
     * Losing this key will make all encrypted API keys permanently unreadable.
     *
     * @example "dGhpc2lzYW5leGFtcGxlb2ZhMzJieXRlYmFzZTY0ZW5jb2RlZGtleQ=="
     */
    ENCRYPTION_KEY: z
      .string()
      .min(1, 'ENCRYPTION_KEY is required for API key encryption')
      .refine(
        (val) => {
          try {
            const decoded = Buffer.from(val, 'base64');
            // Check if it's valid base64 and exactly 32 bytes (256 bits)
            return decoded.length === 32;
          } catch {
            return false;
          }
        },
        {
          message:
            'ENCRYPTION_KEY must be a 32-byte base64-encoded key (256 bits). ' +
            'Generate one with: openssl rand -base64 32',
        }
      ),

    // ═══════════════════════════════════════════════════════════════════
    // AUTHENTICATION METHOD CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Enable email/password authentication.
     * Set to "false" to disable email/password login (e.g., when using SSO only).
     *
     * @default "true"
     */
    EMAIL_PASSWORD_ENABLED: z.string().optional(),
    PUBLIC_EMAIL_PASSWORD_ENABLED: z.string().optional(),

    // ═══════════════════════════════════════════════════════════════════
    // AI PROVIDER CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════
    //
    // AI providers are now configured via the web UI (Settings → Models).
    // API keys are stored securely in the database (encrypted with AES-256-GCM).
    //
    // No environment variables are needed for AI provider configuration.
    //
    // ═══════════════════════════════════════════════════════════════════

    // ═══════════════════════════════════════════════════════════════════
    // KEYCLOAK OIDC CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Keycloak base URL.
     * Format: https://your-keycloak-domain
     * Example: https://keycloak.example.com
     */
    KEYCLOAK_URL: z.string().url().optional(),

    /**
     * Keycloak realm name.
     * Example: myrealm
     */
    KEYCLOAK_REALM: z.string().optional(),

    /**
     * Keycloak client ID for OIDC authentication.
     * Create a client in your Keycloak realm to get this value.
     */
    KEYCLOAK_CLIENT_ID: z.string().optional(),

    /**
     * Keycloak client secret for OIDC authentication.
     * Create a confidential client in Keycloak to get this value.
     */
    KEYCLOAK_CLIENT_SECRET: z.string().optional(),

    /**
     * Keycloak issuer URL (optional, will be constructed from KEYCLOAK_URL and KEYCLOAK_REALM if not provided).
     * Format: https://your-keycloak-domain/realms/your-realm
     * Example: https://keycloak.example.com/realms/myrealm
     */
    KEYCLOAK_ISSUER: z.string().url().optional(),

    // ═══════════════════════════════════════════════════════════════════
    // SECURITY HEADERS CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Enable security headers in production.
     * Set to "false" to disable security headers (useful for development/debugging).
     *
     * @default "true" in production, "false" in development
     */
    SECURITY_HEADERS_ENABLED: z.string().optional(),

    /**
     * Content Security Policy (CSP) header.
     * Controls which resources the browser is allowed to load.
     *
     * Format: semicolon-separated directives
     * Example: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
     *
     * Leave undefined to use default policy (enables necessary resources for the app).
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
     */
    CSP_HEADER: z.string().optional(),

    /**
     * Enable CSP Report-Only mode.
     * When set to "true", CSP violations are reported but not enforced.
     * Useful for testing CSP policies before enforcing them.
     *
     * @default "false"
     */
    CSP_REPORT_ONLY: z.string().optional(),

    /**
     * HTTP Strict Transport Security (HSTS) max-age in seconds.
     * Tells browsers to only use HTTPS for the specified duration.
     *
     * Recommended values:
     * - 31536000 (1 year) for production
     * - 0 (disable) for development
     *
     * @default undefined (uses environment-based defaults)
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
     */
    HSTS_MAX_AGE: z.coerce.number().optional(),

    /**
     * HSTS includeSubDomains directive.
     * When set to "true", HSTS applies to all subdomains.
     *
     * @default "true" in production
     */
    HSTS_INCLUDE_SUBDOMAINS: z.string().optional(),

    /**
     * HSTS preload directive.
     * When set to "true", allows domain inclusion in HSTS preload list.
     *
     * @default "false"
     *
     * @see https://hstspreload.org/
     */
    HSTS_PRELOAD: z.string().optional(),

    /**
     * X-Frame-Options header.
     * Controls whether the page can be embedded in frames/iframes.
     *
     * Options:
     * - "DENY": No framing allowed
     * - "SAMEORIGIN": Only allow framing from same origin
     * - "ALLOW-FROM uri": Allow framing from specific URI (deprecated)
     *
     * @default "SAMEORIGIN"
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
     */
    X_FRAME_OPTIONS: z.string().optional(),

    /**
     * X-Content-Type-Options header.
     * Prevents MIME type sniffing.
     *
     * Set to "nosniff" to enable (recommended).
     *
     * @default "nosniff"
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
     */
    X_CONTENT_TYPE_OPTIONS: z.string().optional(),

    /**
     * Referrer-Policy header.
     * Controls how much referrer information is sent.
     *
     * Options:
     * - "no-referrer": No referrer information
     * - "no-referrer-when-downgrade": Full URL when same protocol, otherwise no referrer
     * - "strict-origin-when-cross-origin": Origin only when cross-origin (recommended)
     * - "same-origin": Same origin only
     *
     * @default "strict-origin-when-cross-origin"
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
     */
    REFERRER_POLICY: z.string().optional(),

    /**
     * Permissions-Policy header.
     * Controls which browser features/APIs can be used.
     *
     * Format: comma-separated feature=origin directives
     * Example: "geolocation=(), camera=(self), microphone=()"
     *
     * Leave undefined to use default restrictive policy.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy
     */
    PERMISSIONS_POLICY: z.string().optional(),

    /**
     * Cross-Origin-Embedder-Policy (COOP) header.
     * Isolates the process from same-origin documents.
     *
     * Options:
     * - "unsafe-none": No isolation (default)
     * - "same-origin": Same-origin isolation
     *
     * @default "unsafe-none"
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy
     */
    CROSS_ORIGIN_OPENER_POLICY: z.string().optional(),

    /**
     * Cross-Origin-Resource-Policy (CORP) header.
     * Controls how the resource can be shared across origins.
     *
     * Options:
     * - "same-origin": Same origin only
     * - "same-site": Same site only
     * - "cross-origin": Any origin
     *
     * @default "same-origin"
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy
     */
    CROSS_ORIGIN_RESOURCE_POLICY: z.string().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

// Validate and export the environment
export const env = envSchema;
