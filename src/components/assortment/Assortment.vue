<template>
	<div class="container-box">
		<div class="content-box">
      <div class="party out-box" ref="party">
      	<ul class="item-wrapper">
      		<li v-for="(item, index) in slideList" ref="pItem" @click="checkInfo(item, index)">
      			<figure class="item" :class="{'active' : index === pIndex }">
						  <img :src="urlHeader + (item.imagePath ? item.imagePath : item.logoUrl)" width="60" height="60">
						  <figcaption>{{item.name}}</figcaption>
						</figure>
      		</li>
      	</ul>
      </div>
    </div>
	</div>
</template>
<script type="text/javascript">
import BScroll from 'better-scroll'
import { mapGetters, mapMutations } from 'vuex'
import { ip } from '@/api'

export default {
	data () {
	 	return {
	 		pIndex: -1,
	 		initParWidth: 0,
	 		firstFlag: true,
	 		outWidth: 400
	 	}
	},

	mounted () {
		this.$nextTick(() => {
			let pWidth = 0;
			
			for (let i = 0; i < this.slideList.length; i++) {
		    pWidth +=this.$refs.pItem[0].getBoundingClientRect().width; //getBoundingClientRect() 返回元素的大小及其相对于视口的位置
		  }

		  this.initParWidth = pWidth;
			this.$refs.party.getElementsByTagName('ul')[0].style.width = pWidth - this.outWidth + 'px';

			if(!this.partyScroll) {
				this.partyScroll = new BScroll(this.$refs.party, {
					scrollX: true,
					scrollY: false, 
					click: true, 
					resizePolling: 60, 
					bounce: true 
				})
			}else{
				this.partyScroll.refresh()
			}
		}),

		window.onresize = ()=>{
			if (!this.timer) {
        this.timer = true
        let that = this
        setTimeout(function () {
        		let partyDom = that.$refs.party.getElementsByTagName('ul')[0];
            partyDom.style.width = that.initParWidth + 'px';
						that.partyScroll.refresh()
            that.timer = false
        }, 400)
    	}
		}
	},

	computed: {
		urlHeader() {
			return ip;
		},

		slideList() {
			return this.parties.concat(this.informationTypes);
		},

		...mapGetters(['informationTypes', 'currentInformationType', 'parties', 'currentParty'])
	},

	methods: {

 		checkInfo(item, index) {
 			this.pIndex = index
 			if(item.imagePath) {
 				this.setInformations([])
 				this.setCurrentParty(item)
 			}
 			if(item.logoUrl) {
 				this.setGuides([])
 				this.setCurrentInformationType(item)
 			}
 			if(this.firstFlag) {
 				let partyDom = this.$refs.party.getElementsByTagName('ul')[0]
        partyDom.style.width = this.initParWidth + 'px'
				this.partyScroll.refresh()
				this.firstFlag = false
 			}
 		},

 		...mapMutations({
 			setCurrentInformationType : 'SET_CURRENT_INFORMATION_TYPE',
 			setCurrentParty : 'SET_CURRENT_PARTY',
 			setInformations : 'SET_INFORMATIONS',
 			setGuides : 'SET_GUIDES',
 		})
 	}
}
</script>
<style lang="stylus" scoped>
.container-box
	float: left
	width: 400px
	height: 100%

	.content-box
		height: 100%
		position: relative

		.party
			position: absolute
			top: 0
			left: 0

		.out-box
			height: 100%
			width: 100%
			overflow: hidden

			.item-wrapper
				white-space: nowrap
				min-width: 100%
				font-size: 0

				li
					display: inline-block
					text-align: center
					width: 80px
					height: 150px
					cursor: pointer
					font-size: 16px

					.item:hover
						color: #a40005
						box-shadow: 2px 2px 5px #333

					.item
						padding-top: 30px
						padding-bottom: 10px

						img
							margin-bottom: 20px

					.active
						color: #a40005
						box-shadow: 2px 2px 5px #333
</style>