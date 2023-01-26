const multer = require('multer')
const os = require('os')
const ParsingInput = require('./middlewares/parsingInput')
const StandardVigenere = require('./controllers/standardVigenere')
const ExtendedVigenere = require('./controllers/extendedVigenere')
const AutoKeyVigenere = require('./controllers/autoKeyVigenere')
const Affine = require('./controllers/affine')

module.exports = (app) => {

    var storage = multer.memoryStorage();
    var upload = multer({ storage: storage });

    app.post('/standardvigenere/encrypt',upload.single('file'),ParsingInput.parseInput, StandardVigenere.encrypt)
    app.post('/standardvigenere/decrypt',upload.single('file'),ParsingInput.parseInput, StandardVigenere.decrypt)

    app.post('/autokeyvigenere/encrypt',upload.single('file'),ParsingInput.parseInput, AutoKeyVigenere.encrypt)
    app.post('/autokeyvigenere/decrypt',upload.single('file'),ParsingInput.parseInput, AutoKeyVigenere.decrypt)

    app.post('/extendedvigenere/encrypt',upload.single('file'),ParsingInput.parseInput, ExtendedVigenere.encrypt)
    app.post('/extendedvigenere/decrypt',upload.single('file'),ParsingInput.parseInput, ExtendedVigenere.decrypt)

    app.post('/affine/encrypt',upload.single('file'),ParsingInput.parseInput, Affine.encrypt)
    app.post('/affine/decrypt',upload.single('file'),ParsingInput.parseInput, Affine.decrypt)
}