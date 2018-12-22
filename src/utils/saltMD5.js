const key = ''
const crypto = require('crypto')

module.exports = {

  md5AddSalt: (password) => {
    const salt = Math.floor(Math.random() * 100)
    const decipher = crypto.createHash('md5', key)
    const md5Pass = decipher.update(password + salt).digest('hex')
    return {
      salt,
      md5Pass
    }
  },

  md5: (password) => {
    const md5Pass = crypto.createHash('md5').update(password).digest('hex')
    return md5Pass
  },

  md5Salt: (password, salt) => {
    let tsalt
    if (salt == null) {
      tsalt = ''
    }
    const decipher = crypto.createHash('md5', key)
    return decipher.update(password + tsalt).digest('hex')
  }

}
