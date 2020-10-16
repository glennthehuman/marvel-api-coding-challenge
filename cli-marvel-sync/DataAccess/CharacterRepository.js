'use strict';

const mongoose = require('mongoose');
const Character = require('./Character.js');
mongoose.Promise = global.Promise;
const connectionUrl = require('./db.js');
const connectionOptions = { useMongoClient: true };

class CharacterRepository {    

    bulkUpsert(characterResultArray) {
        
        var bulkOps = [];

        characterResultArray.forEach(characterResult => {
            let character = {
                id: characterResult.id, 
                name: characterResult.name, 
                description: characterResult.description
            };

            console.debug(character);

            let upsertDoc = {
                updateOne: {
                filter: {id: character.id},
                update: character,
                upsert: true
            }};

            bulkOps.push(upsertDoc);
        });

        return new Promise((resolve, reject) => {
            const onError = error => {
                mongoose.disconnect();
                reject(error);
            };
        
            const onConnected = () => {
                Character.bulkWrite(bulkOps)
                    .then( bulkWriteOpResult => {
                        console.log('BULK update OK.');
                        console.log(JSON.stringify(bulkWriteOpResult, null, 2));

                        mongoose.disconnect();
                        resolve();
                    })
                    .catch( err => {
                        console.log('BULK update ERROR!');
                        console.log(JSON.stringify(err, null, 2));

                        mongoose.disconnect();
                        reject(err);
                    });
            };
        
            mongoose.connect(connectionUrl, connectionOptions)
                .then(onConnected)
                .catch(onError);        
        });  

    }

}
    
module.exports = CharacterRepository;