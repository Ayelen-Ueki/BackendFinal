const bcrypt = require('bcrypt')

//Para encriptar contraseñas. La pass en este caso es 123456
const createHash = (password) => {
    return bcrypt.hashSync('123456', bcrypt.genSaltSync(10))
}

const isValidatePassword =(user, password)=>{
    return bcrypt.compareSync(password, user.password)
}
//Para poder desencriptar las pass y utilizarla en mi codigo

module.exports = {
    createHash,
    isValidatePassword
}