import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema(
	{
		teamName: {
			type: String,
			required: true
		},
		gameName: {
			type: String,
			required: true,
			enum: ['cricket', 'volleyball']
		},
		teamSize: {
			type: Number,
			required: true
		},
		genderGroup: {
			type: String,
			required: true,
			enum: ['male', 'female']
		},
		minAge: {
			type: Number,
			required: false
		},
		maxAge: {
			type: Number,
			required: true
		},
		playerIds: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			}
		]
	},
	{
		timestamps: { currentTime: () => Date.now() + 5.5 * 60 * 60 * 1000 }
	}
);

export default mongoose.model('Team', TeamSchema);
