'use strict';

const yargs = require('yargs');
const CharacterManager = require('./Services/CharacterManager');
const characterManager = new CharacterManager();

const commands = yargs
    .command('sync', 'Get all characters from the official Marvel API')
    .help()
    .argv;

const command = commands._[0];

switch (command) {
    case 'sync':
        characterManager
            .synchronizeCharacters()
            .then(total => {
                if (total) {
                    console.log('A total of ' + total + ' characters have been synchronized.');
                } else {
                    console.log('There are currently no updates to synchronize.');
                }
            })
            .catch(error => console.log(error));
        break;
    default:
        console.log(`The command '${command}' is not supported`);
}
