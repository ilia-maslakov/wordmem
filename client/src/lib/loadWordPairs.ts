import { gql } from "@apollo/client"
import { client } from "@/lib/apollo"
import type { WordPair } from "@/types/wordPair"

const GET_RANDOM_PAIRS = gql`
  query GetRandomPairs($count: Int!) {
    randomPairs(count: $count) {
      id
      russian
      english
      category
    }
  }
`

export const loadUniqueWordPairs = async (targetCount: number): Promise<WordPair[]> => {
  const result: WordPair[] = []

  while (result.length < targetCount) {
    const { data } = await client.query({
      query: GET_RANDOM_PAIRS,
      variables: { count: 1 },
      fetchPolicy: "no-cache",
    })

    const pair = data?.randomPairs?.[0]
    if (pair && !result.some(p => p.id === pair.id)) {
      result.push(pair)
    }
  }

  return result
}
