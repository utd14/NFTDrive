const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
	name:{
		type: String,
		required: true,
	},
	description:{
		type: String,
		required: true,
	},
	brand:{
		type: String,
		required: false,
	},
	price:{
		type: String,
		required: true,
	},
	type:{
		type: String,
		required: false,
	},
	ownerName:{
		type: String,
		required: true,
	},
	phoneNumber:{
		type: String,
		required: true,
	},
	img1:{
		type: String,
		required: false,
	},
	img2:{
		type: String,
		required: false,
	},
	img3:{
		type: String,
		required: false,
	},
}, {timestamps: true});

const Car = mongoose.model('Car', carSchema);
module.exports = Car;