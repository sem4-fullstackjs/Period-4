import React, { Component } from "react";
import { render } from "react-dom";

import ApolloClient from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";
import gql from "graphql-tag";

/*
Start code made from this project: https://codesandbox.io/s/znl94y0vp
*/


const client = new ApolloClient({
  uri: "http://localhost:4000/"
});

const GET_TODOS = gql`
  {
    todos {
      id
      type
    }
  }
`;

const Todos = () => (
  <Query query={GET_TODOS}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return data.todos.map(({ id, type }) => {
        let input;

        return (
          <div key={id}>
            <p>{type}</p>
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!input.value.trim()) {
                  return;
                }

                input.value = "";
              }}
            >
              <input
                ref={node => {
                  input = node;
                }}
              />
              <button type="submit">Update Todo</button>
            </form>
          </div>
        );
      });
    }}
  </Query>
);

const AddTodo = () => {
  let input;

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!input.value.trim()) {
            return;
          }

          input.value = "";
        }}
      >
        <input
          ref={node => {
            input = node;
          }}
        />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
};

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <h2>Building Mutation components 🚀</h2>
      <AddTodo />
      <h3>All Todos</h3>
      <Todos />
    </div>
  </ApolloProvider>
);

export default App;
