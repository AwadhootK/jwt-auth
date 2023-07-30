const e = require('express')
const User = require('../models/User.js')
const jwt = require('jsonwebtoken')

// error handler function
const evaluateErrors = err => {
  let errors = { email: '', password: '' }

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'This email has not been registered'
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'The password entered is incorrect'
  }

  // duplicate error code
  if (err.code === 11000) {
    errors.email = 'This email has already been registered!'
    return errors
  }

  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message
    })
  }
  return errors
}

const MAX_AGE = 3 * 24 * 60 * 60

const createToken = id => {
  return jwt.sign({ id }, "awadhoot khutwad's secret string token", {
    expiresIn: MAX_AGE
  })
}

module.exports.signupGet = (req, res) => {
  res.render('signup')
}
module.exports.loginGet = (req, res) => {
  res.render('login')
}
module.exports.signupPost = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.create({ email, password })
    // create a JWT
    const token = createToken(user._id)
    // store it in a cookie
    res.cookie('jwt', token, { httpOnly: true, maxAge: MAX_AGE * 1000 })
    res.status(201).send({ user: user._id })
  } catch (err) {
    res.status(400).json({ errors: evaluateErrors(err) })
  }
}
module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.login(email, password)
    const token = createToken(user._id)
    // store it in a cookie
    res.cookie('jwt', token, { httpOnly: true, maxAge: MAX_AGE * 1000 })
    res.status(200).send({ user: user._id })
  } catch (error) {
    const errors = evaluateErrors(error)
    res.status(400).send({ errors })
  }
}

module.exports.logoutGet = (req, res) => {
  // we cant delete a cookie, but we will just replace it with '' and set its expiration date to a very small time
  res.cookie('jwt', '', { maxAge: 1 })
  res.redirect('/')
}
