
const mongoose = require('mongoose');

const cargoSchema = new mongoose.Schema(
    {

      email: {
        type: String,
        required: true,
      },

      contact: {
        type: Number,
        required: true,
      },

      trade: {
        type: String,
        required: true,
        enum: ['Import', 'Export',],
      },

      type: {
        type: String,
        required: true,
        enum: ['Custom Clearance', 'Transportation', 'Packing & Moving', 'Freight Forwarders',],
      },

      notes: {
        type: String,
      },

      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
  );
  
const Cargo = mongoose.model('Cargo', cargoSchema);
module.exports = Cargo;
