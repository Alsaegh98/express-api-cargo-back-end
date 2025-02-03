
const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Cargo = require('../models/cargo.js');
const nodemailer = require('nodemailer');
const router = express.Router();


const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like SendGrid, or Mailgun
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or App password
    },
  });
  
  const sendConfirmationEmail = async (email) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'We have received your Cargo Inquiry',
      text: 'Thank you for your inquiry. We will get back to you shortly!',
    };

    try {
        console.log(`Attempting to send email to ${email}`);
        let info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully: ${info.response}`);
    } catch (error) {
        console.error(`Error sending email: ${error}`);
    }
};

    
// ========= Protected Routes =========

router.use(verifyToken);

router.get('/test-email', async (req, res) => {
  try {
    await sendConfirmationEmail('test-email@example.com');
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    res.status(500).send('Error sending email');
  }
});


// router.post('/', async (req, res) => {
//     try {
//         console.log('Received inquiry:', req.body); // Check incoming request data
        
//         if (!req.body.email) {
//             return res.status(400).json({ error: 'Email is required' });
//         }

//         req.body.author = req.user._id;
//         const cargo = await Cargo.create(req.body);
//         cargo._doc.author = req.user;

//         console.log(`Calling sendConfirmationEmail for: ${req.body.email}`);
//         await sendConfirmationEmail(req.body.email);
//         console.log('Email function executed successfully');

//         res.status(201).json(cargo);
//     } catch (error) {
//         console.error('Error in creating inquiry:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

router.post('/', verifyToken, async (req, res) => {  // <-- Now only authenticated users can post inquiries
    try {
        req.body.author = req.user._id;
        const cargo = await Cargo.create(req.body);
        cargo._doc.author = req.user;

        console.log(`Sending confirmation email to: ${req.body.email}`);
        await sendConfirmationEmail(req.body.email);

        res.status(201).json(cargo);
    } catch (error) {
        console.error('Error in creating inquiry:', error);
        res.status(500).json({ error: 'Internal Server Error' });
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