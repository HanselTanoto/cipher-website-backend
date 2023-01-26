const CharLib = require('../utils/char')
const MathLib = require('../utils/modulo')
const MatrixLib = require('../utils/matrix')
const { det } = require('../utils/matrix')
const { invMod } = require('../utils/modulo')

// Hill cipher with 3x3 matrix key
module.exports = {
    encrypt(req,res){
        let text = req.text.replace(/[^a-z]/g,'')
        let mdm = 26
        let listMat = req.body.matUpload.split(' ')
        if(listMat.length != 9){
            return res.status(400).send({
                'err' : 'Matrix key element cannot be empty'
            })
        }
        let mat = []
        for(let i=0;i<3;i++){
            mat.push([])
            for(let j=0;j<3;j++){
                let isNum = /^\d+$/.test(listMat[i*3+j]);
                if(!isNum){
                    return res.status(400).send({
                        'err': 'Matrix key can only contain number'
                    })
                }
                mat[i].push(parseInt(listMat[i*3+j]))
            }
        }
        let cipher = ''
        for(let i=0;i<text.length;i+=3){
            arr = []
            for(let j=0;j<3;j++){
                if(i+j>=text.length){
                    arr.push(25)
                }else{
                    arr.push(CharLib.toNum(text[i+j]))
                }
            }
            for(let j=0;j<3;j++){
                let num = 0
                for(let k=0;k<3;k++){
                    num += mat[j][k] * arr[k]
                }
                num %= mdm
                if(i+j<text.length){
                    cipher += CharLib.toChr(num)
                }
            }
        }

        return res.status(200).send({
            'cipher' : cipher
        })
    },
    decrypt(req,res){
        let text = req.text.replace(/[^a-z]/g,'')
        let mdm = 26
        let listMat = req.body.matUpload.split(' ')
        if(listMat.length != 9){
            return res.status(400).send({
                'err' : 'Matrix key element cannot be empty'
            })
        }
        let mat = []
        for(let i=0;i<3;i++){
            mat.push([])
            for(let j=0;j<3;j++){
                let isNum = /^\d+$/.test(listMat[i*3+j]);
                if(!isNum){
                    return res.status(400).send({
                        'err': 'Matrix key can only contain number'
                    })
                }
                mat[i].push(parseInt(listMat[i*3+j]))
            }
        }
        let detmat = MatrixLib.det(mat)
        if(detmat == 0){
            return res.status(400).send({
                'err' : 'Matrix is not invertible'
            })
        }
        detmat %= mdm
        detmat += mdm
        detmat %= mdm
        let inv = MathLib.invMod(detmat,mdm)
        if(inv == -1){
            return res.status(400).send({
                'err' : 'Matrix is not valid'
            })
        }
        let invmat = MatrixLib.invmat(mat)

        let plaintext = ''

        for(let i=0;i<text.length - (text.length % 3);i+=3){
            arr = []
            for(let j=0;j<3;j++){
                if(i+j>=text.length){
                    arr.push(26)
                }else{
                    arr.push(CharLib.toNum(text[i+j]))
                }
            }
            for(let j=0;j<3;j++){
                let num = 0
                for(let k=0;k<3;k++){
                    num += invmat[j][k] * arr[k]
                }
                num *= inv
                num %= mdm
                num += mdm
                num %= mdm
                if(i+j<text.length){
                    plaintext += CharLib.toChr(num)
                }
            }
        }
        if(text.length % 3 == 2){
            let mat2 = []
            for(let i=0;i<2;i++){
                mat2.push([])
                for(let j=0;j<2;j++){
                    mat2[i].push(mat[i][j])
                }
            }
            arr = [0,0]
            arr[0] = CharLib.toNum(text[text.length - 2])
            arr[0] -= 25 * mat[0][2]
            arr[0] %= mdm
            arr[0] += mdm
            arr[0] %= mdm
            arr[1] = CharLib.toNum(text[text.length - 1])
            arr[1] -= 25 * mat[1][2]
            arr[1] %= mdm
            arr[1] += mdm
            arr[1] %= mdm

            let detmat2 = MatrixLib.det2(mat2)
            let invmat2 = MatrixLib.invmat2(mat2)
            detmat2 %= mdm
            detmat2 += mdm
            detmat2 %= mdm
            console.log(detmat2)
            if(detmat2 == 0){
                return res.status(400).send({
                    'err' : 'Matrix 2x2 is not invertible'
                })
            }
            let inv2 = MathLib.invMod(detmat2,mdm)
            if(inv2 == -1){
                return res.status(400).send({
                    'err' : 'Matrix 2x2 is not valid'
                })
            }
            console.log(invmat2)
            for(let i=0;i<2;i++){
                let num = 0
                for(let j=0;j<2;j++){
                    num += invmat2[i][j] * arr[j]
                }
                num *= inv2
                num %= mdm
                num += mdm
                num %= mdm
                plaintext += CharLib.toChr(num)
            }
        }else if(text.length % 3 == 1){
            let k = CharLib.toNum(text[text.length - 1])
            k -= 25 * (mat[0][1] + mat[0][2])
            k %= mdm
            k += mdm
            k %= mdm
            if(invMod(mat[0][0],mdm) == -1){
                return res.status(400).send({
                    'err' : 'Matrix 1x1 is not valid'
                })
            }
            let num = k * invMod(mat[0][0],mdm)
            num %= mdm
            plaintext += CharLib.toChr(num)
        }
        return res.status(200).send({
            'plaintext' : plaintext
        })
    }
}