<template>
	<div class="content-box">
		<slot></slot>
		<h3 class="title" v-if="currentInformation" >{{currentInformation.name}}</h3>
		<h3 class="title" v-else >{{currentBuilding.name}}</h3>
		<article class="text" v-if="currentInformation" v-html="currentInformation.content">
			{{currentInformation.content}}
		</article>
		<article class="text" v-else >
			{{currentBuilding.descp}}
		</article>
		<div v-if="buildingImgList.length > 0" class="swiper-wrapper">
			<swiper></swiper>
		</div>
	</div>
</template>
<script type="text/javascript">
import Swiper from "@/components/swiper/Swiper"
import { mapGetters, mapMutations } from 'vuex'

export default {
	components: {
		Swiper
	},
	mounted () {
		
	},
	computed: {
		...mapGetters(['currentInformation', 'currentBuilding', 'buildingImgList'])
	}
}
</script>
<style lang="stylus" scoped>
.content-box
	width: 100%
	height: 100%
	color: #fff
	text-align: center
	background: #a40005

	.title
		font-weight: bolder
		height: 80px
		line-height: 80px
		font-size: 20px
		letter-spacing: 1px

	.text
		padding: 20px
		font-size: 16px
		text-align: left
		text-indent: 2rem

	.swiper-wrapper
		position: absolute
		bottom: 5%
		height: 300px
		width: 100%
		margin: 0 auto
		background: #369
</style>
