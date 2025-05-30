import type { WordPair } from "@/types/wordPair.ts";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { loadUniqueWordPairs } from "@/lib/loadWordPairs.ts";

export const useLoadWordPairs = (
  targetCount: number,
): {
  error: boolean;
  loading: boolean;
  pairs: WordPair[];
  refetch: () => void;
  setPairs: Dispatch<SetStateAction<WordPair[]>>;
} => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pairs, setPairs] = useState<WordPair[]>([]);

  useEffect(() => {
    if (pairs.length) {
      return;
    }

    const fetchPairs = async () => {
      try {
        const loadedPairs = await loadUniqueWordPairs(targetCount);
        setPairs(loadedPairs);
      } catch (err) {
        console.error("Ошибка загрузки пар:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPairs().then();
  }, [targetCount, pairs]);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(false);
    setPairs([]);
  }, []);

  return { error, loading, pairs, refetch, setPairs };
};
