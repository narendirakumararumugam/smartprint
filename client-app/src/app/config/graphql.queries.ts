import { gql } from "@apollo/client/core";

export const graphqlQueries = {
    GET_POPULAR_NEARBY_SHOPS: gql`
        query GetPopularShopsNearby($userLat: Float!, $userLon: Float!) {
            getPopularShopsNearby(userLat: $userLat, userLon: $userLon) {
                id
                name
                
            }
        }
            `
}