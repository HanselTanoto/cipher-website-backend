const MatrixInverse = require('matrix-inverse');

module.exports = {
    encrypt: (req, res) => {
        let keySize = req.body.keySize;
        let key = req.body.key;
        let plaintext = req.text;

        if (!keySize || !key) {
            return res.status(400).send({
                'err': 'Missing key'
            });
        }

        plaintext = plaintext.replace(/[^a-zA-Z]/g, '');
        plaintext = plaintext.toLowerCase();

        let ciphertext = '';

        let plaintextNum = [];
        for (let i = 0; i < plaintext.length; i++) {
            plaintextNum.push(plaintext.charCodeAt(i) - 'a'.charCodeAt(0));
        }

        let keyMatrixNum = [];
        for (let i = 0; i < keySize; i++) {
            keyMatrixNum.push([]);
            for (let j = 0; j < keySize; j++) {
                keyMatrixNum[i].push(parseInt(key[i][j]));
            }
        }

        for (let i = 0; i < plaintextNum.length; i += keySize) {
            let temp = [];
            for (let j = 0; j < keySize; j++) {
                let sum = 0;
                for (let k = 0; k < keySize; k++) {
                    sum += keyMatrixNum[j][k] * plaintextNum[i + k];
                }
                temp.push(sum % 26);
            }
            for (let j = 0; j < keySize; j++) {
                ciphertext += String.fromCharCode(temp[j] + 'a'.charCodeAt(0));
            }
        }

        return res.status(200).send({
            'cipher': ciphertext
        });
    },

    decrypt: (req, res) => {
        let keySize = req.body.keySize;
        let key = req.body.key;
        let ciphertext = req.text;
        
        if (!keySize || !key) {
            return res.status(400).send({
                'err': 'Missing key'
            });
        }

        ciphertext = ciphertext.replace(/[^a-zA-Z]/g, '');
        ciphertext = ciphertext.toLowerCase();

        let plaintext = '';

        let ciphertextNum = [];
        for (let i = 0; i < ciphertext.length; i++) {
            ciphertextNum.push(ciphertext.charCodeAt(i) - 'a'.charCodeAt(0));
        }

        let keyMatrixNum = [];
        for (let i = 0; i < keySize; i++) {
            keyMatrixNum.push([]);
            for (let j = 0; j < keySize; j++) {
                keyMatrixNum[i].push(parseInt(key[i][j]));
            }
        }

        let keyMatrixInverse = MatrixInverse(keyMatrixNum);

        for (let i = 0; i < ciphertextNum.length; i += keySize) {
            let temp = [];
            for (let j = 0; j < keySize; j++) {
                let sum = 0;
                for (let k = 0; k < keySize; k++) {
                    sum += keyMatrixInverse[j][k] * ciphertextNum[i + k];
                }
                temp.push(sum % 26);
            }
            for (let j = 0; j < keySize; j++) {
                plaintext += String.fromCharCode(temp[j] + 'a'.charCodeAt(0));
            }
        }

        return res.status(200).send({
            'plain': plaintext
        });
    }   
}
