
module.exports = {
    sendFile(res,txt,filename){
        res.set({"Content-Disposition":`attachment; filename=${filename}`});
        res.status(200).send(txt)
    }   
}