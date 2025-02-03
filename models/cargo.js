
// const mongoose = require('mongoose');

// const cargoSchema = new mongoose.Schema(
//     {

//       email: {
//         type: String,
//         required: true,
//       },

//       contact: {
//         type: Number,
//         required: true,
//       },

//       trade: {
//         type: String,
//         required: true,
//         enum: ['Import', 'Export',],
//       },

//       type: {
//         type: String,
//         required: true,
//         enum: ['Custom Clearance', 'Transportation', 'Packing & Moving', 'Freight Forwarders',],
//       },

//       notes: {
//         type: String,
//       },

//       author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     },
//     { timestamps: true }
//   );
  
// const Cargo = mongoose.model('Cargo', cargoSchema);
// module.exports = Cargo;

const mongoose = require('mongoose');
const crypto = require('crypto');

const encryptEmail = (email) => {
    const secret = process.env.ENCRYPTION_KEY;
    const cipher = crypto.createCipher('aes-256-cbc', secret);
    let encrypted = cipher.update(email, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

const cargoSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        set: encryptEmail, // Encrypt before saving
    },
    contact: { type: Number, required: true },
    trade: { type: String, required: true, enum: ['Import', 'Export'] },
    type: { type: String, required: true, enum: ['Custom Clearance', 'Transportation', 'Packing & Moving', 'Freight Forwarders'] },
    notes: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Cargo', cargoSchema);

