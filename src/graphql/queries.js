/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCard = /* GraphQL */ `
  query GetCard($id: ID!) {
    getCard(id: $id) {
      id
      hsid
      name
      cost
      attack
      health
      class
      rarity
      set
      createdAt
      updatedAt
    }
  }
`;
export const listCards = /* GraphQL */ `
  query ListCards(
    $filter: ModelCardFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCards(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        hsid
        name
        cost
        attack
        health
        class
        rarity
        set
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
