const Car = require('../models/car');
const User = require('../models/user');
const config = require('../config');
const upload = require("../middleware/multer");
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const verifyToken = require('../middleware/authMiddleware');
const axios = require('axios');
const createPath = (page) => path.resolve(__dirname, '..', 'views', `${page}.ejs`);
const uploadDir = path.join(__dirname,'..', 'public', 'uploads_img');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

function brandCountry(brand){
    let country;
    switch(brand){
        case 'Vintage':
            country = 'DE';
            break;
        case 'Hypercars':
            country = 'JP';
            break;
        case 'Classics':
            country = 'DE';
            break;
        case 'Concepts':
            country = 'DE';
            break;
        case 'Limited Edition':
            country = 'DE';
            break;
        case 'Digital Art':
            country = 'JP';
            break;
        case 'Racing Series':
            country = 'IT';
            break;
        case 'Future Tech':
            country = 'US';
            break;
        default:
            country = null;
    }
    return country;
}


exports.getAll = async (req, res) => {
	console.log(uploadDir);
	verifyToken(req, res);
	if(!res.auth) res.render(createPath('error'));
	const user = await User.findById(req.userId);
	const cars = await Car.find();
	res.render(createPath('cars'), {'auth': res.auth, 'admin': res.admin, 'cars': cars, 'user': user});
};

exports.getOne = async (req, res) => {
  verifyToken(req, res);
	if(!res.auth) res.render(createPath('error'));
	try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.render(createPath('error'));
    }
		const user = await User.findById(req.userId);
		const country = brandCountry(car.brand);
		let flag = null;
		let logo = null;
		let fav = false;

		if(car.brand){
			flag = `https://flagsapi.com/${country}/flat/64.png`;
			const resp = await axios.get('https://api.api-ninjas.com/v1/logo', {
				params: {
					name: car.brand
				},
				headers: {
					'X-Api-Key': config.api_ninja
				}
			});
			logo = resp.data;
		}
		if(user.favorite.includes(car.id)) fav = true;
		res.render(createPath('car'), {'auth': res.auth, 'admin': res.admin, 'car': car, 'user': user, 'flag': flag || false, 'logo': logo || false, 'fav': fav});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
	verifyToken(req, res);
	if(!res.auth || !res.admin ) res.render(createPath('error'));

	const form = new formidable.IncomingForm();
	form.uploadDir = uploadDir;
	form.keepExtensions = true;

	form.parse(req, async (err, fields, files) => {
		
			const imgPaths = {};
			const imageKeys = ['img1', 'img2', 'img3']; 

			imageKeys.forEach((key) => {
				const file = files[key];
				if (file) {
					const fileExt = file[0].originalFilename.match(/\.(jpg|jpeg|png)$/i); 
					const newFileName = `${file[0].newFilename}${fileExt[0]}`; 
					const newfilePath = path.join(uploadDir, newFileName);
					fs.rename(file[0].filepath, newfilePath, function(err) {
						if ( err ) console.log('ERROR: ' + err);
					});
					
					imgPaths[key] = path.join("uploads_img",path.basename(newfilePath));
				} else {
					imgPaths[key] = undefined; 
				}
			});
			
			const { name, description, brand, price, type, ownerName, phoneNumber} = fields;
			const newCar = new Car({ name: name[0], description: description[0], brand: brand[0], price: price[0], type: type[0], ownerName: ownerName[0], phoneNumber: phoneNumber[0], img1: imgPaths['img1'],img2: imgPaths['img2'],img3: imgPaths['img3']});
			await newCar.save();

			res.redirect("/cars/"+newCar._id);
	});
};

exports.createPage = async (req, res) => {
	verifyToken(req, res);
	if(!res.auth || !res.admin) res.render(createPath('error'));
	const user = await User.findById(req.userId);
	res.render(createPath('create'), {'auth': res.auth, 'admin': res.admin, 'user': user});
};

exports.updatePage = async (req, res) => {
	verifyToken(req, res);
	if(!res.auth || !res.admin) res.render(createPath('error'));
	const car = await Car.findById(req.params.id);
	if(car!=null){
		const user = await User.findById(req.userId);
		res.render(createPath('update'), {'auth': res.auth, 'admin': res.admin, 'user': user, 'car': car});
	}else{
		res.status(404).json("car is not found!");
	}
};

exports.update = async (req, res) => {
	verifyToken(req, res);
	if(!res.auth || !res.admin ) res.render(createPath('error'));
	
	const { name, description, brand, price, type, ownerName, phoneNumber} = req.body;
	try {
		const updatedCar = await Car.findByIdAndUpdate(req.params.id, { name, description, brand, price, type, ownerName, phoneNumber});
		if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
		res.redirect("/cars/"+updatedCar._id)
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.deleteById = async (req, res) => {
	verifyToken(req, res);
	if(!res.auth || !res.admin ) res.render(createPath('error'));
	
	try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.redirect(req.headers.referer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};