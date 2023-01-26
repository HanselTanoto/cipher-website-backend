const { gcd } = require('../utils/modulo')
const MathLib = require('../utils/modulo')
const { decrypt } = require('./autoKeyVigenere')

module.exports = {
    encrypt(req,res){
        let keym = req.body.keym
        let keyn = 128
        let keyb = req.body.keyb
        req.text = req.text.replace(/[^\x00-\x7F]/g, '')

        if(!keym || !keyb){
            return res.status(400).send({
                'err' : 'All key must be provided'
            })
        }

        if(MathLib.gcd(keyn,keym) != 1){
            return res.status(400).send({
                'err' : 'Key must be relatively prime'
            })
        }

        let cipher = ''

        for(let i=0;i<req.text.length;i++){
            let num = keym * req.text.charCodeAt(i) + parseInt(keyb)
            num %= keyn
            cipher += String.fromCharCode(num)
        }

        return res.status(200).send({
            'cipher' : cipher
        })
    },

    decrypt(req,res){
        let keym = req.body.keym
        let keyn = 128
        let keyb = req.body.keyb
        req.text = req.text.replace(/[^\x00-\x7F]/g, '')

        if(!keym || !keyb){
            return res.status(400).send({
                'err' : 'All key must be provided'
            })
        }

        if(MathLib.gcd(keyn,keym) != 1){
            return res.status(400).send({
                'err' : 'Key must be relatively prime'
            })
        }

        let plaintext = ''
        let inv = MathLib.invMod(keym,keyn)

        for(let i=0;i<req.text.length;i++){
            let idx = (req.text.charCodeAt(i) - keyb) * inv
            idx %= keyn
            idx += keyn
            idx %= keyn
            plaintext += String.fromCharCode(idx)
        }

        return res.status(200).send({
            'plaintext' : plaintext
        })
    }
}