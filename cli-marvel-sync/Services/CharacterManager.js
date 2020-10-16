'use strict';

const axios = require('axios');
const md5 = require('md5');
const CharacterRepository = require('../DataAccess/CharacterRepository');
const characterRepository = new CharacterRepository();
const ITEMS_PER_PAGE = 100;

class CharacterManager {    

    async synchronizeCharacters() {

        let synchronizedTotal = 0;
        let currentPage = 1;
        let endPage = 1;

        do {
            let timeStamp = Date.now();

            let response = await axios.get(process.env.MARVEL_API_CHARACTERS_ENDPOINT, {
                params: {
                    apikey: process.env.MARVEL_API_PUBLIC_KEY,
                    ts: timeStamp,
                    hash: md5(timeStamp + process.env.MARVEL_API_PRIVATE_KEY + process.env.MARVEL_API_PUBLIC_KEY),
                    orderBy: 'name',
                    offset: (currentPage - 1) * ITEMS_PER_PAGE,
                    limit: ITEMS_PER_PAGE,
                }
            });

            let characterDataWrapper = response.data;
            let characterDataContainer = characterDataWrapper.data;

            await characterRepository.bulkUpsert(characterDataContainer.results);

            synchronizedTotal += characterDataContainer.count;
            console.log(`Synchronized ${synchronizedTotal} characters.`);

            // recomputing in case the source changes
            endPage = Math.ceil(characterDataContainer.total / ITEMS_PER_PAGE);

        } while (++currentPage <= endPage);

        return synchronizedTotal;
    }

}

module.exports = CharacterManager;