import api from "@/api/api";
import router from "@/router/index";
import { checkResponse } from "../../utils/storeUtil";

const state = {
  campaigns: [],
  campaignInvites: [],
  campaign: {},
};

const mutations = {
  setCampaigns(state, campaigns) {
    state.campaigns = campaigns;
  },
  appendToCampains(state, campaign) {
    state.campaigns.push(campaign);
  },
  setCampaignsInvites(state, campaignInvites) {
    state.campaignInvites = campaignInvites;
  },
  setCampaign(state, campaign) {
    state.campaign = campaign;
  },
};

const actions = {
  // ------------------------- CAMPAIGN APIS ------------------------- //

  createCampaign: ({ commit }, { name, redirectToCampaign }) => {
    return api.createCampaign(name).then((response) => {
      if (checkResponse(response) && response.campaign_id) {
        console.log(response);
        const campaign = { name: name, id: response.campaign_id };
        commit("appendToCampains", campaign);
        if (redirectToCampaign) {
          router.push({
            name: "Campaign",
            params: { campaignId: response.campaign_id },
          });
        }
      }
    });
  },

  listCampaigns: ({ commit }) => {
    return api.listCampaigns().then((response) => {
      if (checkResponse(response) && response.value) {
        commit("setCampaigns", response.value);
      }
    });
  },

  getCampaign: ({ commit }, campaginId) => {
    return api.getCampaign(campaginId).then((response) => {
      if (checkResponse(response) && response.value) {
        const campaign = response.value;
        campaign.id = campaginId; // insert id for future reference
        commit("setCampaign", response.value);
      }
    });
  },

  // ------ CAMPAIGN MANAGEMENT APIS ------ //

  // eslint-disable-next-line no-unused-vars
  setCampaignRole: ({ commit }, { campaginId, username, role }) => {
    return api.setCampaignRole(campaginId, username, role).then((response) => {
      if (checkResponse(response)) {
        console.log(response);
      }
    });
  },

  // ------ CAMPAIGN INVITE APIS ------ //

  listCampaignInvites: ({ commit }) => {
    return api.listCampaignInvites().then((response) => {
      if (checkResponse(response) && response.value) {
        console.log(response);
        commit("setCampaignsInvites", response.value);
      }
    });
  },

  // eslint-disable-next-line no-unused-vars
  sendCampaignInvite: ({ commit }, { campaginId, username }) => {
    return api.sendCampaignInvite(campaginId, username).then((response) => {
      if (checkResponse(response)) {
        console.log(response);
      }
    });
  },

  // eslint-disable-next-line no-unused-vars
  acceptCampaignInvite: ({ commit }, campaginId) => {
    return api.acceptCampaignInvite(campaginId).then((response) => {
      if (checkResponse(response)) {
        console.log(response);
      }
    });
  },

  // eslint-disable-next-line no-unused-vars
  declineCampaignInvite: ({ commit }, campaginId) => {
    return api.declineCampaignInvite(campaginId).then((response) => {
      if (checkResponse(response)) {
        console.log(response);
      }
    });
  },
};

const module = {
  state,
  mutations,
  actions,
  namespaced: true,
};

export default module;
