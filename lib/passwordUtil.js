const bcrypt = require('bcrypt');

async function genPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
}

async function validPassword(password, hashedPassword) {
    const verification = await bcrypt.compare(password, hashedPassword)
    return verification
}

module.exports.validPassword = validPassword
module.exports.genPassword = genPassword