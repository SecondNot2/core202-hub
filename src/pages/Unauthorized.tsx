/**
 * Unauthorized Page - 403 access denied page
 */

import React from "react";
import { Link } from "react-router-dom";

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-6xl font-bold text-gray-300 dark:text-gray-600">
        403
      </div>
      <h1 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Access denied
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        You don't have permission to access this page.
      </p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
      >
        Go home
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
