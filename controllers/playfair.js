// playfair cipher algorithm

module.exports = {
    encrypt: (req, res) => {
        let key = req.body.key;
        let plaintext = req.text;
        
        if (!key) {
            return res.status(400).send({
                'err': 'Missing key'
            });
        }
        // key must be a string of letters or spaces
        if (key.match(/[^\sA-Za-z]/)) {
            return res.status(400).send({
                'err': 'Key must contain only alphabetic characters or spaces'
            });
        }

        key = key.replace(/[^a-zA-Z]/g, '');
        plaintext = plaintext.replace(/[^a-zA-Z]/g, '');
        key = key.toLowerCase();
        plaintext = plaintext.toLowerCase();

        let ciphertext = '';

        let keyArray = [];
        for (let i = 0; i < key.length; i++) {
            let char = key.charAt(i);
            if (char == 'j') {
                continue;
            }
            if (keyArray.indexOf(char) == -1) {
                keyArray.push(char);
            }
        }

        let alphabet = 'abcdefghiklmnopqrstuvwxyz';
        for (let i = 0; i < alphabet.length; i++) {
            let char = alphabet.charAt(i);
            if (keyArray.indexOf(char) == -1) {
                keyArray.push(char);
            }
        }

        let keyMatrix = [];
        for (let i = 0; i < 5; i++) {
            keyMatrix.push([]);
            for (let j = 0; j < 5; j++) {
                keyMatrix[i].push(keyArray[i * 5 + j]);
            }
        }

        let plaintextBigrams = [];
        for (let i = 0; i < plaintext.length; i += 2) {
            let bigram = plaintext.charAt(i);
            if (bigram == 'j') {
                bigram = 'i';
            }
            if (i + 1 < plaintext.length) {
                bigram += plaintext.charAt(i + 1);
                if (bigram.charAt(1) == 'j') {
                    bigram = bigram.charAt(0) + 'i';
                }
                if (bigram.charAt(0) == bigram.charAt(1)) {
                    bigram = bigram.charAt(0) + 'x';
                    i--;
                }
            } else {
                bigram += 'x';
            }
            plaintextBigrams.push(bigram);
        }

        for (let i = 0; i < plaintextBigrams.length; i++) {
            let bigram = plaintextBigrams[i];
            let firstChar = bigram.charAt(0);
            let secondChar = bigram.charAt(1);
            let firstCharRow = 0;
            let firstCharCol = 0;
            let secondCharRow = 0;
            let secondCharCol = 0;
            for (let j = 0; j < 5; j++) {
                for (let k = 0; k < 5; k++) {
                    if (keyMatrix[j][k] == firstChar) {
                        firstCharRow = j;
                        firstCharCol = k;
                    }
                    if (keyMatrix[j][k] == secondChar) {
                        secondCharRow = j;
                        secondCharCol = k;
                    }
                }
            }
            if (firstCharRow == secondCharRow) {
                ciphertext += keyMatrix[firstCharRow][(firstCharCol + 1) % 5];
                ciphertext += keyMatrix[secondCharRow][(secondCharCol + 1) % 5];
            } else if (firstCharCol == secondCharCol) {
                ciphertext += keyMatrix[(firstCharRow + 1) % 5][firstCharCol];
                ciphertext += keyMatrix[(secondCharRow + 1) % 5][secondCharCol];
            } else {
                ciphertext += keyMatrix[firstCharRow][secondCharCol];
                ciphertext += keyMatrix[secondCharRow][firstCharCol];
            }
        }

        return res.status(200).send({
            'cipher': ciphertext,
            'keyMatrix': keyMatrix
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

        if (ciphertext.length % 2 != 0) {
            return res.status(400).send({
                'err': 'Ciphertext length must be even'
            });
        }

        key = key.replace(/[^a-zA-Z]/g, '');
        ciphertext = ciphertext.replace(/[^a-zA-Z]/g, '');
        key = key.toLowerCase();
        ciphertext = ciphertext.toLowerCase();

        let plaintext = '';

        let keyArray = [];
        for (let i = 0; i < key.length; i++) {
            let char = key.charAt(i);
            if (char == 'j') {
                continue;
            }
            if (keyArray.indexOf(char) == -1) {
                keyArray.push(char);
            }
        }

        let alphabet = 'abcdefghiklmnopqrstuvwxyz';
        for (let i = 0; i < alphabet.length; i++) {
            let char = alphabet.charAt(i);
            if (keyArray.indexOf(char) == -1) {
                keyArray.push(char);
            }
        }

        let keyMatrix = [];
        for (let i = 0; i < 5; i++) {
            keyMatrix.push([]);
            for (let j = 0; j < 5; j++) {
                keyMatrix[i].push(keyArray[i * 5 + j]);
            }
        }

        let ciphertextBigrams = [];
        for (let i = 0; i < ciphertext.length; i += 2) {
            ciphertextBigrams.push(ciphertext.charAt(i) + ciphertext.charAt(i + 1));
        }

        for (let i = 0; i < ciphertextBigrams.length; i++) {
            let bigram = ciphertextBigrams[i];
            let firstChar = bigram.charAt(0);
            let secondChar = bigram.charAt(1);
            let firstCharRow = 0;
            let firstCharCol = 0;
            let secondCharRow = 0;
            let secondCharCol = 0;
            for (let j = 0; j < 5; j++) {
                for (let k = 0; k < 5; k++) {
                    if (keyMatrix[j][k] == firstChar) {
                        firstCharRow = j;
                        firstCharCol = k;
                    }
                    if (keyMatrix[j][k] == secondChar) {
                        secondCharRow = j;
                        secondCharCol = k;
                    }
                }
            }
            if (firstCharRow == secondCharRow) {
                plaintext += keyMatrix[firstCharRow][(firstCharCol + 4) % 5];
                plaintext += keyMatrix[secondCharRow][(secondCharCol + 4) % 5];
            } else if (firstCharCol == secondCharCol) {
                plaintext += keyMatrix[(firstCharRow + 4) % 5][firstCharCol];
                plaintext += keyMatrix[(secondCharRow + 4) % 5][secondCharCol];
            } else {
                plaintext += keyMatrix[firstCharRow][secondCharCol];
                plaintext += keyMatrix[secondCharRow][firstCharCol];
            }
        }

        return res.status(200).send({
            'plaintext': plaintext,
            'keyMatrix': keyMatrix
        });
    }
}