const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user.
 *         name:
 *           type: string
 *           description: The name of the user.
 *         email:
 *           type: string
 *           description: The email address of the user.
 *         phone:
 *           type: string
 *           description: The phone number of the user.
 *         isAdmin:
 *           type: boolean
 *           description: Whether the user is an admin or not.
 *         street:
 *           type: string
 *           description: The street address of the user.
 *         apartment:
 *           type: string
 *           description: The apartment number of the user.
 *         zip:
 *           type: string
 *           description: The ZIP code of the user's address.
 *         city:
 *           type: string
 *           description: The city of the user's address.
 *         country:
 *           type: string
 *           description: The country of the user's address.
 *         isVerified:
 *           type: boolean
 *           description: Whether the user's email is verified or not.
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get a list of all users.
 *     responses:
 *       '200':
 *         description: Successful operation. Returns a list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 *   post:
 *     tags: [Users]
 *     summary: Create a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the newly created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to get.
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 *   put:
 *     tags: [Users]
 *     summary: Update a user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the updated user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to delete.
 *     responses:
 *       '200':
 *         description: Successful operation. Returns a success message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful or not.
 *                 message:
 *                   type: string
 *                   description: A message describing the result of the operation.

 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags: [Users]
 *     summary: Login user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 description: User's password.
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Successful operation. Returns user's email and token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                   description: User's email address.
 *                 token:
 *                   type: string
 *                   description: JWT token for user authentication.
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name.
 *               email:
 *                 type: string
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 description: User's password.
 *               phone:
 *                 type: string
 *                 description: User's phone number.
 *               isAdmin:
 *                 type: boolean
 *                 description: Whether the user is an admin or not.
 *               street:
 *                 type: string
 *                 description: The street address of the user.
 *               apartment:
 *                 type: string
 *                 description: The apartment number of the user.
 *               zip:
 *                 type: string
 *                 description: The ZIP code of the user's address.
 *               city:
 *                 type: string
 *                 description: The city of the user's address.
 *               country:
 *                 type: string
 *                 description: The country of the user's address.
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Successful operation. Returns user's email and token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                   description: User's email address.
 *                 token:
 *                   type: string
 *                   description: JWT token for user authentication.
 */

/**
 * @swagger
 * /api/users/verify-email/{token}:
 *   get:
 *     tags: [Users]
 *     summary: Verify user's email with the provided verification token.
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Verification token received via email.
 *     responses:
 *       '200':
 *         description: Successful operation. Returns a message indicating successful email verification.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indicating successful email verification.
 */

/**
 * @swagger
 * /api/users/send-verification-email:
 *   post:
 *     tags: [Users]
 *     summary: Send a verification email to the user for email verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *             required:
 *               - email
 *     responses:
 *       '200':
 *         description: Successful operation. Returns a message indicating successful email sending.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indicating successful email sending.
 */
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

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to get.
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 *   put:
 *     summary: Update a user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the updated user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 *   delete:
 *     summary: Delete a user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to delete.
 *     responses:
 *       '200':
 *         description: Successful operation. Returns a success message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful or not.
 *                 message:
 *                   type: string
 *                   description: A message describing the result of the operation.
 */

/**
 * @swagger
 * /api/users/get/count:
 *   get:
 *     tags: [Users]
 *     summary: Get the total count of users.
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the total count of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userCount:
 *                   type: number
 *                   description: The total count of users.
 */

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
        { expiresIn: '1d' }
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
        from: 'Admin Banyumas Farm Fresh',
        to: user.email,
        subject: 'Email Verification - Banyumas Farm Fresh',
        text: `
        Dear ${user.name},

        Thank you for signing up with Banyumas Farm Fresh! To complete your registration and start exploring our fresh produce, please verify your email address by clicking on the verification link below:

        Verification Link: ${verificationLink}

        Please note that the link will expire after 24 hours for security purposes. If you're unable to click the link, you can copy and paste it into your web browser's address bar.

        If you did not create an account on Banyumas Farm Fresh, please ignore this email.

        Thank you,
        Banyumas Farm Fresh Team
        `,
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
            { expiresIn: '1d' }
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
  
      const decoded = jwt.verify(token, process.env.secret);
  
      // Lakukan tindakan yang sesuai jika verifikasi berhasil
      const userId = decoded.userId;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      user.isVerified = true;
      await user.save();
  
      res.send('Email verification successful');
    } catch (error) {
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
        subject: 'Email Verification - Banyumas Farm Fresh',
        text: `
        Dear {user.email},

        Thank you for signing up with Banyumas Farm Fresh! To complete your registration and start exploring our fresh produce, please verify your email address by clicking on the verification link below:

        Verification Link: ${verificationLink}

        Please note that the link will expire after 24 hours for security purposes. If you're unable to click the link, you can copy and paste it into your web browser's address bar.

        If you did not create an account on Banyumas Farm Fresh, please ignore this email.

        Thank you,
        Banyumas Farm Fresh Team
        `,
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