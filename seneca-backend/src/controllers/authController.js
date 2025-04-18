const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendVerificationEmail } = require('../utils/sendEmail');
require('dotenv').config();

//REGISTRO ****************************************************************
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, address, birthdate } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: 'El usuario ya está registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = jwt.sign(
      { email, rand: Math.random() },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    console.log('TOKEN CREADO:', verificationToken);

    const user = await User.create({
      firstName,
      lastName,
      address,
      birthdate,
      email,
      password: hashedPassword,
      verificationToken,
    });

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: 'Usuario registrado. Por favor verifica tu correo electrónico.' });

  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({
      message: 'Error en el servidor',
      error: error.message || error
    });
  }
};

//VERIFICACIÓN ************************************************************
const verifyAccount = async (req, res) => {
  const { token } = req.body;

  console.log('TOKEN RECIBIDO:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);

    const user = await User.findOne({ where: { verificationToken: token } });

    if (!user) {
      console.log('No se encontró usuario con ese token en la base de datos');
      return res.status(404).json({ message: 'Usuario no encontrado o token inválido.' });
    }

    console.log('Usuario encontrado:', user.email);

    if (user.verified) {
      return res.status(200).json({ message: 'La cuenta ya estaba verificada.' });
    }

    user.verified = true;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({ message: 'Cuenta verificada correctamente.' });

  } catch (err) {
    console.error('Error al verificar token:', err);
    return res.status(400).json({ message: 'Token inválido o expirado.' });
  }
};

// LOGIN ******************************************************************
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (!user.verified) {
      return res.status(401).json({ message: 'La cuenta no ha sido verificada' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    //Último login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login exitoso', token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

//OLVIDÓ CONTRASEÑA *******************************************************
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Correo no encontrado' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendVerificationEmail(
      email,
      token,
      'Recupera tu contraseña',
      `
        <h2>Recuperación de contraseña</h2>
        <p>Haz clic en el siguiente enlace para cambiar tu contraseña:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>Este enlace expirará en 15 minutos.</p>
      `
    );

    res.status(200).json({ message: 'Correo de recuperación enviado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

//CAMBIO DE CONTRASEÑA ****************************************************
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    console.log('TOKEN GUARDADO:', user?.resetToken);
    console.log('TOKEN RECIBIDO:', token);
    console.log('Coinciden:', user?.resetToken === token);

    if (!user || user.resetToken !== token || new Date(user.resetTokenExpiry) < new Date()) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();
    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(400).json({ message: 'Token inválido o expirado' });
  }
};

//ACTUALIZACIÓN DE PERFIL *************************************************
const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, address, birthdate } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    user.firstName = firstName;
    user.lastName = lastName;
    user.address = address;
    user.birthdate = birthdate;

    await user.save();

    res.status(200).json({ message: 'Datos actualizados correctamente' });
  } catch (err) {
    console.error('Error al actualizar perfil:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

//OBTENER DATOS DEL PERFIL *************************************************
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  register,
  login,
  verifyAccount,
  requestPasswordReset,
  resetPassword,
  updateProfile,
  getUserById
};
