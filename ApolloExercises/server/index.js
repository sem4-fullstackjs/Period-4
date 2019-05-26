const { ApolloServer, gql } = require("apollo-server");
const fetch = require("node-fetch");
const { unique } = require("shorthash");
const _ = require("lodash");
const LRU = require("lru-cache");
const { generate } = require("shortid");

const API = "https://dog.ceo/api";

// Construct a schema, using GraphQL schema language
const typeDefs = `
  type Query {
    dogs: [Dog]
    dog(breed: String!): Dog
    todos: [Todo]
		todo(id: String!): Todo
  }

	type Dog @cacheControl(maxAge: 1000) {
		id: String!
		breed: String!
		displayImage: String
		images: [Image]
		subbreeds: [String]
	}

	type Image @cacheControl(maxAge: 1000) {
		url: String!
		id: String!
  }
  
	type Todo {
		id: String!
		type: String!
	}

	type Mutation {
		addTodo(type: String!): Todo
		updateTodo(id: String!, type: String!): Todo
	}

`;

const createDog = (subbreeds, breed) => ({
  breed,
  id: unique(breed),
  subbreeds: subbreeds.length > 0 ? subbreeds : null
});

const cache = LRU({ max: 50, maxAge: 1000 * 60 * 60 });
// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    dogs: async () => {
      const results = await fetch(`${API}/breeds/list/all`);
      const { message: dogs } = await results.json();

      return _.map(dogs, createDog);
    },
    dog: async (root, { breed }) => {
      const results = await fetch(`${API}/breed/${breed}/list`);
      const { message: subbreeds } = await results.json();

      return createDog(subbreeds, breed);
    },
    todos: () => {
      const todos = [];
      cache.forEach((type, id) => todos.push({ type, id }));
      return todos;
    },
    todo: (_, { id }) => {
      return { id, type: cache.get(id) };
    }
  },
  Dog: {
    displayImage: async ({ breed }) => {
      const results = await fetch(`${API}/breed/${breed}/images/random`);
      const { message: image } = await results.json();
      return image;
    },
    images: async ({ breed }) => {
      const results = await fetch(`${API}/breed/${breed}/images`);
      const { message: images } = await results.json();
      return images.map(image => ({ url: image, id: unique(image) }));
    }
  },
  Mutation: {
    addTodo: (_, { type }) => {
      const id = generate();
      const todo = { type, id };
      cache.set(id, type);
      return todo;
    },
    updateTodo: (_, { type, id }) => {
      const todo = { type, id };
      cache.set(id, type);
      return todo;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
