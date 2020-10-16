var mongoose = require('mongoose');

var CharacterSchema = new mongoose.Schema({
  id: {type: Number, unique: true},
  name: String,
  description: String
}, {timestamps: true});

CharacterSchema.methods.toJSONFor = function(){
  return {
    id: this.id,
    name: this.name,
    description: this.description
  };
};

mongoose.model('Character', CharacterSchema);
