<template>
  <baidu-map

  class="bm-view"
  ak="H8S40o4ZdE6hN4W4ESYvCgRY"
  :center="center"
  :zoom="mapZoom"
  :scroll-wheel-zoom="true"
  :cursorStyle="cursorFlag"
  @ready="handler"
  @click="hiddenGuide"

  >
  	<bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" type="BMAP_NAVIGATION_CONTROL_SMALL" :offset="offsetNav"></bm-navigation>

    <bm-marker v-if="currentTip !== null" :position="currentTip.location" :dragging="true" animation="BMAP_ANIMATION_DROP">
      <bm-label :content="currentTip.name" :labelStyle="labelStyle" :offset="{width: -40, height: 30}" />
    </bm-marker>

    <bm-marker v-for="(item, index) in informations" :key="index" v-if="item.position && item.position.length < 50" :position="JSON.parse(item.position)" :dragging="true" animation="BMAP_ANIMATION_DROP" @click="infoShow(item)">
      <bm-label :content="item.lable" :labelStyle="labelStyle" :offset="{width: -35, height: 30}" @click="infoShow(item)" />
    </bm-marker>

    <bm-marker v-if="signPoints.length > 0" v-for="(item, index) in signPoints" :key="index" :position="item.position" :dragging="false" animation="BMAP_ANIMATION_DROP" @click="showMarkerInfo(item)">
      <bm-info-window :position="item.position" title="标记内容" :show="item.show" @close="infoWindowClose(item)" @open="infoWindowOpen">
        <textarea class="text-box" v-model="item.contents"></textarea>
        <div class="opera-wrapper">
          <button class="btn clear" @click="clearInfo(item)">清除</button>
          <button class="btn del" @click="delSign(index)">删除</button>
        </div>
      </bm-info-window>
      <bm-label v-if="item.contents.length > 0" :content="item.contents" :labelStyle="labelStyle" :offset="{width: -35, height: 30}" />
    </bm-marker>

    <bm-polygon v-if="hoverBuilding && hoverBuilding.position" :path="polygon" stroke-color="blue" fill-color="red" :fill-opacity="0.4" :stroke-opacity="0.5" :stroke-weight="1" :editing="false" @click="infoBuilding"/>

    <bm-label 
      v-if="hoverBuilding && hoverBuilding.position" 
      :position="lablePointer" 
      :labelStyle="{color: 'red', 
        fontSize : '14px',
        borderRadius : '2px',
        padding: '4px',
        textAlign: 'center',}" 
      :content="hoverBuilding.name" 
      :offset="{width: -20, height: 10}" 
      @click="infoBuilding" />

    <bm-polygon v-if="buildings !== null" v-for="(item, index) in buildings" :key="index" :path="JSON.parse(item.position)" stroke-color="blue" fill-color="white" :stroke-weight="1" :fill-opacity="0.01" :stroke-opacity="0.01" :editing="false" @mouseover="showBuilding(item)" @mouseout="showBuilding(null)"/>

    <bm-transit v-if="busWay && (startPos !== null) && (endPos !== null)" :start="startPos !== null ? startPos.location : {lng: 121.601268, lat: 31.18331}" :end="endPos !== null ? endPos.location : {lng: 121.462503, lat: 31.25343}" :auto-viewport="true" location="上海" @resultshtmlset="getResult"></bm-transit>

    <bm-driving v-if="drivingWay && (startPos !== null) && (endPos !== null)" :start="startPos !== null ? startPos.location : {lng: 121.601268, lat: 31.18331}" :end="endPos !== null ? endPos.location : {lng: 121.462503, lat: 31.25343}" :auto-viewport="true" location="上海" @resultshtmlset="getResult"></bm-driving>

    <bm-walking v-if="walkingWay && (startPos !== null) && (endPos !== null)" :start="startPos !== null ? startPos.location : {lng: 121.601268, lat: 31.18331}" :end="endPos !== null ? endPos.location : {lng: 121.462503, lat: 31.25343}" :auto-viewport="true" location="上海" @resultshtmlset="getResult"></bm-walking>

    <bm-walking v-if="bikeWay && (startPos !== null) && (endPos !== null)" :start="startPos !== null ? startPos.location : {lng: 121.601268, lat: 31.18331}" :end="endPos !== null ? endPos.location : {lng: 121.462503, lat: 31.25343}" :auto-viewport="true" location="上海" @resultshtmlset="getResult"></bm-walking>

    <bm-tile
      :isTransparentPng="true"
      :zIndex="10000"
      :tileUrlTemplate="tilesUrl + '/tiles/{Z}/tile{X}_{Y}.png'">
    </bm-tile>

  </baidu-map>
</template>

<script>
import {ip} from '@/api'
import BaiduMap from 'vue-baidu-map/components/Map/Map.vue'
import BmNavigation from 'vue-baidu-map/components/controls/Navigation.vue'
import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue'
import BmLabel from 'vue-baidu-map/components/overlays/Label.vue'
import BmControl from 'vue-baidu-map/components/controls/Control.vue'
import BmPolyline from 'vue-baidu-map/components/overlays/Polyline.vue'
import BmPolygon from 'vue-baidu-map/components/overlays/Polygon.vue'
import BmInfoWindow from 'vue-baidu-map/components/overlays/InfoWindow.vue'
import BmTransit from 'vue-baidu-map/components/search/Transit.vue'
import BmDriving from 'vue-baidu-map/components/search/Driving.vue'
import BmWalking from 'vue-baidu-map/components/search/Walking.vue'
import BmTile from 'vue-baidu-map/components/layers/Tile.vue'
import Bus from '@/tools/bus'
import storage from 'good-storage'
import { mapGetters, mapMutations } from 'vuex'
import { __getCenter } from '@/tools'
import './DistanceTool_min.js'

var MYDIS = null;

export default {
  components: {
    BaiduMap,
    BmNavigation,
    BmMarker,
    BmPolygon,
    BmLabel,
    BmInfoWindow,
    BmTransit,
    BmDriving,
    BmWalking,
    BmTile
  },

  data () {
    return {
      offsetNav: {width: 30, height: 100},
      zoom: 3,
      signFlag: false,
      busWay: false,
      drivingWay: false,
      walkingWay: false,
      bikeWay: false,
      cursorFlag: 'pointer',
      signPoints: [],
      hoverBuilding: null,
      center: {lng: 0, lat: 0},
      lablePointer: null,
      polygon : [],
      labelStyle: {
        color: 'red',
        fontSize : '14px',
        borderRadius : '2px',
        padding: '4px',
        textAlign: 'center',
        width: '90px',
        whiteSpace: 'normal'
      },
      infoWindow: {
        show: true,
        contents: '123qweq'
      }
    }
  },

  computed: {
    tilesUrl() {
      return ip
    },

    ...mapGetters(['currentCampus', 'informations', 'buildings', 'currentBuilding', 'mapZoom', 'currentTip', 'startPos', 'endPos', 'wayFlag', 'transitType'])
  },

  mounted() {
    Bus.$on('useTape', this.__useTape);
    Bus.$on('useSign', this.__useSign);
    Bus.$on('useLabel', this.__useLabel);
  },

  //清除Bus监听
  beforeDestroy() {
    Bus.$off('useTape');
    Bus.$off('useSign');
    Bus.$off('useLabel');
  },

  watch: {
    currentCampus(value) {
      let path = JSON.parse(value.position)
      this.center = __getCenter(path)
    },

    signFlag(newVal) {
      this.cursorFlag = newVal ? 'default' : 'pointer'
    },

    wayFlag(newVal) {
      if(newVal) {
        switch(this.transitType) {
          case 0:
            this.busWay = true
            break;
          case 1:
            this.drivingWay = true
            break;
          case 2:
            this.walkingWay = true
            break;
          case 3:
            this.bikeWay = true
            break;
        }
      }else{
        this.busWay = false
        this.drivingWay = false
        this.walkingWay = false
        this.bikeWay = false
      }
    },

    'hoverBuilding' : {
      handler(newVal) {
        if(newVal !== null){
          this.polygon = JSON.parse(newVal.position)
          this.lablePointer = __getCenter(JSON.parse(newVal.position))
        }
      },
      deep: true
    },

    'informations' : {
      handler(newVal) {
        
      },
      deep: true
    },

    'currentTip' : {
      handler(newVal) {
        if(newVal !== null){
          this.center = newVal.location
        }
      },
      deep: true
    },
  },

  methods: {
    hiddenGuide(e) {
      let inputs = document.getElementsByTagName('input')
      for(let i=0; i<inputs.length; i++) {
        inputs[i].blur()
      }
      this.$emit('hiddenGuide')

      if (this.signFlag) {
        let position = e.point;
        let pointer = Object.assign({contents: '', show: true},{position})
        this.signPoints.push(pointer);
        this.signFlag = false;
        return;
      }
    },

    handler ({BMap, map}) {
      if(this.currentCampus === null) {
        this.center.lng = 116.404
        this.center.lat = 39.915
        this.zoom = 14
        return
      }
      let path = JSON.parse(this.currentCampus.position)
      this.center = __getCenter(path)
      MYDIS = new BMapLib.DistanceTool(map);
      map.minZoom = 14
      map.maxZoom = 19
      this.zoom = 14
      // var geolocation = new BMap.Geolocation();
      // geolocation.getCurrentPosition(function(r){
      //     if(this.getStatus() == BMAP_STATUS_SUCCESS){
      //         var mk = new BMap.Marker(r.point);
      //         map.addOverlay(mk);
      //         map.panTo(r.point);
      //         alert('您的位置：'+r.point.lng+','+r.point.lat);
      //     }else {
      //         alert('failed'+this.getStatus());
      //     }
      // },{enableHighAccuracy: true})
      //this.zoom = 17
    },

    infoShow (item) {
      this.setCurrentInformation(item)
      this.$emit('infoShow')
    },

    infoBuilding () {
      this.setCurrentBuilding(this.hoverBuilding)
      this.$emit('infoShow')
    },

    clearInfo (item) {
      item.contents = ''
    },

    delSign (index) {
      this.signPoints.splice(index, 1)
    },

    showMarkerInfo (item) {
      item.show = true
    },

    infoWindowClose (item) {
      item.show = false
    },

    infoWindowOpen () {

    },

    updatePolygonPath (e) {
      this.polygon = e.target.getPath();
    },

    getResult(e) {
      let element = e
      //let pathsStr = JSON.stringify(e.yr)
      this.$parent.leadFlag = true
      this.$nextTick(()=>{
        this.$parent.$refs.routes.$refs.container.innerHTML = ''
        this.$parent.$refs.routes.$refs.container.appendChild(element)
        this.$parent.$refs.routes.pathsLoaded = !this.$parent.$refs.routes.pathsLoaded
      })
      
      
      //storage.set('routes', e.yr[0])
      //this.setLeads(e.yr[0])
    },

    showBuilding(item) {
      this.hoverBuilding = item
    },

    __useTape() {
      MYDIS.open()
    },

    __useSign() {
      this.signFlag = true
    },

    paintMap (e) {
      if (this.polygon.editing) {
        const {paths} = this.polygon;
        paths.push(e.point);
        return;
      }

      if (this.position.editing) {
        this.position.point = e.point;
        return;
      }
      
      //!paths.length && paths.push([])
      //paths[paths.length - 1].push(e.point)
    },

    ...mapMutations({
      setCurrentInformation : 'SET_CURRENT_INFORMATION',
      setCurrentBuilding : 'SET_CURRENT_BUILDING',
      setLeads : 'SET_LEADS'
    })
  }
}
</script>

<style lang="stylus" scoped>
.bm-view
  width: 100%
  height: 110%

  .text-box
    resize: none
    height: 60px
    width: 214px

  .opera-wrapper
    margin-top: 4px

  .btn
    padding: 0px 10px
    height: 24px
    font-size: 14px
    line-height: 24px
    background: #a40005
    border: none
    borderRadius: 2px
    margin-right: 10px
    cursor: pointer
    color: #fff
    width: auto
    letter-spacing: 2px

</style>
