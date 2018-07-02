<template>
  <div class="container">
  	<ul>
      <li v-for="(item,index) in campus" :class="{'active': campusIndex === index}" @click="changeCampus(index,item)">{{item.name}}</li>
    </ul>
  </div>
</template>
<script type="text/javascript">
import { mapGetters, mapMutations } from 'vuex'

export default {
	components: {

	},

  data () {
    return {
    	// campus: [
     //    {name: '浦东校区'},
     //    {name: '张江校区'},
     //    {name: '闵行校区'},
     //    {name: '啦啦啦...'},
     //  ],
      campusIndex: 0
    }
  },

  methods: {
  	changeCampus(index,item) {
      this.campusIndex = index
      this.setCurrentCampus(item)
    },
    ...mapMutations({
      setCurrentCampus : 'SET_CURRENT_CAMPUS'
    })
  },

  watch: {
  	selected() {

  	}
  },

  mounted() {
    
  },

  computed: {
    ...mapGetters(['campus'])
  }
}
</script>

<style lang="stylus" scoped>
.container
  font-size: 0
  background: #fff
  width: 40px

  ul
    li
      font-size: 14px
      width: 20px
      word-wrap: break-word
      letter-spacing: 10px
      line-height: 18px
      padding: 10px
      border-bottom: 1px solid #a40005
      cursor: pointer

      &:last-child
        border-bottom: none

    .active
      background: #a40005
      color: #fff

</style>
