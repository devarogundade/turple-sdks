<template>

</template>

<script>
import AdViewAPI from './script'
export default {
    props: ['subid', 'adid'],
    methods: {
        loadAd: async function () {
            const ad = await AdViewAPI.loadAd(this.subid)
            console.log(ad);
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