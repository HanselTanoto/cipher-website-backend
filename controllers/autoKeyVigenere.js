const SendFile = require('../utils/sendFile')
const CharLib = require('../utils/char')
const { toChr } = require('../utils/char')

module.exports = {
    encrypt(req,res){
        req.text = req.text.replace(/[^a-z]/g,'')

        if(!req.body.key){
            return res.status(400).send({
                'err' : 'Missing key'
            })
        }

        let key = req.body.key
        for(let i=0;i<req.text.length-req.body.key.length;i++){
            key+=req.text[i]
        }
        let cipher = ''
        for(let i=0;i<req.text.length;i++){
            let idx = CharLib.toNum(req.text[i]) + CharLib.toNum(key[i])
            idx %= 26
            cipher += CharLib.toChr(idx)
        }
        return res.status(200).send({
            'cipher' : cipher
        })
    },

    decrypt(req,res){
        req.text = req.text.replace(/[^a-z]/g,'')

        if(!req.body.key){
            return res.status(400).send({
                'err' : 'Missing key'
            })
        }

        let key = req.body.key
        let plaintext = ''

        for(let i=0;i<req.text.length;i++){
            let idx = CharLib.toNum(req.text[i]) - CharLib.toNum(key[i])
            idx += 26
            idx %= 26
            plaintext += CharLib.toChr(idx)
            key += CharLib.toChr(idx)
        }

        return res.status(200).send({
            'plaintext' : plaintext
        })
    }
}