const express = require('express')
const app = express()
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
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

//body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//method override for PUT requests
app.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

//Morgan
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

//handlebars
app.engine('.hbs', exphbs.engine({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select
    },
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

//SET GLOBAL VARIABLE
app.use(function(req, res, next){
    res.locals.user = req.user || null
    next()
})

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

app.listen(PORT, () => {
    console.log(`server running in ${process.env.NODE_ENV} mode on ${PORT}`)
})