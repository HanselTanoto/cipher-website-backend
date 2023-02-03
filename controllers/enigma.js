const CharLib = require('../utils/char');
const { decrypt } = require('./hill');

module.exports = {
    encrypt(req,res){
        let key = req.body.key.replace(/[^a-zA-Z]/g, '');
        let text = req.text.replace(/[^a-zA-Z]/g, '');

        if(key.length != 3){
            return res.status(400).send({
                'err': 'Key length must be 3'
            })
        }

        let offset = [CharLib.toNum(key[0]),CharLib.toNum(key[1]),CharLib.toNum(key[2])]
        for(let i=0;i<3;i++){
            offset[i] %= 26
        }
        var cur = 0

        let cipher = ''
        for(let i=0;i<text.length;i++){
            let num1 = CharLib.toNum(text[i]) + offset[0]
            num1 %= 26
            let num2 = num1 + offset[1]
            num2 %= 26
            let num3 = num2 + offset[2]
            num3 %= 26
            console.log(num3)
            cipher += CharLib.toChr(num3)
            console.log(i,num1,num2,num3)
            cur+=1
            offset[2]-=1
            if(cur % 26 == 0){
                offset[1] -= 1
            }
            if(cur % (26*26) == 0){
                offset[0] -= 1
            }
            for(let j=0;j<3;j++){
                offset[j] = ((offset[j]%26)+26)%26
            }
        }
        return res.status(200).send({
            'cipher':cipher
        })
    },
    decrypt(req,res){
        let key = req.body.key.replace(/[^a-zA-Z]/g, '');
        let text = req.text.replace(/[^a-zA-Z]/g, '');

        if(key.length != 3){
            return res.status(400).send({
                'err': 'Key length must be 3'
            })
        }
        let n = text.length
        let offset = [(CharLib.toNum(key[0])),(CharLib.toNum(key[1])),(CharLib.toNum(key[2]))]

        let plaintext = ''
        var cur = 0
        for(let i=0;i<text.length;i++){
            let num1 = CharLib.toNum(text[i]) - offset[2]
            num1 = ((num1%26+26))%26
            let num2 = num1 - offset[1]
            num2 = ((num2%26+26))%26
            let num3 = num2 - offset[0]
            num3 = ((num3%26+26))%26
            plaintext += CharLib.toChr(num3)
            console.log(i,num1,num2,num3)
            cur+=1
            offset[2]-=1
            if(cur % 26 == 0){
                offset[1] -= 1
            }
            if(cur % (26*26) == 0){
                offset[0] -= 1
            }
            for(let j=0;j<3;j++){
                offset[j] = ((offset[j]%26)+26)%26
            }
        }
        return res.status(200).send({
            'plaintext':plaintext
        })
    }
}