import instance from '@/api/apiInstance'

/*
https://github.com/joshmiller17/vennt-server#create-an-account
*/
const signup = (username, password) => {
  // For some reason, I need to build this JSON by hand ¯\_(ツ)_/¯
  const postBody = '{"register":"' + username + '","password":"' + password + '"}'
  return instance
    .post('/', postBody)
    .then(response => {
      return response.data
    })
}

/*
https://github.com/joshmiller17/vennt-server#login
*/
const login = (username, password) => {
  // For some reason, I need to build this JSON by hand ¯\_(ツ)_/¯
  const postBody = '{"login":"' + username + '","password":"' + password + '"}'
  return instance
    .post('/', postBody)
    .then(response => {
      return response.data
    })
}

/*
https://github.com/joshmiller17/vennt-server#logout
*/
const logout = auth => {
  return instance
    .get('/logout', {
      params: {
        q: {
          auth_token: auth
        }
      }
    })
    .then(response => {
      return response.data
    })
}

/*
https://github.com/joshmiller17/vennt-server#create-a-character
*/
const createCharacter = (auth, character) => {
  return instance
    .get('/create_character', {
      params: {
        auth_token: auth,
        name: character.name,
        AGI: character.agi,
        CHA: character.cha,
        DEX: character.dex,
        INT: character.int,
        PER: character.per,
        SPI: character.spi,
        STR: character.str,
        TEK: character.tek,
        WIS: character.wis,
        HP: character.hp,
        MAX_HP: character.maxHp,
        VIM: character.vim,
        MAX_VIM: character.maxVim,
        ARMOUR: character.armour,
        HERO: character.hero,
        INIT: character.init,
        SPEED: character.speed
      }
    })
    .then(response => {
      return response.data
    })
}

/*
https://github.com/joshmiller17/vennt-server#get-characters
*/
const listCharacters = auth => {
  return instance
    .get('/get_characters', {
      params: {
        auth_token: auth
      }
    })
    .then(response => {
      return response.data
    })
}

/*
https://github.com/joshmiller17/vennt-server#get-character
*/
const getCharacter = (auth, id) => {
  return instance
    .get('/get_character', {
      params: {
        auth_token: auth,
        id: id
      }
    })
    .then(response => {
      return response.data
    })
}

export default {
  signup,
  login,
  logout,
  createCharacter,
  listCharacters,
  getCharacter
}
