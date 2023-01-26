module.exports = {
    parseInput(req,res,next){
        // req.body.textUpload, req.body.fileUpload
        req.isFileUsed = false
        if(req.body.textUpload){
            req.text = req.body.textUpload
            console.log(req.text)
            next()
        }else if(req.file){
            req.text = req.file.buffer.toString()
            req.isFileUsed = true
            req.fileName = req.file.originalname
            console.log(req.text)
            next()
        }else{
            return res.status(400).send({
                "err" : "No input text/file found"
            })
        }
    }
}