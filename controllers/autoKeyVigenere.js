const sendFile = require('../utils/sendFile')

module.exports = {
    encrypt(req,res){
        console.log('encrypt')
        res.status(200).send({})
    }
}