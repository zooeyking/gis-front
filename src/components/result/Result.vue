<template>
  <div class="container" @click="showGuide">
  	<div class="tab-box">
  		<h3 :class="selected===0 ? 'active' : ''" @click="tabChange(0)">建筑列表</h3>
  		<h3 :class="selected===1 ? 'active' : ''" @click="tabChange(1)">机构列表</h3>
  	</div>
  	<div class="tab-container" ref="tab">
  		<div>
  			<vue-tree 

        ref="tree" 
        v-model="checkedIds" 
        :tree-data="treeData" 
        :options="options" 
        :tabChanged="tabChanged"
        @handle="handle"

        ></vue-tree>
  		</div>
  	</div>
  </div>
</template>
<script type="text/javascript">
import VueTree from 'vue-simple-tree/src/components/VueTree.vue'
import BScroll from 'better-scroll'
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    treeBuildingData: {
      type: Array,
      default() {
        return []
      }
    },
    treeAgencyData: {
      type: Array,
      default() {
        return []
      }
    }
  },

	components: {
		VueTree
	},

  data () {
    return {
    	selected: 0,
    	toggleIcon: 'plus',
    	toggleIndex: 100,
    	categorys: [1,2,3,4,5,6],
    	checkedIds: [],
    	options: {
        label: 'name'
      },
      tabChanged: false,
    	treeData: []
    }
  },

  computed: {
    ...mapGetters([
      'buildingTypes',
      'agencyTypes',
      'buildings',
      'agencies'
      ])
  },

  methods: {

    showGuide() {
      this.$emit('showGuide')
    },

  	tabChange(index) {
      this.tabChanged = !this.tabChanged;
  		this.selected = index
      if(index === 0) {
        this.treeData = this.treeBuildingData
      }else if(index === 1) {
        this.treeData = this.treeAgencyData
      }
  	},

    handle(item) {

      if (item.position && item.position.length > 50) {
        this.setCurrentBuilding(item)
        this.setMapZoom(18)
        this.setSearchParams(item.name)
      }else if(item.architeEntity) {
        this.setCurrentBuilding(item.architeEntity)
        this.setMapZoom(18)
        this.setSearchParams(item.name)
      }

    },

    ...mapMutations({
      setCurrentBuilding : 'SET_CURRENT_BUILDING',
      setSearchParams : 'SET_SEARCH_PARAMS',
      setMapZoom : 'SET_MAP_ZOOM'
    })
  },

  watch: {
  	selected() {

  	}
  },

  mounted() {
    this.treeData = this.treeBuildingData;
    this.$nextTick(() => {
      this.$refs.tab.style['max-height'] = 400 + 'px'
      this.$refs.tab.style['overflow'] = 'hidden'
      this.listScroll = new BScroll(this.$refs.tab, {
        scrollX: false,
        scrollY: true, 
        click: true, 
        resizePolling: 60, 
        bounce: true 
      })
    })
  }
}
</script>

<style lang="stylus" scoped>
.container
	font-size: 0
	width: 391px
	background: #fff
	border-top: 1px solid #333
	box-shadow: 0px 3px 2px #969696;

	.tab-box h3
		display: inline-block
		width: 50%
		height: 30px
		cursor: pointer
		text-align: center
		font-size: 16px
		line-height: 30px
		color: #fff
		background: #a40005

		&.active
			background: #fff
			color: #333

	.tab-container
		font-size: 14px

		ul.out-wrapper>li
			padding-left: 10px
			cursor: pointer
			font-size: 16px
			line-height: 30px

		.title-icon
			margin-right: 10px

		.inner-wrapper
			padding-left: 20px
			overflow: hidden

			li
				padding-left: 4px
				background: #a40005
				color: #fff

		.slide-enter-active, .slide-leave-active
			transition: all .5s

		.slide-enter, .slide-leave-to
			height: 0

</style>
