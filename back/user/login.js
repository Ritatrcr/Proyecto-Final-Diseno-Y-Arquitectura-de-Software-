const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../firebase');

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Consulta en Firestore para obtener el usuario por email
    const usersRef = db.collection('users');
    const querySnapshot = await usersRef.where('email', '==', email).get();

    if (querySnapshot.empty) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Suponiendo que el email es único y obtenemos el primer documento
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Verificar la contraseña usando bcrypt
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generar token con los datos del usuario (ajusta el payload según los campos que tengas)
    const token = jwt.sign(
      { id: userDoc.id, username: userData.username, email: userData.email },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

module.exports = router;
