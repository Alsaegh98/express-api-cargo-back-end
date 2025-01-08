
const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Cargo = require('../models/cargo.js');
const router = express.Router();

// ========== Public Routes ===========

// ========= Protected Routes =========

router.use(verifyToken);

router.post('/', async (req, res) => {
    try {
      req.body.author = req.user._id;
      const cargo = await Cargo.create(req.body);
      cargo._doc.author = req.user;
      res.status(201).json(cargo);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  });

router.get('/', async (req, res) => {
    try {
      const cargos = await Cargo.find({})
        .populate('author')
        .sort({ createdAt: 'desc' });
      res.status(200).json(cargos);
    } catch (error) {
      res.status(500).json(error);
    }
  });

router.get('/:cargoId', async (req, res) => {
    try {
      const cargo = await Cargo.findById(req.params.cargoId).populate('author');
      res.status(200).json(cargo);
    } catch (error) {
      res.status(500).json(error);
    }
  });

router.put('/:cargoId', async (req, res) => {
    try {

      const cargo = await Cargo.findById(req.params.cargoId);

      if (!cargo.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }
  
      const updatedCargo = await Cargo.findByIdAndUpdate(
        req.params.cargoId,
        req.body,
        { new: true }
      );

      updatedCargo._doc.author = req.user;
  

      res.status(200).json(updatedCargo);
    } catch (error) {
      res.status(500).json(error);
    }
  });

router.delete('/:cargoId', async (req, res) => {
    try {
      const cargo = await Cargo.findById(req.params.cargoId);
  
      if (!cargo.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }
  
      const deletedCargo = await Cargo.findByIdAndDelete(req.params.cargoId);
      res.status(200).json(deletedCargo);
    } catch (error) {
      res.status(500).json(error);
    }
  });

module.exports = router;