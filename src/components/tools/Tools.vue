<template>
  <div class="container">
  	<div class="title-box">
  		<span class="logo-wrapper" @click="switchTrs()"><font-awesome-icon class="logo-case" :icon="['fas','toolbox']"/>工具箱<font-awesome-icon class="logo-arrow" :icon="['fas', arrowIcon]"/></span>
  	</div>
    <transition name="slide">
      <ul class="tools-wrapper" v-if="showFlag">
        <li @click="selectedTool(1)">
          <span class="icon"><font-awesome-icon :icon="['fas','tape']"/></span>测距
        </li>
        <li @click="selectedTool(2)">
          <span class="icon"><font-awesome-icon class="icon" :icon="['fas','map-pin']"/></span>点标记
        </li>
        <!-- <li @click="selectedTool(3)">
          <span class="icon"><font-awesome-icon class="icon" :icon="['fas','font']"/></span>文字注释
        </li> -->
      </ul>
    </transition>
  </div>
</template>
<script type="text/javascript">
import BScroll from 'better-scroll'
import Bus from '@/tools/bus'
import { mapGetters, mapMutations } from 'vuex'

export default {
	components: {

	},

  data () {
    return {
    	arrowIcon: 'chevron-up',
      showFlag: false
    }
  },

  computed: {
    ...mapGetters(['toolType'])
  },

  methods: {
  	switchTrs() {
      this.arrowIcon = this.arrowIcon === 'chevron-up' ? 'chevron-down' : 'chevron-up';
      this.showFlag = !this.showFlag;
    },
    selectedTool(index) {
      this.showFlag = false
      switch(index) {
        case 1:
          Bus.$emit('useTape')
          break;
        case 2:
          Bus.$emit('useSign')
          break;
        case 3:
          Bus.$emit('useLabel')
          break;
        default:
          return false;
      }
    },

    ...mapMutations({
      setToolType : 'SET_TOOL_TYPE'
    })
  },

  watch: {
  	selected() {

  	}
  },

  mounted() {
    
  }
}
</script>

<style lang="stylus" scoped>
.container
  font-size: 14px
  background: #fff
  border-radius: 2px

  .title-box:hover
    color: #a40005

  .title-box
    height: 30px
    padding: 0 10px
    line-height: 30px
    letter-spacing: 2px
    cursor: pointer

  .logo-case
    margin-right: 5px

  .logo-arrow
    margin-left: 5px

  .tools-wrapper
    height: 70px

    li:hover
      color: #a40005

    li
      height: 30px
      font-size: 14px
      line-height: 30px
      padding: 0 10px
      cursor: pointer

      .icon
        display: inline-block
        width: 20px
        font-size: 14px
        text-align: left
        margin-right: 5px

  .slide-enter-active, .slide-leave-active
    transition: all .3s

  .slide-enter, .slide-leave-to
    height: 0
    opacity: 0
</style>
