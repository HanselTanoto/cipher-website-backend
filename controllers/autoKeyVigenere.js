const CharLib = require('../utils/char')
const { toChr } = require('../utils/char')

module.exports = {
    encrypt(req,res){
        req.text = req.text.replace(/[^a-zA-Z]/g,'')

        if(!req.body.key){
            return res.status(400).send({
                'err' : 'Missing key'
            })
        }
        
        let key = req.body.key.replace(/[^a-zA-Z]/g,'')
        req.text = req.text.toLowerCase()
        key = key.toLowerCase()

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
        req.text = req.text.replace(/[^a-zA-Z]/g,'')

        if(!req.body.key){
            return res.status(400).send({
                'err' : 'Missing key'
            })
        }

        let key = req.body.key.replace(/[^a-zA-Z]/g,'')
        let plaintext = ''

        req.text = req.text.toLowerCase()
        key = key.toLowerCase()

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