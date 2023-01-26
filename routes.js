const multer = require('multer')
const os = require('os')
const ParsingInput = require('./middlewares/parsingInput')
const AutoKeyVigenere = require('./controllers/autoKeyVigenere')
const Affine = require('./controllers/affine')

module.exports = (app) => {

    var storage = multer.memoryStorage();
    var upload = multer({ storage: storage });

    app.post('/autokeyvigenere/encrypt',upload.single('file'),ParsingInput.parseInput, AutoKeyVigenere.encrypt)
    app.post('/autokeyvigenere/decrypt',upload.single('file'),ParsingInput.parseInput, AutoKeyVigenere.decrypt)

    app.post('/affine/encrypt',upload.single('file'),ParsingInput.parseInput, Affine.encrypt)
    app.post('/affine/decrypt',upload.single('file'),ParsingInput.parseInput, Affine.decrypt)
}