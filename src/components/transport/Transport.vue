<template>
  <div class="container">
  	<div class="switch-box">
  		<span class="logo-wrapper" @click="switchTrs"><font-awesome-icon class="logo" :icon="['fas','exchange-alt']"/></span>
  	</div>
  	<div class="form-wrapper">
  		<ul>
        <li>
          <font-awesome-icon class="logo start" :icon="['fas', 'genderless']"/>
          <span class="in-wrapper"><input type="text" placeholder="输入起点位置" ref="startInput" v-model="startName" @focus="setLocationType(1)"></span>
          <span class="clear-box" v-if="sFlag" @click="clearStart"><font-awesome-icon class="input-clear" :icon="['far','times-circle']"/></span>
        </li>
        <li>
          <font-awesome-icon class="logo end" :icon="['fas', 'genderless']"/>
          <span class="in-wrapper"><input type="text" placeholder="目的地" ref="endInput" v-model="endName" @focus="setLocationType(2)"></span>
          <span class="clear-box" v-if="eFlag" @click="clearEnd"><font-awesome-icon class="input-clear" :icon="['far','times-circle']"/></span>
        </li>
  		</ul>
  	</div>
    <tips v-if="tipsFlag" :isOption="false"></tips>
  </div>
</template>
<script type="text/javascript">
import BScroll from 'better-scroll'
import Tips from '@/components/tips/Tips'
import { mapGetters, mapMutations } from 'vuex'

export default {
	components: {
    Tips
	},

  data () {
    return {
    	startName : '',
      endName : '',
      sFlag : false,
      eFlag : false,
      tipsFlag : false,
      isHiddenTips : false,
      isSwitch : false
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

    ...mapGetters([
      'startPos',
      'endPos',
      'searchParams'
      ])
  },

  methods: {
  	setStart() {
      //this.setStartPos(this.start)
    },

    clearStart() {
      this.startName = ''
    },

    setEnd() {
      //this.setEndPos(this.end)
    },

    clearEnd() {
      this.endName = ''
    },

    switchTrs() {
      let temp = this.startPos
      this.setStartPos(this.endPos)
      this.setEndPos(temp)
      this.isSwitch = true
    },

    setLocationType(num) {
      this.setLocationType(num)
    },

    ...mapMutations({
      setStartPos : 'SET_START_POS',
      setEndPos : 'SET_END_POS',
      setSearchParams : 'SET_SEARCH_PARAMS',
      setLocationType : 'SET_LOCATION_TYPE',
    })
  },

  watch: {
    searchParams(newVal) {
      if(newVal.length > 0) {
        this.tipsFlag = true
      }
    },

  	'startPos' : {
      handler(newVal) {
        if(newVal !== null) {
          this.startName = newVal.name
          
        }else{
          this.startName = ''
        }
      },
      deep: true,
      immediate: true
    },

    'endPos' : {
      handler(newVal) {
        if(newVal !== null) {
          this.endName = newVal.name
          
        }else{
          this.endName = ''
        }
      },
      deep: true,
      immediate: true
    },

    'startName' : {
      handler(newVal) {
        this.sFlag = newVal.length > 0 ? true : false;
        if(this.isSwitch) {
          return
        }
        if(this.isHiddenTips) {
          this.setSearchParams('')
          this.tipsFlag = false
          this.isHiddenTips = false
        }else{
          this.setSearchParams(newVal)
        }
      },
      deep: true,
      immediate: true
    },

    'endName' : {
      handler(newVal) {
        this.eFlag = newVal.length > 0 ? true : false;
        if(this.isSwitch) {
          return
        }
        if(this.isHiddenTips) {
          this.setSearchParams('')
          this.tipsFlag = false
          this.isHiddenTips = false
        }else{
          this.setSearchParams(newVal)
        }
      },
      deep: true,
      immediate: true
    },
  },

  mounted() {
    this.$nextTick(()=>{
      if(this.sFlag) {
        this.$refs.endInput.focus()
      }else{
        this.$refs.startInput.focus()
      }
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

  .switch-box
    display: inline-block
    width: 40px
    height: 80px
    cursor: pointer
    text-align: center
    font-size: 16px
    line-height: 30px
    color: #a40005
    background: #fff

    .logo-wrapper
      display: inline-block
      line-height: 80px
      font-size: 20px
      transform: rotate(90deg);
      -ms-transform: rotate(90deg); /* Internet Explorer */
      -moz-transform: rotate(90deg); /* Firefox */
      -webkit-transform: rotate(90deg); /* Safari 和 Chrome */
      -o-transform: rotate(90deg); /* Opera */

  .form-wrapper
    display: inline-block
    vertical-align: top
    width: 310px
    height: 80px
    cursor: pointer
    text-align: center
    font-size: 16px
    line-height: 30px

    ul
      height: 80px

      li:first-child
        border-bottom: 1px solid #333

      li
        height: 40px
        text-align: left
        margin-left: 5px

        .logo
          display: inline-block
          line-height: 40px

        .start
          color: #3af2ab

        .end
          color: #fb7cba

        .in-wrapper
          display: inline-block
          height: 30px
          padding: 5px
          padding-right: 0

        input
          background: rgba(0,0,0,0);
          border: none;
          padding: 0 !important;
          color: #a40005;
          width: 255px;
          height: 30px;
          font-size: 16px;
          line-height: 30px;

        input:focus
          outline: none

        input::-webkit-input-placeholder
          color: #cdcdcd
            
        input:-moz-placeholder
          color: #cdcdcd
          
        input::-moz-placeholder
          color: #cdcdcd
          
        input:-ms-input-placeholder
          color: #cdcdcd

        .clear-box
          display: inline-block
          width: 26px
          height: 40px;
          vertical-align: top
          line-height: 40px;
          text-align: center;
          color: #a40005

</style>
