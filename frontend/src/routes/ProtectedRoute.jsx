import React from 'react';

/**
 * ProtectedRoute — AUTH BYPASSED for frontend demo.
 * Simply renders children unconditionally.
 * Re-enable auth by restoring the original implementation when backend is ready.
 */
export default function ProtectedRoute({ children }) {
  return children;
}
