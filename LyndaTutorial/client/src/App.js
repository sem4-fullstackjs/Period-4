import React from 'react'
import './App.css'
import ApolloClient from 'apollo-boost'

import { ApolloProvider, ApolloConsumer } from 'react-apollo'
import { DelayedFriend, CreateFriend } from './components/FriendQuery'

const client = new ApolloClient({
	uri: 'http://localhost:8080/graphql'
})

function App() {
	return (
		<ApolloProvider client={client}>
			<CreateFriend />
			<DelayedFriend />
		</ApolloProvider>
	)
}

export default App
