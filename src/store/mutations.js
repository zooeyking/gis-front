import * as types from './mutation-types'

const mutations = {
  [types.SET_CAMPUS](state, list) {
    state.campus = list
  },

  [types.SET_CURRENT_CAMPUS](state, obj) {
    state.currentCampus = obj
  },

  [types.SET_BUILDINGS](state, list) {
    state.buildings = list
  },

  [types.SET_CURRENT_BUILDING](state, obj) {
    state.currentBuilding = obj
  },

  [types.SET_BUILDING_TYPES](state, list) {
    state.buildingTypes = list
  },

  [types.SET_CURRENT_BUILDING_TYPE](state, obj) {
    state.currentBuildingType = obj
  },

  [types.SET_AGENCIES](state, list) {
    state.agencies = list
  },

  [types.SET_CURRENT_AGENCY](state, obj) {
    state.currentAgency = obj
  },

  [types.SET_AGENCY_TYPES](state, list) {
    state.agencyTypes = list
  },

  [types.SET_CURRENT_AGENCY_TYPE](state, obj) {
    state.currentAgencyType = obj
  },

  [types.SET_INFORMATIONS](state, list) {
    state.informations = list
  },

  [types.SET_CURRENT_INFORMATION](state, obj) {
    state.currentInformation = obj
  },

  [types.SET_INFORMATION_TYPES](state, list) {
    state.informationTypes = list
  },

  [types.SET_CURRENT_INFORMATION_TYPE](state, obj) {
    state.currentInformationType = obj
  },

  [types.SET_PARTIES](state, list) {
    state.parties = list
  },

  [types.SET_CURRENT_PARTY](state, obj) {
    state.currentParty = obj
  },

  [types.SET_SEARCH_PARAMS](state, str) {
    state.searchParams = str
  },

  [types.SET_MAP_ZOOM](state, num) {
    state.mapZoom = num
  },

  [types.SET_BUILDING_IMG_LIST](state, list) {
    state.buildingImgList = list
  },

  [types.SET_START_POS](state, pos) {
    state.startPos = pos
  },

  [types.SET_END_POS](state, pos) {
    state.endPos = pos
  },

  [types.SET_GUIDES](state, list) {
    state.guides = list
  },

  [types.SET_CURRENT_GUIDE](state, obj) {
    state.currentGuide = obj
  },

  [types.SET_TIPS](state, list) {
    state.tips = list
  },

  [types.SET_CURRENT_TIP](state, obj) {
    state.currentTip = obj
  },

  [types.SET_LEADS](state, list) {
    state.leads = list
  },

  [types.SET_CURRENT_LEAD](state, obj) {
    state.currentLead = obj
  },

  [types.SET_LOCATION_TYPE](state, num) {
    state.locationType = num
  },

  [types.SET_TRANSIT_TYPE](state, num) {
    state.transitType = num
  },

  [types.SET_WAY_FLAG](state, flag) {
    state.wayFlag = flag
  },
  
}

export default mutations