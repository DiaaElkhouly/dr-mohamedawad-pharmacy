// Admin authentication configuration
// Credentials are loaded from environment variables for security

// Server-side only - these values are never exposed to the client
export const getAdminCredentials = () => ({
  username: process.env.ADMIN_USERNAME || "admin",
  password: process.env.ADMIN_PASSWORD || "admin123",
});

// Simple token-based authentication (for demo purposes)
// In production, use proper JWT or session-based authentication
export function createAdminToken() {
  // Create a simple token with expiration
  const payload = {
    isAdmin: true,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  return btoa(JSON.stringify(payload));
}

export function verifyAdminToken(token) {
  try {
    const payload = JSON.parse(atob(token));
    return payload.isAdmin && payload.exp > Date.now();
  } catch {
    return false;
  }
}
