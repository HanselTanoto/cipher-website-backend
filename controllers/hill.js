const CharLib = require('../utils/char')
const MathLib = require('../utils/modulo')
const { invMod } = require('../utils/modulo')
const  Matrix = require('node-matrices');

// Hill cipher with nxn matrix key
module.exports = {
    encrypt(req,res){
        let text = req.text.replace(/[^a-zA-Z]/g,'')
        text = text.toLowerCase()
        let mdm = 26
        let listMat = req.body.matUpload.split(' ')
        let matSize = parseInt(req.body.matSize)
        if(!matSize){
            return res.status(400).send({
                'err':'Matrix size must be specified and greater than 0'
            })
        }
        if(listMat.length != matSize * matSize){
            return res.status(400).send({
                'err' : 'Matrix key element cannot be empty'
            })
        }
        let mat = []
        for(let i=0;i<matSize;i++){
            mat.push([])
            for(let j=0;j<matSize;j++){
                let isNum = /^\d+$/.test(listMat[i*matSize+j]);
                if(!isNum){
                    return res.status(400).send({
                        'err': 'Matrix key can only contain number'
                    })
                }
                mat[i].push(parseInt(listMat[i*matSize+j]))
            }
        }
        let cipher = ''
        for(let i=0;i<text.length;i+=matSize){
            let arr = []
            for(let j=0;j<matSize;j++){
                if(i+j>=text.length){
                    arr.push(25)
                }else{
                    arr.push(CharLib.toNum(text[i+j]))
                }
            }
            for(let j=0;j<matSize;j++){
                let num = 0
                for(let k=0;k<matSize;k++){
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
        let matSize = parseInt(req.body.matSize)
        if(!matSize){
            return res.status(400).send({
                'err':'Matrix size must be specified and greater than 0'
            }) 
        }
        if(listMat.length != matSize * matSize){
            return res.status(400).send({
                'err' : 'Matrix key element cannot be empty'
            })
        }
        let mat = []
        for(let i=0;i<matSize;i++){
            mat.push([])
            for(let j=0;j<matSize;j++){
                let isNum = /^\d+$/.test(listMat[i*matSize+j]);
                if(!isNum){
                    return res.status(400).send({
                        'err': 'Matrix key can only contain number'
                    })
                }
                mat[i].push(parseInt(listMat[i*matSize+j]))
            }
        }
        let matrix = new Matrix(mat)
        let adj = matrix.adjugate()
        let det = matrix.determinant();
        det %= mdm
        det = (det + mdm) % 26
        
        if(MathLib.gcd(det,mdm) != 1){
            return res.status(400).send({
                'err': `Matrix determinant(${det}) is not relatively prime with modulo`
            })
        }

        let invdet = MathLib.invMod(det,mdm)
        adj = adj.scale(invdet)

        
        let plaintext = ''

        for(let i=0;i<text.length-(text.length % matSize);i+=matSize){
            let arr = [];
            for(let j=0;j<matSize;j++){
                arr.push([CharLib.toNum(text[i+j])])
            }
            let arrmat = new Matrix(arr)
            let ret = adj.multiply(arrmat)
            for(let j=0;j<matSize;j++){
                let num = ret.get(j,0)
                num = ((num%mdm)+mdm)%mdm
                plaintext += CharLib.toChr(num)
            }
        }
        if(text.length % matSize != 0){
            let arr = []
            let st = text.length - (text.length % matSize)
            for(let i=0;i<text.length%matSize;i++){
                arr.push([CharLib.toNum(text[st + i])])
                for(let j=text.length%matSize;j<matSize;j++){
                    arr[i][0] -= 25 * mat[i][j]
                }
                arr[i][0] = ((arr[i][0]%mdm)+mdm)%mdm
            }
            let matsmall = []
            for(let i=0;i<text.length%matSize;i++){
                matsmall.push([])
                for(let j=0;j<text.length%matSize;j++){
                    matsmall[i].push(mat[i][j])
                }
            }
            if(text.length % matSize == 1){
                if(MathLib.gcd(mat[0][0],arr[0][0]) != 1){
                    return res.status(400).send({
                        'err': `Matrix 1x1 determinant(${mat[0][0]}) is not relatively prime with modulo`
                    })
                }
                let num = MathLib.invMod(mat[0][0],26) * arr[0][0]
                num = ((num%mdm)+mdm)%mdm
                plaintext += CharLib.toChr(num)
                return res.status(200).send({
                    'plaintext' : plaintext
                })
            }

            let matrixsmall = new Matrix(matsmall)
            let adjsmall = matrixsmall.adjugate()
            let det = matrixsmall.determinant()
            det = ((det%mdm)+mdm)%mdm

            if(MathLib.gcd(det,mdm) != 1){
                return res.status(400).send({
                    'err': `Matrix ${text.length % matSize}x${text.length % matSize} determinant(${det}) is not relatively prime with modulo`
                })
            }


            let invdet = MathLib.invMod(det,mdm)
            adjsmall = adjsmall.scale(invdet)
            let ret = adjsmall.multiply(new Matrix(arr))

            for(let i=0;i<text.length%matSize;i++){
                let num = ret.get(i,0)
                num = ((num%mdm)+mdm)%mdm
                console.log(num)
                plaintext += CharLib.toChr(num)
            }
        }

        return res.status(200).send({
            'plaintext' : plaintext
        })
    }
}