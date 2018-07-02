<template>
  <div id="app">
    <BaiduMap @hiddenGuide="hiddenGuide" @infoShow="infoShow"></BaiduMap>
    <div class="search-wrapper">
      <search

        ref='search'
        @toggleLocusFlag="toggleLocusFlag"
        @showGuide="showGuide"
        @hiddenGuide="hiddenGuide"
        @showTransport="showTransport"
        @hiddenTransport="hiddenTransport"

      ></search>
    </div>
    <div class="buildings-wrapper" v-if="locusFlag">
      <result @showGuide="showGuide" :treeBuildingData='treeBuildingData' :treeAgencyData='treeAgencyData'></result>
    </div>
    <div class="transport-wrapper" v-if="transportFlag">
      <transport ref='trans'></transport>
    </div>
    <div class="tips-wrapper" v-if="tipsFlag">
      <tips 

        @hiddenGuide="hiddenGuide"
        @showTransport="showTransport"

      ></tips>
    </div>
    <div class="lead-wrapper" v-if="leadFlag">
      <lead ref='routes'></lead>
    </div>
    <transition 
        name="normal"
        enter-active-class="animated fadeInLeft"
        leave-active-class="animated fadeOutLeft"
      >
      <div class="guide-wrapper" v-if="guideFlag">
        <guide></guide>
      </div>
    </transition>
    <transition 
        name="normal"
        enter-active-class="animated fadeInRight"
        leave-active-class="animated fadeOutRight"
      > 
      <div class="content-wrapper" v-if="contentFlag">
        <my-content>
          <div class="close-wrapper" @click="toHidden">
            <font-awesome-icon class="input-clear" :icon="['fas','times']"/>
          </div>
        </my-content>
      </div>
    </transition>
    <div class="assort-wrapper">
      <transition name="category">
        <assortment v-if="btnFlag"></assortment>
      </transition>
      <div class="icon-wrapper" @click="toggleBtnFlag">
        <font-awesome-icon class="right-show" :icon="['fas',btnCls]"/>
      </div>
    </div>
    <div class="campus-wrapper">
      <campus></campus>
    </div>
    <div class="tools-wrapper">
      <tools></tools>
    </div>
  </div>
</template>

<script>
import BaiduMap from '@/components/map/BaiduMap'
import Search from '@/components/search/Search'
import MyContent from '@/components/content/Content'
import Assortment from '@/components/assortment/Assortment'
import Result from '@/components/result/Result'
import Transport from '@/components/transport/Transport'
import Campus from '@/components/campus/Campus'
import Tools from '@/components/tools/Tools'
import Tips from '@/components/tips/Tips'
import Guide from '@/components/guide/Guide'
import Lead from '@/components/lead/Lead'
import storage from 'good-storage'
import {ip, unitCall, zoneListUrl, buildingTypeListUrl, buildingListUrl, organizationListUrl, agencyListUrl, serviceTypeListUrl, informationListUrl, guideListUrl, partyListUrl, sortServiceInfoUrl, buildingImgsUrl, guideInfoListUrl, TipListUrl } from '@/api'
import { mapGetters, mapMutations } from 'vuex'
import { __treesData, __getCenter, __distinct } from '@/tools'

export default {
  name: 'App',

  components: {
    BaiduMap,
    Search,
    MyContent,
    Assortment,
    Result,
    Transport,
    Campus,
    Tools,
    Tips,
    Lead,
    Guide
  },

  data () {
    return {
      contentFlag: false,
      btnFlag: false,
      locusFlag: false,
      transportFlag: false,
      tipsFlag: false,
      leadFlag: false,
      guideFlag: false,
      isHiddenTips: false,
      isSwitch: false,
      routes: [],
      btnCls: 'angle-double-right',
      treeBuildingData: null,
      treeAgencyData: null
    }
  },

  computed: {
    ...mapGetters([
      'currentCampus',
      'currentInformationType',
      'currentParty',
      'buildingTypes',
      'agencyTypes',
      'buildings',
      'agencies',
      'currentBuilding',
      'buildingImgList',
      'currentGuide',
      'guides',
      'tips',
      'leads',
      'searchParams'
      ])
  },

  mounted () {
    this.getCampus()
    .then(this.getInformations)
    .then(this.getBuildingTypes)
    .then(this.getBuildings)
    .then(this.getAgencyTypes)
    .then(this.getAgencies)
    .then(this.getParties)
  },

  watch: {
    searchParams(newVal) {
      if(newVal !== null && newVal.length>0) {
        this.locusFlag = false
        this.getTips()
      }else{
        this.tipsFlag = false
      }
    },

    'currentInformationType' : {
      handler(newVal) {
        if(newVal !== null) {
          let id = newVal.id
          this.getInformations(id)
        }
      },
      deep: true
    },

    'currentCampus' : {
      handler(newVal) {
        console.log(this.locusFlag)
        this.btnFlag = false
        this.tipsFlag = false
        this.locusFlag = false
        this.setCurrentBuilding(null)
        this.setCurrentParty(null)
        this.setCurrentGuide(null)
        this.setSearchParams(null)
        this.setGuides([])
        this.setMapZoom(17)
        this.hiddenGuide()
        this.getBuildings()
        .then(this.getInformations)
        .then(this.getAgencyTypes)
        .then(this.getAgencies)
        .then(this.getParties)
      },
      deep: true
    },

    'currentBuilding' : {
      handler(newVal) {
        if(newVal !== null) {
          this.getBuildingImgs()
          this.locusFlag = false
        }
      },
      deep: true
    },

    'currentParty' : {
      handler(newVal) {
        if(newVal !== null) {
          this.getGuides()
        }
      },
      deep: true
    },

    'guides' : {
      handler(newVal) {
        if(newVal !== null && newVal.length>0) {
          this.guideFlag = true
        }else{
          this.guideFlag = false
        }
      },
      deep: true
    },

    'currentGuide' : {
      handler(newVal) {
        if(newVal !== null) {
          this.getGuideInfos()
        }
      },
      deep: true
    },

    'tips' : {
      handler(newVal) {
        if(newVal !== null && newVal.length>0) {
          this.tipsFlag = true
        }else{
          this.tipsFlag = false
        }
      },
      deep: true
    },

    // 'routes' : {
    //   handler(newVal) {
    //     console.log(newVal)
    //     if(newVal !== null && newVal.length>0) {
    //       this.leadFlag = true
    //     }else{
    //       this.leadFlag = false
    //     }
    //   },
    //   deep: true
    // },

  },

  methods: {
    infoShow () {
      this.contentFlag = true
    },

    toHidden () {
      this.contentFlag = false
    },

    toggleBtnFlag () {
      this.btnFlag = !this.btnFlag
      this.btnCls = this.btnFlag ? 'angle-double-left' : 'angle-double-right'
      this.setInformations([])
      this.setGuides([])
      this.setCurrentInformationType(null)
      this.setCurrentParty(null)
      this.setCurrentGuide(null)
    },

    showGuide () {
      this.locusFlag = true
    },

    showTransport () {
      this.transportFlag = true
      this.leadFlag = true
    },

    hiddenTransport () {
      this.transportFlag = false
      this.leadFlag = false
      let currentCampus = this.currentCampus
      this.setCurrentCampus({})
      this.setCurrentCampus(currentCampus)
    },

    hiddenGuide () {
      
      this.locusFlag = false
      this.tipsFlag = false
    },

    getTips() {
      let params = this.searchParams

      return unitCall(TipListUrl, { params }).then((res)=>{
              let {architeEntityList, jsonObject, serviceInfoList} = {...res.value}
              let arLength = architeEntityList.length;
              let seLength = serviceInfoList.length;
              for(let i=0; i<arLength; i++) {
                let position = JSON.parse(architeEntityList[i].position);
                architeEntityList[i].location = __getCenter(position);
              }
              for(let i=0; i<seLength; i++) {
                architeEntityList[i].location = JSON.parse(architeEntityList[i].position);
              }
              
              let list = architeEntityList.concat(architeEntityList, jsonObject['result']).slice(0,10)
              this.setTips(list)
            }).catch((err)=>{console.log(err)})
    },

    getCampus() {
      return unitCall(zoneListUrl).then((res)=>{
              let list = res.value[0].list || []
              this.setCampus(list)
              this.setCurrentCampus(list[0])
            }).catch((err)=>{console.log(err)})
    },

    getBuildingTypes() {
      return unitCall(buildingTypeListUrl).then((res)=>{
              let list = res.value[0].list || []
              this.setBuildingTypes(list)
            }).catch((err)=>{console.log(err)})
    },

    getBuildings() {
      let cid = this.currentCampus['id']

      return unitCall(buildingListUrl, {cid}).then((res)=>{
              let list = res.value[0].list || []
              this.setBuildings(list)
              let plantData = this.buildingTypes.concat(this.buildings)
              let params = JSON.parse(JSON.stringify(plantData))
              let allData = __treesData(params, 'id', 'acid', 'children')
              this.treeBuildingData = allData.filter((item)=>{
                return item.children && (item.children.length > 0)
              })
            }).catch((err)=>{console.log(err)})
    },

    getBuildingImgs() {
      let aeid = this.currentBuilding['id']

      return unitCall(buildingImgsUrl, {aeid}).then((res)=>{
              let list = res.value || []
              let imgList = []
              if(list.length > 0) {
                imgList = list.map((item)=>{return ip + '/gis-service/files' + item.imgUrl})
              }
              this.setBuildingImgList(imgList)
            }).catch((err)=>{console.log(err)})
    },

    getAgencyTypes() {
      let cid = this.currentCampus['id']

      return unitCall(organizationListUrl, {cid}).then((res)=>{
              let list = res.value[0].list || []
              this.setAgencyTypes(list)
              this.setCurrentAgencyType(list[0])
            }).catch((err)=>{console.log(err)})
    },

    getAgencies() {
      let cid = this.currentCampus['id']

      return unitCall(agencyListUrl, {cid}).then((res)=>{
              let list = res.value[0].list || []
              this.setAgencies(list)
              let plantData = this.agencyTypes.concat(this.agencies)
              let params = JSON.parse(JSON.stringify(plantData))
              let allData = __treesData(params, 'id', 'oid', 'children')
              this.treeAgencyData = allData.filter((item)=>{
                return item.children && (item.children.length > 0)
              })
            }).catch((err)=>{console.log(err)})
    },

    getParties() {
      let cid = this.currentCampus['id']

      return unitCall(partyListUrl, {cid}).then((res)=>{
              let list = res.value || []
              this.setParties(list)
            }).catch((err)=>{console.log(err)})
    },

    getGuides() {
      let id = this.currentParty['id']
      return unitCall(guideListUrl, { id }).then((res)=>{
              let list = res.value[0].list || []
              this.setGuides(list)
            }).catch((err)=>{console.log(err)})
    },

    getGuideInfos() {
      let id = this.currentGuide['id']
      return unitCall(guideInfoListUrl, { id }).then((res)=>{
              let list = res.value[0].list || []
              this.setInformations(list)
            }).catch((err)=>{console.log(err)})
    },

    getInformationTypes() {
      return unitCall(serviceTypeListUrl).then((res)=>{
              let list = res.value[0].list || []
              this.setInformationTypes(list)
            }).catch((err)=>{console.log(err)})
    },

    getInformations(scid) {
      if(!scid) {
        let cid = this.currentCampus['id']
        return unitCall(informationListUrl, { cid }).then((res)=>{
                let list = res.value[0].list || []
                let infoTypes = []
                let tempArr = []
                let length = list.length
                for (let i=0; i<length; i++) {
                  tempArr.push(list[i].serviceCategory)
                }
                infoTypes = __distinct(tempArr,'id')
                this.setInformationTypes(infoTypes)
              }).catch((err)=>{console.log(err)})
      }else{
        let cid = this.currentCampus['id']
        return unitCall(informationListUrl, { scid, cid }).then((res)=>{
                let list = res.value[0].list || []
                this.setInformations(list)
              }).catch((err)=>{console.log(err)})
      }
    },

    toggleLocusFlag (flag) {
      this.locusFlag = flag
    },

    ...mapMutations({
      setCampus : 'SET_CAMPUS',
      setCurrentCampus : 'SET_CURRENT_CAMPUS',
      setInformations : 'SET_INFORMATIONS',
      setCurrentInformation : 'SET_CURRENT_INFORMATION',
      setInformationTypes : 'SET_INFORMATION_TYPES',
      setCurrentInformationType : 'SET_CURRENT_INFORMATION_TYPE',
      setParties : 'SET_PARTIES',
      setCurrentParty : 'SET_CURRENT_PARTY',
      setBuildings : 'SET_BUILDINGS',
      setCurrentBuilding : 'SET_CURRENT_BUILDING',
      setBuildingTypes : 'SET_BUILDING_TYPES',
      setCurrentBuildingType : 'SET_CURRENT_BUILDING_TYPE',
      setAgencyTypes : 'SET_AGENCY_TYPES',
      setCurrentAgencyType : 'SET_CURRENT_AGENCY_TYPE',
      setAgencies : 'SET_AGENCIES',
      setCurrentAgency : 'SET_CURRENT_AGENCY',
      setSearchParams : 'SET_SEARCH_PARAMS',
      setMapZoom : 'SET_MAP_ZOOM',
      setBuildingImgList : 'SET_BUILDING_IMG_LIST',
      setGuides : 'SET_GUIDES',
      setTips : 'SET_TIPS',
      setCurrentGuide : 'SET_CURRENT_GUIDE'
    })
  }
}
</script>

<style lang="stylus" scoped>
.search-wrapper
  position: absolute
  z-index: 10
  left: 2%
  top: 2%

.buildings-wrapper
  position: absolute
  z-index: 11
  left: 2%
  top: 7%

.tips-wrapper
  position: absolute
  z-index: 11
  left: 2%
  top: 7%

.lead-wrapper
  position: absolute
  z-index: 11
  left: 2%
  top: 20%

.guide-wrapper
  position: absolute
  z-index: 11
  left: 0
  top: 20%

.road-result
  position: absolute
  z-index: 11
  left: 2%
  top: 20%

.transport-wrapper
  position: absolute
  z-index: 12
  left: 2%
  top: 7%

.content-wrapper
  position: absolute
  z-index: 10
  width: 28%
  height: 100%
  right: 0
  top: 0

  .close-wrapper
    position: absolute
    width: 20px
    height: 20px
    left: 20px
    top: 10px
    cursor: pointer
    font-size: 20px

.assort-wrapper
  position: absolute
  bottom: 2vw
  background: #fff
  height: 150px
  border-radius: 0 4px 4px 0
  overflow: hidden
  box-shadow: 0px 3px 2px #969696

  .icon-wrapper
    cursor: pointer
    float: right
    width: 40px
    height: 150px
    line-height: 150px
    background: #a40005
    color: #fff
    text-align: center
    font-size: 20px

  .category-enter-active, .category-leave-active
    transition: all .5s

  .category-enter, .category-leave-to
    opacity: 0
    width: 0

.campus-wrapper
  position: absolute
  right: 0
  top: 0
  background: #fff
  overflow: hidden
  box-shadow: 0px 3px 2px #969696

.tools-wrapper
  position: absolute
  right: 80px
  top: 2%
  background: #fff
  overflow: hidden
  border-radius: 2px
  box-shadow: 0px 3px 2px #969696

</style>
