import { use } from "react";
import { fetchResource } from "../lib/api";

/**
 * Reads an API resource with React 19's use(). The component suspends until the data
 * is ready, so wrap it in <Suspense> (loading) and an <ErrorBoundary> (failures).
 */
export function useResource(path) {
  return use(fetchResource(path));
}
