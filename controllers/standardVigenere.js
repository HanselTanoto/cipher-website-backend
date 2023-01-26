
module.exports = {
    encrypt: (req, res) => {
        let key = req.body.key;
        let plaintext = req.text;

        if (!key) {
            return res.status(400).send({
                'err': 'Missing key'
            });
        }

        plaintext = plaintext.replace(/[^a-zA-Z]/g, '');
        key = key.toLowerCase();
        plaintext = plaintext.toLowerCase();

        let ciphertext = '';

        for (let i = 0; i < plaintext.length; i++) {
            let char = plaintext.charAt(i);
            let charCode = char.charCodeAt(0);
            let keyCharCode = key.charAt(i % key.length).charCodeAt(0);
            let cipherCharCode = (charCode + keyCharCode - 2 * 'a'.charCodeAt(0)) % 26 + 'a'.charCodeAt(0);
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

        ciphertext = ciphertext.replace(/[^a-zA-Z]/g, '');
        key = key.toLowerCase();
        ciphertext = ciphertext.toLowerCase();

        let plaintext = '';

        for (let i = 0; i < ciphertext.length; i++) {
            let char = ciphertext.charAt(i);
            let charCode = char.charCodeAt(0);
            let keyCharCode = key.charAt(i % key.length).charCodeAt(0);
            let plainCharCode = (charCode - keyCharCode + 26) % 26 + 'a'.charCodeAt(0);
            plaintext += String.fromCharCode(plainCharCode);
        }

        return res.status(200).send({
            'plaintext': plaintext
        });
    }
}
