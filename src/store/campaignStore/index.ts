import api from "@/api/api";
import router from "@/router/index";
import { ActionTree, MutationTree } from "vuex";
import { checkResponse } from "../../utils/storeUtil";

const state: CampaignState = {
  campaigns: [],
  campaignInvites: [],
  campaign: {
    entities: {},
    in_combat: false,
    init: [],
    init_index: 0,
    init_round: 0,
    init_styles: "traditional",
    members: {},
    name: "",
    owner: "",
  },
};

const mutations: MutationTree<CampaignState> = {
  setCampaigns(state, campaigns) {
    state.campaigns = campaigns;
  },
  appendToCampains(state, campaign) {
    state.campaigns.push(campaign);
  },
  setCampaignsInvites(state, campaignInvites) {
    state.campaignInvites = campaignInvites;
  },
  filterCampaignInvites(state, id) {
    state.campaignInvites = state.campaignInvites.filter(
      (invite) => invite.id !== id
    );
  },
  setCampaign(state, campaign) {
    state.campaign = campaign;
  },
};

const actions: ActionTree<CampaignState, RootState> = {
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
        const campaign: Campaign = response.value;
        campaign.id = campaginId; // insert id for future reference
        Object.entries(campaign.entities).forEach(([id, entity]) => {
          entity.id = id;
        });
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

  acceptCampaignInvite: ({ commit, dispatch }, campaginId) => {
    return api.acceptCampaignInvite(campaginId).then((response) => {
      if (checkResponse(response)) {
        commit("filterCampaignInvites", campaginId);
        dispatch("listCampaigns");
      }
    });
  },

  declineCampaignInvite: ({ commit }, campaginId) => {
    return api.declineCampaignInvite(campaginId).then((response) => {
      if (checkResponse(response)) {
        commit("filterCampaignInvites", campaginId);
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
