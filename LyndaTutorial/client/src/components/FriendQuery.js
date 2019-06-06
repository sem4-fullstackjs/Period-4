import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'

// const GET_ONE_FRIEND = gql`
// 	query User($ID: ID!) {
// 		getOneFriend(id: $ID) {
// 			firstName
// 			lastName
// 			email
// 		}
// 	}
// `

const CREATE_FRIEND = gql`
	mutation CreateFriend($FriendInput: FriendInput) {
		createFriend(input: $FriendInput)
	}
`

// const GetOneFriend = ({ id }) => (
// 	<Query query={GET_ONE_FRIEND} variables={{ id }} skip={!id} notifyOnNetworkStatusChange>
// 		{({ loading, error, data, networkStatus }) => {
// 			if (networkStatus === 4) return 'Refetching!'
// 			if (loading) return <p>Loading...</p>
// 			if (error) return `Error! ${error.message}`

// 			return (
// 				<div>
// 					<p>{data.firstName}\n</p>
// 					<p>{data.lastName}\n</p>
// 					<p>{data.age}\n</p>
// 					<p>{data.emails}</p>
// 				</div>
// 			)
// 		}}
// 	</Query>
// )

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
									this.setState({ response: response.data.createFriend })
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

export { CreateFriend }
