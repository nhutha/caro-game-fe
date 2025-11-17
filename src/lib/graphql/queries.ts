import { gql } from '@apollo/client';

export const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      name
      createdAt
      master {
        id
        username
        email
      }
      guest {
        id
        username
        email
      }
    }
  }
`;
