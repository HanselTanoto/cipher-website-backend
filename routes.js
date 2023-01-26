const multer = require('multer')
const os = require('os')
const ParsingInput = require('./middlewares/parsingInput')
const AutoKeyVigenere = require('./controllers/autoKeyVigenere')

module.exports = (app) => {

    var storage = multer.memoryStorage();
    var upload = multer({ storage: storage });

    app.get('/',(req,res) => {
        return res.status(200).send({
            "msg" : "hello world"
        })
    })

    app.post('/autokeyvigenere/encrypt',upload.single('file'),ParsingInput.parseInput, AutoKeyVigenere.encrypt)
}