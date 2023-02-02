
// vigenere cipher for all ascii characters
module.exports = {
    encrypt: (req, res) => {
        let key = req.body.key;
        let plaintext = req.text;

        if (!key) {
            return res.status(400).send({
                'err': 'Missing key'
            });
        }

        let ciphertext = '';
        let buf = []
        let n = 0
        if(req.file){
            n = req.buf.length
        }else{
            n = plaintext.length
        }
        for (let i = 0; i < n; i++) {
            let keyCharCode = key.charAt(i % key.length).charCodeAt(0);
            if(req.file){
                let num = req.buf[i]
                num += keyCharCode
                num = ((num%256)+256)%256
                buf.push(num)
            }else{
                let char = plaintext.charAt(i);
                let charCode = char.charCodeAt(0);
                let cipherCharCode = (charCode + keyCharCode) % 256;
                ciphertext += String.fromCharCode(cipherCharCode);
            }
        }
        if(req.file){
            return res.status(200).send({
                'cipher': buf
            }); 
        }else{
            return res.status(200).send({
                'cipher': ciphertext
            });
        }
    },

    decrypt: (req, res) => {
        let key = req.body.key;
        let ciphertext = req.text;

        if (!key) {
            return res.status(400).send({
                'err': 'Missing key'
            });
        }

        let plaintext = '';
        let buf = []

        if(req.file){
            n = req.buf.length
        }else{
            n = ciphertext.length
        }
        for (let i = 0; i < n; i++) {
            let keyCharCode = key.charAt(i % key.length).charCodeAt(0);
            if(req.file){
                let num = req.buf[i]
                num -= keyCharCode
                num = ((num%256)+256)%256
                buf.push(num)
            }else{
                let char = ciphertext.charAt(i);
                let charCode = char.charCodeAt(0);
                let plainCharCode = (charCode - keyCharCode + 256) % 256;
                plaintext += String.fromCharCode(plainCharCode);
            }
        }

        if(req.file){
            return res.status(200).send({
                'plaintext': buf
            }); 
        }else{
            return res.status(200).send({
                'plaintext': plaintext
            });
        }
    }
    
};