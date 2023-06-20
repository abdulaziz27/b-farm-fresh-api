const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Konfigurasi Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    logger: true,
    debug:true,
    secureConnection: false,
    auth: {
    user: 'dulzfaker@gmail.com',
    pass: 'fyloyscktlvhbibi',
    },
    tls: {
        rejectUnauthorized: true
    }
});

router.get('/', async (req, res) => {
  try {
    const userList = await User.find().select('-passwordHash');

    res.send(userList);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'The user with the given ID was not found.' });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });

    user = await user.save();

    res.send(user);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const userExist = await User.findById(req.params.id);
    let newPassword;

    if (req.body.password) {
      newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
      newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        passwordHash: newPassword,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'The user with the given ID was not found.' });
    }

    res.send(user);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.secret;

    if (!user) {
      return res.status(400).send('The user not found');
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,
        },
        secret,
        { expiresIn: '1m' }
      );

      res.status(200).send({ user: user.email, token: token });
    } else {
      res.status(400).send('password is wrong!');
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/register', async (req, res) => {
    try {
      let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
        isVerified: false, // Menambahkan isVerified dengan nilai awal false
      });
  
      user = await user.save();
  
      const verificationToken = jwt.sign({ userId: user._id }, process.env.secret, { expiresIn: '1d' });
      const verificationLink = `http://localhost:3001/verify-email/${verificationToken}`;
  
      const mailOptions = {
        from: 'dulzfaker@gmail.com',
        to: user.email,
        subject: 'Email Verification',
        text: `Click the following link to verify your email: ${verificationLink}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).json({ success: false, error: 'Failed to send verification email' });
        } else {
          console.log('Email terkirim: ' + info.response);
          const token = jwt.sign(
            {
              userId: user.id,
              isAdmin: user.isAdmin,
            },
            process.env.secret,
            { expiresIn: '1m' }
          );
          res.status(200).json({ success: true, message: 'Registration successful. Verification email sent', token: token });
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
});
  
  router.get('/verify-email/:token', async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    try {
      const token = req.params.token;
  
      // Verifikasi token
      const decoded = jwt.verify(token, process.env.secret);
  
      // Lakukan tindakan yang sesuai jika verifikasi berhasil
      const userId = decoded.userId;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Setel status verifikasi akun pengguna
      user.isVerified = true;
      await user.save();
  
      res.send('Email verification successful');
    } catch (error) {
      // Tangani kesalahan verifikasi token
      res.status(400).json({ success: false, error: 'Invalid verification token' });
    }
  });
  
  router.post('/send-verification-email', async (req, res) => {
    try {
      const { email } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      const verificationToken = jwt.sign({ userId: user._id }, process.env.secret, { expiresIn: '1d' });
      const verificationLink = `http://localhost:3001/verify-email/${verificationToken}`;
  
      const mailOptions = {
        from: 'dulzfaker@gmail.com',
        to: user.email,
        subject: 'Email Verification',
        text: `Click the following link to verify your email: ${verificationLink}`,
      };
  
      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).json({ success: false, error: error.message });
        } else {
          console.log('Email terkirim: ' + info.response);
          res.status(200).json({ success: true, message: 'Verification email sent' });
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'The user is deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/get/count', async (req, res) => {
  try {
    const userCount = await User.countDocuments();

    res.send({ userCount: userCount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;