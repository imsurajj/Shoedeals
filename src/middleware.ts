// Simple middleware to handle API routes
export function middleware() {
  // This is a simplified middleware that doesn't use Clerk
  // We'll add authentication later when needed
}

export const config = {
  // Only run middleware for API routes
  matcher: ['/(api)(.*)', '/']
};