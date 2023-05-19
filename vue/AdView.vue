<template>
    <div class="ad_view_container">
        <div class="progress" v-if="'FETCHING'">
            <ProgressBox />
        </div>
        <div class="error" v-if="'ERROR'">
            <P>Failed to load Ads</P>
        </div>
        <div class="ad_view" v-if="status == 'SUCCESS'">
            <div class="ad_player">
                <video ref="videoPlayer" class="video-js"></video>
                <div class="content">
                    <p class="name">{{ JSON.parse(ad.metadata).name }}</p>

                    <a :href="JSON.parse(ad.metadata).link" target="_blank">
                        <PrimaryButton :text="'Open'" v-on:click="adClicked()" />
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { randomInt } from 'crypto';
import PrimaryButton from './PrimaryButton.vue';
import ProgressBox from './ProgressBox.vue'
import AdViewAPI from './script'
import videojs from 'video.js'

export default {
    props: ["subid", "adid"],
    data() {
        return {
            ad: null,
            status: "FETCHING",
            player: null,
            WATCHFEE: 1,
            CLICKFEE: 2.5,
        };
    },
    methods: {
        loadAd: async function () {
            this.status = "FETCHING";
            const result = await AdViewAPI.loadAd(this.subid);
            if (result != null) {
                this.status = "LOADED";

                const rand = randomInt(result.length - 1)
                this.ad = result[rand]

                const options = {
                    autoplay: true,
                    controls: false,
                    loop: true,
                    sources: [
                        {
                            src: `https://media.thetavideoapi.com/${JSON.parse(ad.metadata).videoId}/master.m3u8`,
                            type: "application/x-mpegurl"
                        }
                    ]
                };

                this.player = videojs(this.$refs.videoPlayer, options, () => {
                    this.player.log("onPlayerReady", this);
                });

                this.player.on('ended', () => {
                    AdViewAPI.onAdSuccessfulWatch(this.adid, this.subid)
                })

                this.status = "SUCCESS";
            }
            else {
                this.status = "FAILED";
            }
        },
        adClicked: async function () {
            AdViewAPI.onAdClicked(this.adid, this.subid)
        }
    },
    mounted() {
        if (this.subid == undefined || this.subid == "") {
            console.log("Invalid subid");
        }
        if (this.adid == undefined || this.adid == "") {
            console.log("Invalid adid");
        }
    },
    components: { ProgressBox, PrimaryButton }
}
</script>

<style scoped>
.ad_view_container {
    width: 200px;
    height: 300px;
    border-radius: 12px;
    overflow: hidden;
}

.progress {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}
</style>