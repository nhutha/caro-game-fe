import { gql } from '@apollo/client';

export const SIGN_IN_USER = gql`
  mutation SignInUser($input: SignInUserInput!) {
    signInUser(input: $input) {
      accessToken
    }
  }
`;

export const SIGN_UP_USER = gql`
  mutation SignUpUser($input: SignUpUserInput!) {
    signUpUser(input: $input) {
      accessToken
      user {
        id
        email
        username
      }
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      success
      message
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      email
      username
      createdAt
    }
  }
`;
