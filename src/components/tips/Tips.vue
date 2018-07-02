<template>
  <div class="container">
    <ul v-if="!tipsShow">
      <li v-for="(item, index) in tips" :key="index" @click="setLocation(item)"><span class="icon-wrapper"><font-awesome-icon :icon="['fas','search']"/></span>{{item.name}}</li>
    </ul>
    <div v-if="tipsShow && isOption" class="tip-box">
      <div class="building-box">
        <div class="title"><font-awesome-icon class="icon" :icon="['fas','university']"/>{{currentTip !== null ? currentTip.name : ''}}</div>
        <div class="district"><font-awesome-icon class="icon" :icon="['fas','map-marker-alt']"/>{{currentTip !== null ? currentTip.district : ''}}</div> -->
      </div>
      <div class="options">
        <span @click="setStart"><font-awesome-icon class="icon" :icon="['fas','sign-out-alt']"/>由此出发</span>
        <span @click="setEnd"><font-awesome-icon class="icon" :icon="['fas','sign-in-alt']"/>到此地去</span>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    isOption : {
      type: Boolean,
      default: true
    }
  },

	data(){
    return {
      tipsShow : false
    }
  },

  computed: {
    ...mapGetters([
      'tips',
      'currentTip',
      'searchParams',
      'startPos',
      'endPos',
      'locationType'
      ])
  },

  watch: {
    searchParams(newVal) {
      this.tipsShow = false
    }
  },

  methods: {
    setLocation(item) {
      if(this.isOption) {
        this.tipsShow = true
        this.$parent.localsFlag = false
      }else{
        if(this.locationType === 1) {
          this.setStartPos(item)
        }else if(this.locationType === 2){
          this.setEndPos(item)
        }
        //this.setSearchParams('')
        this.$parent.isHiddenTips = true
      }
      this.setCurrentTip(item)
    },

    setStart() {
      this.$parent.$refs.search.changeFlag()
      this.$parent.tipsFlag = false
      //this.setSearchParams('')
      this.setStartPos(Object.assign({}, this.currentTip))
    },

    setEnd() {
      this.$parent.$refs.search.changeFlag()
      this.$parent.tipsFlag = false
      //this.setSearchParams('')
      this.setEndPos(Object.assign({}, this.currentTip))
    },

    ...mapMutations({
      setCurrentTip : 'SET_CURRENT_TIP',
      setSearchParams : 'SET_SEARCH_PARAMS',
      setStartPos : 'SET_START_POS',
      setEndPos : 'SET_END_POS'
    })
  }
}
</script>
<style lang="stylus" scoped>
.container
  font-size: 0
  width: 391px
  padding: 0 0 10px
  background: #fff
  border-top: 1px solid #999
  box-shadow: 0px 3px 2px #969696;

  li:hover
    background: #a40005
    color: #fff

  li
    height: 30px
    line-height: 30px
    font-size: 14px
    color: #333
    cursor: pointer

    .icon-wrapper
      display: inline-block
      width: 30px
      height: 30px
      text-align: center

  .tip-box
    height: 80px
    padding: 15px
    padding-bottom: 10px
    background: #a40005
    color: #fdfdfd
    margin-top: 10px

    .building-box
      box-sizing: border-box
      display: inline-block
      width: 70%
      height: 80px
      vertical-align: top
      padding-right: 10px

      .icon
        margin-right: 10px

    .title
      font-size: 18px
      vertical-align: top
      height: 60px

    .district
      font-size: 14px
      vertical-align: top
      height: 20px

    .options
      display: inline-block
      font-size: 16px
      width: 30%
      height: 80px
      vertical-align: top

      span:hover
        background: #fdfdfd
        color: #a40005

      span
        display: block
        height: 30px
        line-height: 30px
        margin-bottom: 10px
        border: 1px solid #fdfdfd
        border-radius: 4px
        padding-left: 5px
        cursor: pointer

        .icon
          margin-right: 10px
</style>