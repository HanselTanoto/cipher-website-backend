module.exports = {
    parseInput(req,res,next){
        // req.body.plainTextUpload, req.body.fileUpload
        req.isFileUsed = false
        if(req.body.plainTextUpload){
            req.plainText = req.body.plainTextUpload
            console.log(req.plainText)
            next()
        }else if(req.file){
            req.plainText = req.file.buffer.toString()
            req.isFileUsed = true
            req.fileName = req.file.originalname
            console.log(req.plainText)
            next()
        }else{
            return res.status(400).send({
                "err" : "No input text/file found"
            })
        }
    }
}