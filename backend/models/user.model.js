import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		gender: {
			type: String,
			required: true,
			enum: ['male', 'female']
		},
		birthDay: {
			type: Date,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		role: {
			type: String,
			enum: ['admin', 'player'],
			default: 'player'
		}
	},
	{
		timestamps: { currentTime: () => Date.now() + 5.5 * 60 * 60 * 1000 }
	}
);

export default mongoose.model('User', UserSchema);
