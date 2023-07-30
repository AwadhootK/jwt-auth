const {
  signupGet,
  signupPost,
  loginGet,
  loginPost,
  logoutGet
} = require('../controllers/authControllers.js')

const Router = require('express').Router

const router = Router()

router.get('/signup', signupGet)
router.get('/login', loginGet)
router.post('/signup', signupPost)
router.post('/login', loginPost) 
router.get('/logout', logoutGet)

module.exports = router