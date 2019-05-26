import mongoose from 'mongoose'

// Mongo Connection
mongoose.Promise = global.Promise
mongoose.connect(
	'mongodb+srv://Admin:Passw0rd@gonnerscluster-g61w7.mongodb.net/friends?retryWrites=true',
	{
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false
	}
)

const friendSchema = new mongoose.Schema({
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	gender: {
		type: String
	},
	age: {
		type: Number
	},
	language: {
		type: String
	},
	email: {
		type: String
	},
	contacts: {
		type: Array
	}
})

const Friends = mongoose.model('friends', friendSchema)

export { Friends }
