const Web3 = require('web3');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blockchainSchema = new Schema({
    contractAddress: {
        type: String,
        required: true,
    },
    contractType: {
        type: String,
        required: true,
    },
    abi: {
        type: String,
        required: true,
    },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {timestamps: true});

const BlockchainContract = mongoose.model('BlockchainContract', blockchainSchema);
module.exports = BlockchainContract;