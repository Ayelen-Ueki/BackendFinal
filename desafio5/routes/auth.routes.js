const router = require("./views.routes");

//funcion Register 
let users = [];

router.post('/register', (req, res) => {
    let newUser = req.body;
    newUser.id = Math.random();

    // Para setear el rol de admin si se cumple con la condicion requerida
    if (newUser.useremail === 'adminCoder@coder.com' && password == 'Cod3r123') {
        newUser.role = 'admin';
    } else {
        newUser.role = 'usuario';
    }

    users.push(newUser);
    res.redirect('/views/login-view');
});

router.post('/login', (req, res) => {
    let newUser = req.body;
    let userFound = users.find(user => {
        return user.useremail == newUser.useremail && user.password == newUser.password;
    });
    if (userFound) {
        req.session.user = newUser.user;
        req.session.password = newUser.password;
        req.session.role = userFound.role; // Set the role from the user found

        res.redirect('/home/allProducts');
        return;
    }
    res.send("Usuario o contraseña incorrectos");
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) res.send('Error en logout');
    });
    res.redirect('/views/login-view');
});

router.get('/user', (req, res) => {
    res.send(users);
});

module.exports = router;
