import backendApi from "@/api/backendApi";
import {
  getAuth,
  localAttr2Server,
  localCharacter2Server,
} from "@/api/apiUtil";

// ------------------------- ACCOUNT APIS ------------------------- //

// https://github.com/joshmiller17/vennt-server#create-an-account
const signup = (username, password) => {
  const postBody = { register: username, password: password };
  return backendApi.post("/", JSON.stringify(postBody)).then((response) => {
    return response.data;
  });
};

// https://github.com/joshmiller17/vennt-server#login
const login = (username, password) => {
  const postBody = { login: username, password: password };
  return backendApi.post("/", JSON.stringify(postBody)).then((response) => {
    return response.data;
  });
};

// https://github.com/joshmiller17/vennt-server#logout
const logout = () => {
  return backendApi
    .get("/logout", {
      params: {
        auth_token: getAuth(),
      },
    })
    .then((response) => {
      return response.data;
    });
};

// ------------------------- CHARACTER APIS ------------------------- //

// https://github.com/joshmiller17/vennt-server#create-a-character
const createCharacter = (character) => {
  const serverCharacter = localCharacter2Server(character);
  return backendApi
    .post("/create_character", JSON.stringify(serverCharacter), {
      params: {
        auth_token: getAuth(),
      },
    })
    .then((response) => {
      return response.data;
    });
};

const createEnemy = (enemy, campaign) => {
  const serverEnemy = localCharacter2Server(enemy);
  const params = {
    auth_token: getAuth(),
  };
  if (campaign) {
    params.campaign_id = campaign;
  }
  return backendApi
    .post("/create_enemy", JSON.stringify(serverEnemy), { params })
    .then((response) => {
      return response.data;
    });
};

// https://github.com/joshmiller17/vennt-server#get-characters
const listCharacters = () => {
  return backendApi
    .get("/get_characters", {
      params: {
        auth_token: getAuth(),
      },
    })
    .then((response) => {
      return response.data;
    });
};

// https://github.com/joshmiller17/vennt-server#get-character
const getCharacter = (id) => {
  return backendApi
    .get("/get_character", {
      params: {
        auth_token: getAuth(),
        id,
      },
    })
    .then((response) => {
      return response.data;
    });
};

// https://github.com/joshmiller17/vennt-server#set-an-attribute
const setAttribute = (id, attr, val) => {
  return backendApi
    .get("/set_attr", {
      params: {
        auth_token: getAuth(),
        id,
        attr: localAttr2Server(attr),
        value: val,
      },
    })
    .then((response) => {
      return response.data;
    });
};

// ------------------------- ABILITY APIS ------------------------- //

// https://github.com/joshmiller17/vennt-server#lookup-ability
const lookupAbility = (name) => {
  return backendApi
    .get("lookup_ability", {
      params: {
        auth_token: getAuth(),
        name,
      },
    })
    .then((response) => {
      return response.data;
    });
};

// https://github.com/joshmiller17/vennt-server#add-ability
const addAbility = (id, name) => {
  return backendApi
    .get("add_ability", {
      params: {
        auth_token: getAuth(),
        id,
        name,
      },
    })
    .then((response) => {
      return response.data;
    });
};

const removeAbility = (id, name) => {
  return backendApi
    .get("remove_abillty", {
      params: {
        auth_token: getAuth(),
        id,
        name,
      },
    })
    .then((response) => {
      return response.data;
    });
};

const refreshAbility = (id, name) => {
  return backendApi
    .get("refresh_abillty", {
      params: {
        auth_token: getAuth(),
        id,
        name,
      },
    })
    .then((response) => {
      return response.data;
    });
};

const updateAbilityComment = (id, name, comment) => {
  return backendApi
    .get("update_ability_comment", {
      params: {
        auth_token: getAuth(),
        id,
        name,
        comment,
      },
    })
    .then((response) => {
      return response.data;
    });
};

const createCustomAbility = (id, ability) => {
  return backendApi
    .post("create_ability", JSON.stringify(ability), {
      params: {
        auth_token: getAuth(),
        id,
      },
    })
    .then((response) => {
      return response.data;
    });
};

const updateAbility = (id, name, ability) => {
  return backendApi
    .post("update_ability", JSON.stringify(ability), {
      params: {
        auth_token: getAuth(),
        id,
        name,
      },
    })
    .then((response) => {
      return response.data;
    });
};

// ------------------------- ITEM APIS ------------------------- //

// https://github.com/joshmiller17/vennt-server#lookup-ability
const addItem = (id, item) => {
  const params = {
    auth_token: getAuth(),
    id,
    name: item.name,
    bulk: item.bulk,
    desc: item.desc,
  };
  if ("type" in item) {
    params.type = item.type;
  }
  if ("courses" in item) {
    params.courses = item.courses;
  }
  return backendApi.get("add_item", { params }).then((response) => {
    return response.data;
  });
};

// https://github.com/joshmiller17/vennt-server#add-ability
const removeItem = (id, itemId) => {
  return backendApi
    .get("remove_item", {
      params: {
        auth_token: getAuth(),
        id,
        id2: itemId,
      },
    })
    .then((response) => {
      return response.data;
    });
};

// ------------------------- CAMPAIGN APIS ------------------------- //

// https://github.com/joshmiller17/vennt-server#create-a-campaign
const createCampaign = (name) => {
  return backendApi
    .get("/create_campaign", {
      params: {
        auth_token: getAuth(),
        name,
      },
    })
    .then((response) => {
      return response.data;
    });
};

// https://github.com/joshmiller17/vennt-server#get-campaigns
const listCampaigns = () => {
  return backendApi
    .get("/get_campaigns", {
      params: {
        auth_token: getAuth(),
      },
    })
    .then((response) => {
      return response.data;
    });
};

const getCampaign = (campaignId) => {
  return backendApi
    .get("/get_campaign", {
      params: {
        auth_token: getAuth(),
        campaign_id: campaignId,
      },
    })
    .then((response) => {
      return response.data;
    });
};

// https://github.com/joshmiller17/vennt-server#view-active-campaign-invites
const listCampaignInvites = () => {
  return backendApi
    .get("/view_campaign_invites", {
      params: {
        auth_token: getAuth(),
      },
    })
    .then((response) => {
      return response.data;
    });
};

// https://github.com/joshmiller17/vennt-server#invite-someone-to-a-campaign
const sendCampaignInvite = (campaignId, username) => {
  return backendApi
    .get("/send_campaign_invite", {
      params: {
        auth_token: getAuth(),
        campaign_id: campaignId,
        username,
      },
    })
    .then((response) => {
      return response.data;
    });
};

// https://github.com/joshmiller17/vennt-server#accept-campaign-invite
const acceptCampaignInvite = (campaignId) => {
  return backendApi
    .get("/accept_campaign_invite", {
      params: {
        auth_token: getAuth(),
        campaign_id: campaignId,
      },
    })
    .then((response) => {
      return response.data;
    });
};

// https://github.com/joshmiller17/vennt-server#decline-campaign-invite
const declineCampaignInvite = (campaignId) => {
  return backendApi
    .get("/decline_campaign_invite", {
      params: {
        auth_token: getAuth(),
        campaign_id: campaignId,
      },
    })
    .then((response) => {
      return response.data;
    });
};

// https://github.com/joshmiller17/vennt-server#set-campaign-role
const setCampaignRole = (campaignId, username, role) => {
  return backendApi
    .get("/set_role", {
      params: {
        auth_token: getAuth(),
        campaign_id: campaignId,
        username,
        role,
      },
    })
    .then((response) => {
      return response.data;
    });
};

export default {
  signup,
  login,
  logout,
  createCharacter,
  createEnemy,
  listCharacters,
  getCharacter,
  setAttribute,
  lookupAbility,
  addAbility,
  removeAbility,
  refreshAbility,
  updateAbilityComment,
  createCustomAbility,
  updateAbility,
  addItem,
  removeItem,
  createCampaign,
  listCampaigns,
  getCampaign,
  listCampaignInvites,
  sendCampaignInvite,
  acceptCampaignInvite,
  declineCampaignInvite,
  setCampaignRole,
};
