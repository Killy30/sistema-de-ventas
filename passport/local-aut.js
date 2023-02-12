
const passport = require('passport');
const LocalStatregy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
     const user = await User.findById(id);
     done(null, user)
});
passport.use('local-signup', new LocalStatregy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = await User.findOne({email: email})
    if(user) {
        return done(null, false, req.flash('signupMessage', 'Este Email ya existe en nuestra base de datos, por favor prueba otro.'));
    }else{
        const newUser = new User();
        newUser.name = req.body.name;
        newUser.lastName = req.body.lastName
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);

        await newUser.save();
        done(null, newUser);
    };

}));

passport.use('local-login', new LocalStatregy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done) => {
    const user = await User.findOne({email: email});

    if(!user){
        return done(null, false, req.flash('signinMessage', 'Usuario no encontrado'))
    }
    if(!user.comparePassword(password)){
        return done(null, false, req.flash('signinMessage', 'Contraseña incorrecta'))
    }
    done(null, user)
}))