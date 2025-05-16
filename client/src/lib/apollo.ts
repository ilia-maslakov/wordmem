import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://faker.coverflow.online/graphql",
  cache: new InMemoryCache(),
});
