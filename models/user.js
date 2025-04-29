const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	firstName:{
		type: String,
		required: true,
	},
	lastName:{
		type: String,
		required: true,
	},
	email:{
		type: String,
		required: true,
	},
	password:{
		type: String,
		required: true,
	},
	age:{
		type: Number,
		required: true,
	},
	phoneNumber:{
		type: String,
		required: true,
	},
	gender:{
		type: Boolean,
		required: true,
	},
	favorite:[{ type: mongoose.Schema.Types.ObjectId, ref: 'cars' }],
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
module.exports = User;