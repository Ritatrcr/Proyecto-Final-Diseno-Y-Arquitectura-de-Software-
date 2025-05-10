const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { db } = require('../firebase');
const router = express.Router();


router.post(
  '/',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
    body('username').notEmpty().withMessage('Username is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // Consulta en Firestore para verificar si el email ya existe
      const usersRef = db.collection('users');
      const querySnapshot = await usersRef.where('email', '==', email).get();

      if (!querySnapshot.empty) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        username,
        email,
        password: hashedPassword
      };

      // Agregar el nuevo usuario a Firestore
      const newUserRef = await usersRef.add(newUser);

      // Generar token con los datos del usuario
      const token = jwt.sign(
        { id: newUserRef.id, username, email },
        process.env.JWT_SECRET,
        { expiresIn: '3h' }
      );

      res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error registering user', error });
    }
  }
);

module.exports = router;
