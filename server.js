import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql

  enum Sex{
    MALE
    FEMALE
    NA
  }

  type User{
    id: ID!
    username: String
    password: String
    firstName: String
    lastName: String
    dogs: [Dog] 
    dogParksVisited: [DogPark]
    email: String
    homeCoords: String
    nearbyParks: [DogPark] 
  }

  type Dog{
    id: ID!
    firstName: String
    lastName: String
    owner: User!
    breed: String
    color: String
    age: Int
    weight: Int
    sex: Sex 
    picture: String  # for now a path to a picture or something like that? 

  }
  
  type DogPark{
    id: ID!
    name: String
    address: String
    currentDogs: [Dog]
    previousDogs: [Dog]
    uniqueDogs: Int
    uniqueDogBreeds: [String]
  }

  type Query {
    books: [Book]
  }
`;

const books = [
    {
      title: 'The Awakening',
      author: 'Kate Chopin',
    },
    {
      title: 'City of Glass',
      author: 'Paul Auster',
    },
];

const resolvers = {
  Query: {
    books: () => books,
  },
};


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);