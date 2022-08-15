const express = require('express')
const app = express()
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const connectDB = require('./config/db')
const PORT = process.env.PORT || 3000
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')

//load config
dotenv.config({ path: './config/config.env' })

//passport config
require('./config/passport')(passport)

//DB connection
connectDB()

//Morgan
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//handlebars
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: '.hbs'
}))

//render view engine
app.set('view engine', '.hbs')

// session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

app.listen(PORT, () => {
    console.log(`server running in ${process.env.NODE_ENV} mode on ${PORT}`)
})