const path = require('path');
const User = require('../models/user');
const Car = require('../models/car');
const verifyToken = require('../middleware/authMiddleware');
const createPath = (page) => path.resolve(__dirname, '..', 'views', `${page}.ejs`);

exports.indexPage = async (req, res) => {
  verifyToken(req, res);
	if(res.auth){
		const user = await User.findOne({_id:req.userId});
		res.render(createPath('index'), {auth: res.auth, admin: res.admin, 'user': user});
	}else{
		res.render(createPath('index'), {auth: res.auth, admin: res.admin, 'user': ''});
	}
};

exports.aboutPage = async (req, res) => {
	verifyToken(req, res);
	if(res.auth){
		const user = await User.findOne({_id:req.userId});
		res.render(createPath('about_us'), {auth: res.auth, admin: res.admin, 'user': user});
	}else{
		res.render(createPath('about_us'), {auth: res.auth, admin: res.admin, 'user': ''});
	}
};

exports.servicePage = async (req, res) => {
	verifyToken(req, res);
	if(res.auth){
		const user = await User.findOne({_id:req.userId});
		res.render(createPath('service'), {auth: res.auth, admin: res.admin, 'user': user});
	}else{
		res.render(createPath('service'), {auth: res.auth, admin: res.admin, 'user': ''});
	}
};

exports.signInPage = async (req, res) => {
  verifyToken(req, res);
	if(res.auth){
		res.redirect('/');
	}else{
		res.render(createPath('sign_in'), {message:''});
	}
};
exports.signUpPage = async (req, res) => {
  verifyToken(req, res);
	if(res.auth){
		res.redirect('/');
	}else{
		res.render(createPath('sign_up'), {message:''});
	}
};

