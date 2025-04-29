const jwt = require('jsonwebtoken');
const config = require('../config');
const admin = config.admin;

function verifyToken(req, res) {
	const token = req.cookies.token;
	if (!token) return res.auth=false;
	try {
	const decoded = jwt.verify(token, config.jwt);
	req.userId = decoded.userId;
	res.auth=true;
	admin.includes(decoded.userId)? res.admin = true : res.admin = false;
	} catch (error) {
	res.auth=false;
	}
};

module.exports = verifyToken;