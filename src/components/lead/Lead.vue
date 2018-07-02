<template>
  <div class="container">
    <div ref="container">
    </div>
  </div>
</template>
<script type="text/javascript">
import { mapGetters, mapMutations } from 'vuex'
import storage from 'good-storage'

export default {
	data(){
    return {
      pathsLoaded: false
    }
  },

  computed: {
    
  },

  mounted() {
    // this.routes = storage.get('routes')
    // console.log(routes)
  },

  watch: {
    pathsLoaded() {
      let elements = this.$refs.container.querySelectorAll('.trans-title')
      let detailNodes = this.$refs.container.querySelectorAll('.trans_plan_desc')
      let length = elements.length
      for(let i=0; i<length; i++) {
        elements[i].addEventListener('click', function(){
          // for(let j=0; j<detailNodes.length; j++) {
          //   detailNodes[j].style.display = 'none'
          // }
          let currentStyle = this.nextSibling.style.display
          if(currentStyle === 'block') {
            this.nextSibling.style.display = 'none'
          }else{
            this.nextSibling.style.display = 'block'
          }

        })
      }
    }
  },

  methods: {

  }
}
</script>
<style lang="stylus" scoped>
.container
  font-size: 0
  width: 391px
  background: #fff
  box-shadow: 0px 3px 2px #969696
  max-height: 400px
  overflow: auto

  .tranroute-plan-list
    transition: all 0.5s
</style>