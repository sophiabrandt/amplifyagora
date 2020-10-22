# amplifyagora

> React marketplace app with AWS Amplify

## Motivation & Features

This is a clone and coding-along-repo, see [reedbarger/amplifyagora](https://github.com/reedbarger/amplifyagora).

I rewrote the app to use Hooks and functional components. I implemented several custom hooks. Example: [`useAmplifyAuth`](https://www.rockyourcode.com/custom-react-hook-use-aws-amplify-auth/).

## Tech used

**Built with**

- React
- AWS Amplify
- AWS Lambda
- GraphQL
- [Element UI](https://element.eleme.io/#/en-US)

## Installation

1. Clone the repository: `git clone git@github.com:sophiabrandt/amplifyagora.git`

2. Create an AWS account and install Amplify CLI: [Amplify Framework](https://aws-amplify.github.io/docs/)

3. Run `amplify init` with default options. Use AWS profile.

4. Add Amplify API: `amplify add api`: select GraphQL, use Amazon Cognito User Pool with default configurations.

5. Replace the `schema.graphql`:

```graphql
type Market @model @searchable {
  id: ID!
  name: String!
  products: [Product]
    @connection(name: "MarketProducts", sortField: "createdAt")
  tags: [String]
  owner: String!
  createdAt: String
}

type Product
  @model
  @auth(
    rules: [
      {
        allow: owner
        identityField: "sub"
        operations: [create, update, delete]
      }
    ]
  ) {
  id: ID!
  description: String!
  market: Market @connection(name: "MarketProducts")
  file: S3Object!
  price: Float!
  shipped: Boolean!
  owner: String
  createdAt: String
}

type S3Object {
  bucket: String!
  region: String!
  key: String!
}

type User
  @model(
    queries: { get: "getUser" }
    mutations: { create: "registerUser", update: "updateUser" }
    subscriptions: null
  ) {
  id: ID!
  username: String!
  email: String!
  registered: Boolean
  orders: [Order] @connection(name: "UserOrders", sortField: "createdAt")
}

type Order
  @model(
    queries: null
    mutations: { create: "createOrder" }
    subscriptions: null
  ) {
  id: ID!
  product: Product @connection
  user: User @connection(name: "UserOrders")
  shippingAddress: ShippingAddress
  createdAt: String
}

type ShippingAddress {
  city: String!
  country: String!
  address_line1: String!
  address_state: String!
  address_zip: String!
}
```

6. Run `amplify push`.

7. Add lambda function: `amplify add api`: choose `REST`, provide path `/charge`, name it `orderlambda`, use `serverless`, don't add the function now. Push the function to the cloud with `amplify push`.

8. Add environment variables:

You have to create an `.env` file with:

```
STRIPE_SECRET_KEY=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
```

## Credits

Copyright © 2020 [Reed Barger](https://github.com/reedbarger) and Sophia Brandt.
