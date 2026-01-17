/**
 * useItemsLoader Hook
 * Preloads item definitions from Supabase on mount
 */

import { useEffect, useState } from "react";
import {
  fetchEquipmentDefinitions,
  fetchConsumableDefinitions,
  isCacheReady,
} from "../services/item.service";

export function useItemsLoader() {
  const [isLoading, setIsLoading] = useState(!isCacheReady());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isCacheReady()) {
      setIsLoading(false);
      return;
    }

    const loadItems = async () => {
      try {
        await Promise.all([
          fetchEquipmentDefinitions(),
          fetchConsumableDefinitions(),
        ]);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load item definitions");
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

  return { isLoading, error };
}
