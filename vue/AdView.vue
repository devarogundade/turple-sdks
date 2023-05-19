<template>
    <div class="ad_view_container">
        <div class="ad_view" v-if="status == 'SUCCESS'">
            <div class="ad_player">
                <video :src="JSON.parse(ad.metadata).src" :controls="false" autoplay></video>
            </div>
        </div>
    </div>
</template>

<script>
import AdViewAPI from './script'
export default {
    props: ['subid', 'adid'],
    data() {
        return {
            ad: null,
            status: 'FETCHING'
        }
    },
    methods: {
        loadAd: async function () {
            this.status = 'FETCHING'
            const result = await AdViewAPI.loadAd(this.subid)
            if (result != null) {
                this.status = 'LOADED'
                //////////// todo
                // this.ad = result.data
                this.status = 'SUCCESS'
            } else {
                this.status = 'FAILED'
            }
        }
    },
    mounted() {
        if (this.subid == undefined || this.subid == '') {
            console.log('Invalid subid')
        }

        if (this.adid == undefined || this.adid == '') {
            console.log('Invalid adid')
        }
    }
}
</script>