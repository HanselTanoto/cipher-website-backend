
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
        for (let i = 0; i < plaintext.length; i++) {
            let char = plaintext.charAt(i);
            let charCode = char.charCodeAt(0);
            let keyCharCode = key.charAt(i % key.length).charCodeAt(0);
            let cipherCharCode = (charCode + keyCharCode) % 128;
            ciphertext += String.fromCharCode(cipherCharCode);
        }

        return res.status(200).send({
            'cipher': ciphertext
        });
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
        for (let i = 0; i < ciphertext.length; i++) {
            let char = ciphertext.charAt(i);
            let charCode = char.charCodeAt(0);
            let keyCharCode = key.charAt(i % key.length).charCodeAt(0);
            let plainCharCode = (charCode - keyCharCode + 128) % 128;
            plaintext += String.fromCharCode(plainCharCode);
        }

        return res.status(200).send({
            'plaintext': plaintext
        });
    }
    
};