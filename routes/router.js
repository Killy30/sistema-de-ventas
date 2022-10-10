const path = require('path')
const express = require('express')
const router = express.Router()
const passport = require('passport')

module.exports = (app) =>{

    router.get('/', (req, res) =>{
        res.render('index')
    })

    router.get('/registrar', async (req, res, next) => {
        res.render('signup')
    });
    
    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/inicio',
        failureRedirect: '/registrar',
        passReqToCallback: true
    }));
    
    router.get('/iniciar-sesion', (req, res, next) => {
        res.render('login')
    });
    
    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/inicio',
        failureRedirect: '/iniciar-sesion',
        passReqToCallback: true
    }));


    router.get('/inicio', isAuthenticated, (req,res)=>{
        const user = req.user
        res.render('main', {user})
    })
    
    app.get('/productos', isAuthenticated, (req, res)=>{
        const user = req.user
        res.render('products', {user})
    })
    
    app.get('/ventas', isAuthenticated, (req, res)=>{
        const user = req.user
        res.render('sales', {user})
    })

    app.get('/analisis-de-ventas', isAuthenticated, (req, res)=>{
        const user = req.user
        res.render('analysis', {user})
    })

    router.get('/configuracion', isAuthenticated, (req, res) =>{
        const user = req.user
        res.render('config', {user})
    })
    
    app.get('/factura/:id', isAuthenticated, async(req, res)=>{
        const user = req.user
        // const sale = await Sale.findById({_id: req.params.id})
        res.render('factura', {user})
    })

    app.get('/logout', (req, res, next) => {
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/iniciar-sesion');
        })
    })
    
    function isAuthenticated(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect('/iniciar-sesion')
    }    

    app.use(router)
}