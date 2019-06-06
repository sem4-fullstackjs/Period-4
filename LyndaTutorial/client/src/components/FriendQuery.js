import React, { useState, Component } from 'react'
import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'
import { Query, ApolloConsumer, Mutation } from 'react-apollo'
import _ from 'lodash'
import Table from 'react-bootstrap/Table'
import ListGroup from 'react-bootstrap/ListGroup'

const GET_ONE_FRIEND = gql`
	query Friend($ID: ID!) {
		getOneFriend(id: $ID) {
			firstName
			lastName
		}
	}
`

const CREATE_FRIEND = gql`
	mutation CreateFriend($FriendInput: FriendInput) {
		createFriend(input: $FriendInput)
	}
`

class CreateFriend extends Component {
	constructor(props) {
		super(props)
		this.state = { friendInput: {} }
	}

	render() {
		return (
			<>
				<h2>Create a friend</h2>
				<Mutation mutation={CREATE_FRIEND}>
					{createFriend => (
						<div>
							<form
								onSubmit={async e => {
									e.preventDefault()
									const response = await createFriend({
										variables: { FriendInput: this.state.friendInput }
									})
									this.setState({
										response: response.data.createFriend
									})
								}}
								onChange={e => {
									let friendInput = this.state.friendInput
									friendInput[e.target.name] = e.target.value
									this.setState({ friendInput: friendInput })
								}}
							>
								<input name="firstName" placeholder="First Name" />
								<input name="lastName" placeholder="Last Name" />
								<input name="gender" placeholder="Gender" />
								<input name="age" placeholder="Age" />
								<input name="language" placeholder="Language" />
								<input name="email" placeholder="Email" />
								<button>Submit</button>
							</form>
						</div>
					)}
				</Mutation>
				{this.state && JSON.stringify(this.state)}
				{this.state.response &&
					`${JSON.parse(this.state.response).status} ${
						JSON.parse(this.state.response).msg
					}`}
			</>
		)
	}
}

const Friend = ({ id }) => (
	<Query query={GET_ONE_FRIEND} variables={{ id }} skip={!id} notifyOnNetworkStatusChange>
		{({ loading, error, data, networkStatus }) => {
			if (networkStatus === 4) return 'Refetching!'
			if (loading) return <p>Loading...</p>
			if (error) return `Error! ${error.message}`

			return (
				<ListGroup>
					<ListGroup.Item>{data.firstName}</ListGroup.Item>
					<ListGroup.Item>{data.lastName}</ListGroup.Item>
				</ListGroup>
			)
		}}
	</Query>
)

// const DelayedFriend = () => {
// 	// https://reactjs.org/docs/hooks-state.html
// 	const [selectedFriend, selectFriend] = useState(undefined)
// 	const [friendId, setFriendId] = useState(undefined)
// 	const [error, setError] = useState(undefined)

// 	return (
// 		<>
// 			<h2>Find a friend</h2>
// 			<ApolloConsumer>
// 				{client => (
// 					<div>
// 						{selectedFriend && JSON.stringify(selectFriend)}
// 						<input
// 							type="text"
// 							placeholder="Enter friend ID"
// 							onChange={e => setFriendId(e.target.value)}
// 						/>
// 						<button
// 							onClick={async () => {
// 								try {
// 									setError(undefined)
// 									const { loading, data } = await client.query({
// 										query: GET_ONE_FRIEND,
// 										variables: { ID: friendId }
// 									})
// 									console.log(loading)
// 									selectFriend(data.getOneFriend)
// 								} catch (e) {
// 									setError(e)
// 								}
// 							}}
// 						>
// 							Find friend
// 						</button>
// 					</div>
// 				)}
// 			</ApolloConsumer>
// 			{error && JSON.stringify(error)}
// 			{selectedFriend && (
// 				<ListGroup>
// 					<ListGroup.Item>{`First name: ${selectedFriend.firstName}`}</ListGroup.Item>
// 					<ListGroup.Item>{`Last name: ${selectedFriend.lastName}`}</ListGroup.Item>
// 				</ListGroup>
// 			)}
// 		</>
// 	)
// }

export { CreateFriend, DelayedFriend, Friend }
