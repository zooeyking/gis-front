<template>
  <div class="container">
  	<div class="input-box" v-if="showFlag">
  		<span class="input-wrapper"><input type="text" v-model="params" placeholder="建筑\机构\地点" @focus.stop="showGuide"></span>
  		<span class="clear-box" v-show="clearFlag" @click="clearParams"><font-awesome-icon class="input-clear" :icon="['far','times-circle']"/></span>
  	</div>
  	<div class="transport-box" v-else>
  		<div class="content">
  			<span class="logo-wrapper" :class="{'active' : transitType === 0 }" @click.stop="changeIndex(0)"><font-awesome-icon class="logo" :icon="['fas','bus']"/>公交</span>
	  		<span class="logo-wrapper" :class="{'active' : transitType === 1 }" @click.stop="changeIndex(1)"><font-awesome-icon class="logo" :icon="['fas','car']"/>驾车</span>
	  		<span class="logo-wrapper" :class="{'active' : transitType === 2 }" @click.stop="changeIndex(2)"><font-awesome-icon class="logo" :icon="['fas','bicycle']"/>骑车</span>
	  		<span class="logo-wrapper" :class="{'active' : transitType === 3 }" @click.stop="changeIndex(3)"><font-awesome-icon class="logo" :icon="['fas','walking']"/>步行</span>
  		</div>
  	</div>
  	<i class="split-line"></i>
  	<span class="path-box" @click.stop="changeFlag"><font-awesome-icon class="path-change" :icon="['fas',toggleCls ]"/></span>
    <span class="icon-wrapper" @click="searchWay"><font-awesome-icon class="search" :icon="['fas','search']"/></span>
  </div>
</template>
<script type="text/javascript">
import { mapGetters, mapMutations } from 'vuex'

export default {
  data () {
    return {
    	showFlag: true,
    	toggleCls: 'level-up-alt',
    	clearFlag: false,
    }
  },

  computed: {
    params: {
        get () {
          return this.$store.state.searchParams
        },
        set (value) {
          this.$store.commit('SET_SEARCH_PARAMS', value)
        }
    },

    ...mapGetters(['transitType'])
  },

  methods: {
  	changeFlag() {
  		this.toggleCls = this.toggleCls === 'times' ? 'level-up-alt' : 'times';
  		this.showFlag = !this.showFlag;
  		if(!this.showFlag) {
  			this.$emit('hiddenGuide')
  			this.$emit('showTransport')
  		}else{
  			this.$emit('hiddenTransport')
        this.setStartPos(null)
        this.setEndPos(null)
  		}
  	},

  	changeIndex(index) {
      this.setWayFlag(false)
  		this.setTransitType(index);
  	},

  	showGuide(event) {
  		if(event.target.value === ''){
  			this.$emit('showGuide')
  		}else{
        this.$emit('hiddenGuide')
      }
  	},

  	hiddenGuide(event) {
  		this.$emit('hiddenGuide')
  	},

  	clearParams() {
  		this.$store.commit('SET_SEARCH_PARAMS', '')
  	},

    searchWay() {
      this.setWayFlag(true)
      this.setCurrentTip(null)
    },

    ...mapMutations({
      setStartPos : 'SET_START_POS',
      setEndPos : 'SET_END_POS',
      setTransitType : 'SET_TRANSIT_TYPE',
      setWayFlag : 'SET_WAY_FLAG',
      setCurrentTip : 'SET_CURRENT_TIP',
    })

  },

  watch: {
  	params(value) {
      console.log(value)
      if(value === null) {
        this.clearFlag = false;
        this.$emit('toggleLocusFlag', false)
      }else if(value.length === 0 ) {
  			this.clearFlag = false;
  			this.$emit('toggleLocusFlag', true)
  		}else{
  			this.clearFlag = true;
  			this.$emit('toggleLocusFlag', false)
  		}
  	}
  }
}
</script>
<style lang="stylus" scoped>
.container
	font-size: 0
	box-shadow: 0px 3px 2px #969696;
	background: #fff

	.split-line
		margin: 10px 0
		display: inline-block
		vertical-align: top
		width: 1px
		height: 20px
		background: #999

	.input-box
		display: inline-block
		width: 350px
		height: 40px
		background: #fff
		border: none

		.clear-box,.path-box
			padding: 10px
			display: inline-block
			cursor: pointer
			vertical-align: top
			text-align: center
			height: 20px
			width: 20px

		.opcityFlag
			opacity: 0

		.input-clear,.path-change
			color: #a40005
			font-size: 20px

		.input-wrapper
			display: inline-block
			height: 30px
			padding: 5px 0 5px 10px

			input
				background: rgba(0,0,0,0)
				border: none
				padding: 0 !important
				color: #a40005
				width: 300px
				height: 30px
				font-size: 16px
				line-height: 30px

			input:focus
				outline: none
				border: none

			input::-webkit-input-placeholder
				color: #cdcdcd
				  
			input:-moz-placeholder
				color: #cdcdcd
			  
			input::-moz-placeholder
				color: #cdcdcd
			  
			input:-ms-input-placeholder
				color: #cdcdcd

	.icon-wrapper
		display: inline-block
		vertical-align: top
		text-align: center
		width: 50px
		height: 40px
		background: #a40005
		cursor: pointer

		.search
			color: #fff
			font-size: 18px
			padding-top: 12px

	.path-box
		width: 40px
		height: 40px
		display: inline-block
		line-height: 40px
		font-size: 20px
		color: #a40005
		text-align: center
		background: #fff
		vertical-align: top
		cursor: pointer

	.transport-box
		display: inline-block
		width: 350px
		height: 40px
		background: #fff
		border: none

		.content
			width: 350px
			height: 40px
			float: left
			display: flex
			color: #cdcdcd
			justify-content: space-around
			cursor: pointer

			span:hover
				color: #a40005

			span
				display: inline-block
				width: 60px
				height: 40px
				font-size: 16px
				line-height: 40px

				.logo
					margin-right: 8px

			.active
				color: #a40005
</style>
