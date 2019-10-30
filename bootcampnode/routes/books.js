var express = require('express')
var Controller = require('../controller/bookController')
var router = express.Router()
var cors = require('cors')


// middleware that is specific to this router
router.use(
    cors(),
    function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/download', Controller.download)
router.get('/', Controller.findAll)
router.get('/:book_id', Controller.find)
router.post('/', Controller.add)
router.put('/:book_id', Controller.update)
router.delete('/:book_id', Controller.delete)

module.exports = router