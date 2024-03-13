const router = require("./views.routes");
const bcrypt = require("bcrypt");

let users = [];

// Para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    try {
        const newUser = req.body;
        newUser.id = Math.random();

        // Para encriptar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        newUser.password = hashedPassword;

        // Asignar el rol de admin a determinado usuario
        if (newUser.useremail === 'adminCoder@coder.com' && newUser.password === 'Cod3r123') {
            newUser.role = 'admin';
        } else {
            newUser.role = 'usuario';
        }

        users.push(newUser);
        res.redirect('/views/login-view');
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).send("Error en el registro");
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { useremail, password } = req.body;
        const userFound = users.find(user => user.useremail === useremail);

        if (!userFound) {
            return res.status(404).send("Usuario no encontrado");
        }

        // Comparar las contraseñas
        const passwordMatch = await bcrypt.compare(password, userFound.password);
        if (passwordMatch) {
            req.session.user = useremail;
            req.session.role = userFound.role;
            res.redirect('/home/allProducts');
        } else {
            res.status(401).send("Contraseña incorrecta");
        }
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).send("Error en login:");
    }
});

// Logout
router.get('/logout', (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/views/login-view');
    } catch (error) {
        console.error("Error en logout:", error);
        res.status(500).send("Error en logut");
    }
});


router.get('/user', (req, res) => {
    res.send(users);
});

module.exports = router;
