var router = require('express').Router();
var mongoose = require('mongoose');
var Character = mongoose.model('Character');

router.get('/', function(req, res, next) {
  var query = {};

  return Promise.all([
    Character.find(query)
      .sort({name: 'asc'})
      .exec()
  ]).then(function(results){
    var characters = results[0];

    return res.json(
      characters.map(character => character.id)
    );
  });
});

router.get('/:characterId', function(req, res, next) {
  Character.findOne({id: req.params.characterId})
    .then(function (character) {
      if (!character) { 
        return res.sendStatus(404); 
      }
      
      return res.json(character.toJSONFor());
    });
});

module.exports = router;
