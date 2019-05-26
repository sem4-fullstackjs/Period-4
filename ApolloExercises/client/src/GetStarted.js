import React from 'react'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost'

const client = new ApolloClient({
	uri: 'https://48p1r2roz4.sse.codesandbox.io'
})

const ExchangeRates = () => (
	<Query
		query={gql`
			{
				rates(currency: "USD") {
					currency
					rate
				}
			}
		`}
	>
		{({ loading, error, data }) => {
			if (loading) return <p>Loading...</p>
			if (error) return <p>Error :(</p>

			return data.rates.map(({ currency, rate }) => (
				<div key={currency}>
					<p>
						{currency}: {rate}
					</p>
				</div>
			))
		}}
	</Query>
)

const App = () => (
	<ApolloProvider client={client}>
		<div>
			<h2>My first Apollo app</h2>
			<ExchangeRates />
		</div>
	</ApolloProvider>
)
export default App

client
	.query({
		query: gql`
			{
				rates(currency: "USD") {
					currency
				}
			}
		`
	})
	.then(result => console.log(result))
