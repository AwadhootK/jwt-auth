const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes.js')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middlewares/authMiddleware.js')

const app = express()

app.use(express.static('public'))
app.use(express.json({ limit: '30mb' }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cookieParser())
app.use(cors())
app.set('view engine', 'ejs')

mongoose
  .connect(
    'mongodb+srv://awadhootk6:jnpppllfb83@cluster0.sef9qye.mongodb.net/?retryWrites=true&w=majority'
  )
  .then(() => {
    app.listen(3000)
    console.log('Server is running on port 3000')
  })
  .catch(() => {
    console.log('Error connecting to database')
  })

app.get('/ping', (req, res) => res.send('pong'))

app.get('*', checkUser)
app.get('/', requireAuth, (req, res) => res.render('home'))
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'))
app.use(authRoutes)
