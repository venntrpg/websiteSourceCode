import backendApi from '@/api/backendApi'
import anyApi from '@/api/anyApi'

function getAuth () {
  const auth = localStorage.getItem('auth')
  if (auth === null) {
    throw new Error('Not logged in')
  }
  return auth
}

function convertAttribute (attr) {
  switch (attr) {
    case 'maxHp':
      return 'MAX_HP'
    case 'maxMp':
      return 'MAX_MP'
    case 'maxVim':
      return 'MAX_VIM'
    default:
      return attr.toUpperCase()
  }
}

// ------------------------- ACCOUNT APIS ------------------------- //

// https://github.com/joshmiller17/vennt-server#create-an-account
const signup = (username, password) => {
  const postBody = { register: username, password: password }
  return backendApi
    .post('/', JSON.stringify(postBody))
    .then(response => {
      return response.data
    })
}

// https://github.com/joshmiller17/vennt-server#login
const login = (username, password) => {
  const postBody = { login: username, password: password }
  return backendApi
    .post('/', JSON.stringify(postBody))
    .then(response => {
      return response.data
    })
}

// https://github.com/joshmiller17/vennt-server#logout
const logout = () => {
  return backendApi
    .get('/logout', {
      params: {
        auth_token: getAuth()
      }
    })
    .then(response => {
      return response.data
    })
}

// ------------------------- CHARACTER APIS ------------------------- //

// https://github.com/joshmiller17/vennt-server#create-a-character
const createCharacter = character => {
  return backendApi
    .get('/create_character', {
      params: {
        auth_token: getAuth(),
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
        MP: character.mp,
        MAX_MP: character.maxMp,
        VIM: character.vim,
        MAX_VIM: character.maxVim,
        ARMOUR: character.armour,
        HERO: character.hero,
        INIT: character.init,
        SPEED: character.speed,
        XP: character.xp,
        SP: character.sp
      }
    })
    .then(response => {
      return response.data
    })
}

// https://github.com/joshmiller17/vennt-server#get-characters
const listCharacters = () => {
  return backendApi
    .get('/get_characters', {
      params: {
        auth_token: getAuth()
      }
    })
    .then(response => {
      return response.data
    })
}

// https://github.com/joshmiller17/vennt-server#get-character
const getCharacter = id => {
  return backendApi
    .get('/get_character', {
      params: {
        auth_token: getAuth(),
        id: id
      }
    })
    .then(response => {
      return response.data
    })
}

// https://github.com/joshmiller17/vennt-server#set-an-attribute
const setAttribute = (id, attr, val) => {
  return backendApi
    .get('/set_attr', {
      params: {
        auth_token: getAuth(),
        id: id,
        attr: convertAttribute(attr),
        value: val
      }
    })
    .then(response => {
      return response.data
    })
}

// ------------------------- ABILITY APIS ------------------------- //

// https://github.com/joshmiller17/vennt-server#lookup-ability
const lookupAbility = name => {
  return backendApi
    .get('lookup_ability', {
      params: {
        auth_token: getAuth(),
        name: name
      }
    })
    .then(response => {
      return response.data
    })
}

// https://github.com/joshmiller17/vennt-server#add-ability
const addAbility = (id, name) => {
  return backendApi
    .get('add_ability', {
      params: {
        auth_token: getAuth(),
        id: id,
        name: name
      }
    })
    .then(response => {
      return response.data
    })
}

// ------------------------- ITEM APIS ------------------------- //

// https://github.com/joshmiller17/vennt-server#lookup-ability
const addItem = (id, item) => {
  return backendApi
    .get('add_item', {
      params: {
        auth_token: getAuth(),
        id: id,
        name: item.name,
        bulk: item.bulk,
        desc: item.desc
      }
    })
    .then(response => {
      return response.data
    })
}

// https://github.com/joshmiller17/vennt-server#add-ability
const removeItem = (id, itemId) => {
  return backendApi
    .get('remove_item', {
      params: {
        auth_token: getAuth(),
        id: id,
        id2: itemId
      }
    })
    .then(response => {
      return response.data
    })
}

// ------------------------- CAMPAIGN APIS ------------------------- //

// https://github.com/joshmiller17/vennt-server#create-a-campaign
const createCampaign = name => {
  return backendApi
    .get('/create_campaign', {
      params: {
        auth_token: getAuth(),
        name: name
      }
    })
    .then(response => {
      return response.data
    })
}

// https://github.com/joshmiller17/vennt-server#get-campaigns
const listCampaigns = () => {
  return backendApi
    .get('/get_campaigns', {
      params: {
        auth_token: getAuth()
      }
    })
    .then(response => {
      return response.data
    })
}

// https://github.com/joshmiller17/vennt-server#view-active-campaign-invites
const listCampaignInvites = () => {
  return backendApi
    .get('/view_campaign_invites', {
      params: {
        auth_token: getAuth()
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
        try {
          const ret = JSON.parse(response.data.contents)
          if (ret && ret.length > 0) {
            return ret
          }
        } catch (e) {
          return response.data
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
  setAttribute,
  lookupAbility,
  addAbility,
  addItem,
  removeItem,
  createCampaign,
  listCampaigns,
  listCampaignInvites,
  getRandomNames
}
