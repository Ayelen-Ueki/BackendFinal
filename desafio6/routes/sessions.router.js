const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');
const router = express.Router();

// Session middleware
router.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: false
}));

// Inicializacion de passport
router.use(passport.initialize());
router.use(passport.session());

// Github Strategy
passport.use(new GitHubStrategy({
    clientID: 'Iv1.46ba0dbadbfd1c93',
    clientSecret: 'Y0bae53b354208e4fb6fe1f80a4801d4b692b6d56',
    callbackURL: 'http://localhost:3000/api/sessions/callback/Github'
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

// Serializacion y desereializacion del user
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Ruta para inicializar el proceso de autenticacion del usuario
router.get('/', passport.authenticate('github', {}), (req, res) => {
});

router.get('/callbackGithub', passport.authenticate('github', {}), (req, res) => {
    req.session.usuario = req.user;
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ payload: req.user });
});

module.exports = router;

