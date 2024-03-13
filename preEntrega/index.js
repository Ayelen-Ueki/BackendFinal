import { Express } from "express";
import routerProd from './routes.js';
import routerCart from './cartRoutes.js';
import path from 'path'
import {__dirname} from './paths.js ';


const PORT = 8000
const app = express()
// Para que express reconozca handlebars
const handlebars = require('express-handlebars')

app.use('/api/carts', routerCart)
app.use('/api/products', routerProd)
// __dirname se utiliza para indicar el nombre de la ruta sin tener que especificar el path por si el mismo cambia en el futuro
app.use('/static', express.static(path.join(__dirname, '/public')))
//Para inicializar handlebars dentro de mi aplicacion
app.engine('handlebars', handlebars.engine())
//Para que express reconozca la carpeta views
app.set('views', __dirname, '/views')

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

