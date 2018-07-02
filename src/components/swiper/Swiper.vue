<template>
	<swiper class="outer-box" :options="swiperOption">
		<!-- slides -->
    <swiper-slide v-for="(item, index) in buildingImgList" :key="index">
      <img :src="item">
    </swiper-slide>
    <!-- Optional controls -->
    <div class="swiper-pagination"  slot="pagination"></div>
    <div class="swiper-button-prev" slot="button-prev" @click="toPrev"></div>
    <div class="swiper-button-next" slot="button-next" @click="toNext"></div>
    <div class="swiper-scrollbar"   slot="scrollbar"></div>
	</swiper>
</template>
<script type="text/javascript">
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { mapGetters, mapMutations } from 'vuex'

export default {
	components: {
    swiper,
    swiperSlide
  },
  data () {
  	return {
  		swiperOption: {//以下配置不懂的，可以去swiper官网看api，链接http://www.swiper.com.cn/api/
        // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，<br>　　假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
        notNextTick: false,
        // swiper configs 所有的配置同swiper官方api配置
        autoplay: true,
        loop: true,
        direction: 'horizontal',
        grabCursor: true,
        setWrapperSize: true,
        autoHeight: true,
        pagination: {
          el: '.swiper-pagination'
        },
        paginationClickable: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        keyboard: true,
        scrollbar: '.swiper-scrollbar',//滚动条
        mousewheelControl: true,
        observeParents: true,
        // 如果自行设计了插件，那么插件的一些配置相关参数，也应该出现在这个对象中，如下debugger
        debugger: true,
      }
  	}
  },

  computed: {
    ...mapGetters([
      'buildingImgList'
      ])
  },

  methods: {
  	toPrev () {
  		console.log('prev')
  	},
  	toNext () {
  		console.log('next')
  	}
  }
}
</script>
<style lang="stylus" scoped>

</style>
