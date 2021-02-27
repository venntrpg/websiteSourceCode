import backendApi from '@/api/backendApi'
import anyApi from '@/api/anyApi'

// ------------------------- ACCOUNT APIS ------------------------- //

// https://github.com/joshmiller17/vennt-server#create-an-account
const signup = (username, password) => {
  // For some reason, I need to build this JSON by hand ¯\_(ツ)_/¯
  // const postBody = '{"register":"' + username + '","password":"' + password + '"}'
  const postBody = { register: username, password: password }
  return backendApi
    .post('/', JSON.stringify(postBody))
    .then(response => {
      return response.data
    })
}

// https://github.com/joshmiller17/vennt-server#login
const login = (username, password) => {
  // For some reason, I need to build this JSON by hand ¯\_(ツ)_/¯
  // const postBody = '{"login":"' + username + '","password":"' + password + '"}'
  const postBody = { login: username, password: password }
  return backendApi
    .post('/', JSON.stringify(postBody))
    .then(response => {
      return response.data
    })
}

// https://github.com/joshmiller17/vennt-server#logout
const logout = auth => {
  return backendApi
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

// ------------------------- CHARACTER APIS ------------------------- //

// https://github.com/joshmiller17/vennt-server#create-a-character
const createCharacter = (auth, character) => {
  return backendApi
    .get('/create_character', {
      params: {
        q: {
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
          SPEED: character.speed,
          XP: character.xp,
          SP: character.sp
        }
      }
    })
    .then(response => {
      return response.data
    })
}

// https://github.com/joshmiller17/vennt-server#get-characters
const listCharacters = auth => {
  return backendApi
    .get('/get_characters', {
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

// https://github.com/joshmiller17/vennt-server#get-character
const getCharacter = (auth, id) => {
  return backendApi
    .get('/get_character', {
      params: {
        q: {
          auth_token: auth,
          char_id: id
        }
      }
    })
    .then(response => {
      return response.data
    })
}

// ------------------------- CAMPAIGN APIS ------------------------- //

// https://github.com/joshmiller17/vennt-server#create-a-campaign
const createCampaign = (auth, name) => {
  return backendApi
    .get('/create_campaign', {
      params: {
        q: {
          auth_token: auth,
          name: name
        }
      }
    })
    .then(response => {
      return response.data
    })
}

// https://github.com/joshmiller17/vennt-server#get-campaigns
const listCampaigns = auth => {
  return backendApi
    .get('/get_campaigns', {
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

// https://github.com/joshmiller17/vennt-server#view-active-campaign-invites
const listCampaignInvites = auth => {
  return backendApi
    .get('/view_campaign_invites', {
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

// ------------------------- OTHER / RANDOM APIS ------------------------- //

const getRandomNames = () => {
  // We use a random number because the proxy will cache a response, so to circumvent that we use a random number
  const number = Math.floor(Math.random() * 45) + 5
  const url = `http://names.drycodes.com/${number}?nameOptions=boy_names,girl_names&separator=space`
  return anyApi
    .get('/get', {
      params: {
        url: url
      }
    })
    .then(response => {
      if (response.data.contents) {
        const ret = JSON.parse(response.data.contents)
        if (ret && ret.length > 0) {
          return ret
        }
      }
      return response.data
    })
}

export default {
  signup,
  login,
  logout,
  createCharacter,
  listCharacters,
  getCharacter,
  createCampaign,
  listCampaigns,
  listCampaignInvites,
  getRandomNames
}
