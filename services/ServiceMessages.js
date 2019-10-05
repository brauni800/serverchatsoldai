const fetch = require('node-fetch');
const constants = require('./constants');

const pokemon = constants.pokemon;
const questions = constants.questions;

/**
 * 
 * @param {Number} pokemonCode 
 * @param {Number} question 
 * @param {String} message 
 * @returns {Promise}
 */
const searchPokeAPI = (pokemonCode, question, message) => {
  const searchPokemon = pokedexID => {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${pokedexID}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(value => value);
  }
  let pokemonFound;
  switch (pokemonCode) {
    case pokemon.BULBASAUR: pokemonFound = searchPokemon(1); break;
    case pokemon.IVYSAUR: pokemonFound = searchPokemon(2); break;
    case pokemon.VENASAUR: pokemonFound = searchPokemon(3); break;
    case pokemon.CHARMANDER: pokemonFound = searchPokemon(4); break;
    case pokemon.CHARMELEON: pokemonFound = searchPokemon(5); break;
    case pokemon.CHARIZARD: pokemonFound = searchPokemon(6); break;
    case pokemon.SQUIRTLE: pokemonFound = searchPokemon(7); break;
    case pokemon.WARTORTLE: pokemonFound = searchPokemon(8); break;
    case pokemon.BLASTOISE: pokemonFound = searchPokemon(9); break;
    case pokemon.CATERPIE: pokemonFound = searchPokemon(10); break;
    default: return null;
  }
  switch (question) {
    case questions.ABILITY:
      return pokemonFound.then(pokemon => `${message.replace(':ABILITIES:', pokemon.abilities.map(ability => ability.ability.name))}`);
    case questions.STATS:
      return pokemonFound.then(pokemon => `${message.replace(':STATS:', pokemon.stats.map(stat => `${stat.stat.name}:${stat.base_stat}`))}`);
    case questions.MOVES:
      return pokemonFound.then(pokemon => `${message.replace(':MOVES:', pokemon.moves.map(move => move.move.name))}`);
    case questions.WEIGTH:
      return pokemonFound.then(pokemon => `${message.replace(':WEIGTH:', pokemon.weight)}`);
    case questions.HEIGHT:
      return pokemonFound.then(pokemon => `${message.replace(':HEIGHT:', pokemon.height)}`);
    case questions.TYPES:
      return pokemonFound.then(pokemon => `${message.replace(':TYPES:', pokemon.types.map(type => type.type.name))}`);
    default: return null;
  }
}

class ServiceMessages {
  /**
   * @param {String} message 
   * @returns {Promise}
   */
  getMessage(message) {
    return fetch(`https://beta.soldai.com/bill-cipher/askquestion?session_id=123456789&key=4d5c3fdce7d492a13b6e9968c94c69fe755e82cb&log=1&question=${message.trim().replace(/ /g, '%20')}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(value => {
        if (value.current_response.messages.length === 1) {
          return searchPokeAPI(value.current_response.messages[0].entity, value.current_response.intent_info.id, value.current_response.message)
            .then(pokeApiResponse => pokeApiResponse);
        }
        if (value.current_response.messages.length > 1) {
          return new Promise((resolve, reject) => {
            let promises = value.current_response.messages.map(msg => {
              return searchPokeAPI(msg.entity, value.current_response.intent_info.id, msg.text)
                .then(pokeApiResponse => pokeApiResponse);
            });
            Promise.all(promises).then(values => {
              let responseMessage = '';
              for (let i = 0; i < values.length; i++) {
                if (i < values.length-2) {
                  responseMessage += `${values[i]}, `;
                } else if (i < values.length-1) {
                  responseMessage += `${values[i]} y `;
                } else {
                  responseMessage += `${values[i]}.`;
                }
              }
              resolve(responseMessage);
            }).catch(e => reject(e));
          });
        } else {
          return value.current_response.message.replace('<br>', '');
        }
      }).catch(e => console.error(e));
  }
}

module.exports = ServiceMessages;