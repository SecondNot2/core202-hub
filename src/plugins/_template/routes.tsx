/**
 * Plugin Routes - Define the plugin's routes
 */

import type { RouteObject } from "react-router-dom";
import { TemplateHome } from "./components/TemplateHome";

export const routes: RouteObject[] = [
  {
    // Index route (matches basePath exactly)
    index: true,
    element: <TemplateHome />,
  },
  // Add more routes as needed
  // {
  //   path: 'settings',
  //   element: <TemplateSettings />,
  // },
  // {
  //   path: 'item/:id',
  //   element: <TemplateDetail />,
  // },
];
