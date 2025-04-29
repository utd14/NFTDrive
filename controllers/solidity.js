const path = require('path');
const solc = require('solc');
const fs = require('fs');
const verifyToken = require('../middleware/authMiddleware');
const User = require('../models/user');
const createPath = (page) => path.resolve(__dirname, '..', 'views', `${page}.ejs`);

exports.solidityPage = async (req, res) => {
    verifyToken(req, res);
    let user = '';
    if(res.auth) {
        user = await User.findOne({_id:req.userId});
    }

    const sampleContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CarOwnership {
    struct Car {
        string make;
        string model;
        uint year;
        address owner;
    }
    
    mapping(uint => Car) public cars;
    uint public carCount;
    
    event CarRegistered(uint carId, string make, string model, uint year);
    event OwnershipTransferred(uint carId, address previousOwner, address newOwner);
    
    function registerCar(string memory _make, string memory _model, uint _year) public {
        carCount++;
        cars[carCount] = Car(_make, _model, _year, msg.sender);
        emit CarRegistered(carCount, _make, _model, _year);
    }
    
    function transferOwnership(uint _carId, address _newOwner) public {
        require(_carId > 0 && _carId <= carCount, "Invalid car ID");
        require(cars[_carId].owner == msg.sender, "Only the car owner can transfer ownership");
        
        address previousOwner = cars[_carId].owner;
        cars[_carId].owner = _newOwner;
        
        emit OwnershipTransferred(_carId, previousOwner, _newOwner);
    }
}`;

    res.render(createPath('solidity'), {
        auth: res.auth, 
        admin: res.admin, 
        user: user,
        sampleContract: sampleContract
    });
};

exports.compileContract = async (req, res) => {
    verifyToken(req, res);
    const { contractCode } = req.body;
    
    try {
        const input = {
            language: 'Solidity',
            sources: {
                'contract.sol': {
                    content: contractCode
                }
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['*']
                    }
                }
            }
        };

        const output = JSON.parse(solc.compile(JSON.stringify(input)));
        
        // Check for errors
        if (output.rs) {
            return json({ success: false, errors: output.errors });
        }
        
        const contractName = Object.keys(output.contracts['contract.sol'])[0];
        const contract = output.contracts['contract.sol'][contractName];
        
        res.json({
            success: true,
            abi: contract.abi,
            bytecode: contract.evm.bytecode.object
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }
};