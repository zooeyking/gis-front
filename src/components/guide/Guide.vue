<template>
  <ul class="container">
    <li v-for="(item, index) in guides" :key="index" :class="{'active' : selectedIndex === index}" @click="selected(item, index)"><span class="icon-wrapper"><font-awesome-icon :icon="['fas','arrow-right']"/></span>{{item.name}}</li>
  </ul>
</template>
<script type="text/javascript">
import { mapGetters, mapMutations } from 'vuex'

export default {
	data(){
    return {
      selectedIndex : -1,
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
      'guides'
    ])
  },

  watch: {
    
  },

  methods: {
    selected (item, index) {
      this.selectedIndex = index
      this.setCurrentGuide(item)
    },

    ...mapMutations({
      setCurrentGuide : 'SET_CURRENT_GUIDE'
    })
  }
}
</script>
<style lang="stylus" scoped>
.container
  font-size: 0
  width: 200px
  padding: 20px
  padding-left: 0
  background: #fff
  border-top: 1px solid #999
  border-radius: 0 4px 4px 0
  box-shadow: 0px 3px 2px #969696;

  li:hover
    background: #a40005
    color: #fff

  .active
    background: #a40005
    color: #fff
    box-shadow: 2px 2px 5px #333

  li
    height: 40px
    line-height: 40px
    font-size: 14px
    color: #333
    cursor: pointer
    border-bottom: 1px solid #666

    .icon-wrapper
      display: inline-block
      width: 30px
      height: 30px
      text-align: center

</style>