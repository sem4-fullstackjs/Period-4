import mongoose from 'mongoose'
import { Friends } from './dbConnect'

// resolver map
export const resolvers = {
	Query: {
		getOneFriend: ({ id }) => {
			return new Friend(id, friendDatabase[id])
		}
	},
	Mutation: {
		createFriend: async (root, { input }) => {
			const newFriend = new Friends({
				firstName: input.firstName,
				lastName: input.lastName,
				gender: input.gender,
				age: input.age,
				language: input.language,
				email: input.email,
				contacts: input.contacts
			})

			newFriend.id = newFriend._id

			return await JSON.stringify(newFriend.save())
		},
		updateFriend: (root, { input }) => {
			return new Promise((resolve, object) => {
				Friends.findOneAndUpdate({ _id: input.id }, input, { new: true }, (err, friend) => {
					if (err) reject(err)
					else resolve(friend)
				})
			})
		},
		deleteFriend: (root, { id }) => {
			return new Promise((resolve, object) => {
				Friends.remove({ _id: id }, err => {
					if (err) reject(err)
					else resolve('Successfully deleted friend')
				})
			})
		}
	}
}
