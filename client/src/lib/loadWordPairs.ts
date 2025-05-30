import { gql } from "@apollo/client";
import { client } from "@/lib/apollo";
import type { WordPair } from "@/types/wordPair";

const GET_RANDOM_PAIRS = gql`
  query GetRandomPairs($count: Int!) {
    randomPairs(count: $count) {
      id
      russian
      english
      category
    }
  }
`;

const fallbackWordPairs: WordPair[] = [
  {
    id: "11m22",
    russian: "дом",
    english: "house",
    category: "Основные",
    shows: 1,
  },
  {
    id: "1m223",
    russian: "яблоко",
    english: "apple",
    category: "Основные",
    shows: 1,
  },
  {
    id: "m42222",
    russian: "солнце",
    english: "sun",
    category: "Основные",
    shows: 0,
  },
  {
    id: "24m522",
    russian: "вода",
    english: "water",
    category: "Основные",
    shows: 1,
  },
  {
    id: "fddm446",
    russian: "стол",
    english: "table",
    category: "Основные",
    shows: 2,
  },
  {
    id: "mdffdff7",
    russian: "книга",
    english: "book",
    category: "Основные",
    shows: 0,
  },
  {
    id: "m844r",
    russian: "молоко",
    english: "milk",
    category: "Основные",
    shows: 1,
  },
  {
    id: "mrgdf4449",
    russian: "машина",
    english: "car",
    category: "Основные",
    shows: 1,
  },
  {
    id: "m4140ttrr",
    russian: "река",
    english: "river",
    category: "Основные",
    shows: 1,
  },
  {
    id: "m3241",
    russian: "кот",
    english: "cat",
    category: "Основные",
    shows: 3,
  },
];

export const loadUniqueWordPairs = async (
  targetCount: number,
): Promise<WordPair[]> => {
  const result: WordPair[] = [];

  try {
    while (result.length < targetCount) {
      const { data } = await client.query({
        query: GET_RANDOM_PAIRS,
        variables: { count: 1 },
        fetchPolicy: "no-cache",
      });

      const pair = data?.randomPairs?.[0];
      if (pair && !result.some((p) => p.id === pair.id)) {
        result.push(pair);
      }
    }

    return result;
  } catch (err) {
    console.error("GraphQL API недоступен. Используем мок:", err);

    // Берем первые `targetCount` из мока (или меньше, если их не хватает)
    return fallbackWordPairs.slice(0, targetCount);
  }
};
