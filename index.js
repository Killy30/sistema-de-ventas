const express = require('express')
const path = require('path')
const engine = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

const app = express()

require('./dataBase/config')
require('./passport/local-aut');

//configs
app.set('views', path.join(__dirname, './views'))
app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.set('port', process.env.PORT || 8080)

app.use(session({
    secret: 'dido',
    resave: false,
    saveUninitialized: false
}))

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    app.locals.signupMessage   = req.flash('signupMessage');
    app.locals.signinMessage   = req.flash('signinMessage');
    next()
})

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

//routes
require('./routes/router')(app)
//apis
require('./api/apis')(app)



app.listen(app.get('port'), ()=>{
    console.log('app listening at port 8080');
})