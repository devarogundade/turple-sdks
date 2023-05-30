<template>
    <div class="ad_view_container">
        <p v-if="noads">No ADS</p>
        <div class="progress" v-show="state == 'FETCHING'">
            <ProgressBox />
        </div>
        <div class="ad_view" v-show="status == 'SUCCESS'">
            <PrimaryButton v-if="!adSkipped" :text="'Skip Ad'" :width="'150px'" v-on:click="skipAd()" class="skip_btn" />
            <div class="ad_player">
                <video :controls="adSkipped" ref="videoPlayer" class="video-js"></video>
                <div class="content" v-if="ad">
                    <div>
                        <p class="name">{{ JSON.parse(ad.metadata).name }}</p>
                        <a :href="JSON.parse(ad.metadata).link" target="_blank">
                            <PrimaryButton :width="'180px'" :text="'Visit'" v-on:click="adClicked()" />
                        </a>
                    </div>
                    <div class="powered">
                        <p>Powered by <span>Turple</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PrimaryButton from './PrimaryButton.vue'
import ProgressBox from './ProgressBox.vue'
import AdViewAPI from './script'
import videojs from 'video.js'
import videoJsContribAds from 'videojs-contrib-ads'

export default {
    props: ["subid", "src"],
    data() {
        return {
            ad: null,
            status: "FETCHING",
            player: null,
            WATCHFEE: 1,
            CLICKFEE: 2.5,
            adSkipped: false,
            noads: false
        };
    },
    methods: {
        skipAd: async function () {
            this.player.src(this.src)
            this.adSkipped = true
            AdViewAPI.onAdSuccessfulWatch(this.ad.adId, this.subid, this.WATCHFEE)
        },

        loadAd: async function () {
            this.status = "FETCHING";
            const result = await AdViewAPI.loadAd(this.subid);
            const ads = result.data

            if (ads != null && ads.length > 0) {
                const random = Math.floor(Math.random() * ads.length)
                this.ad = ads[random]

                const options = {
                    autoplay: true,
                    loop: false,
                    sources: [{
                        src: `https://media.thetavideoapi.com/${JSON.parse(this.ad.metadata).videoId}/master.m3u8`,
                        type: 'application/x-mpegurl'
                    }]
                };

                videojs.registerPlugin("ads", videoJsContribAds)

                this.player = videojs(this.$refs.videoPlayer, options, () => { });

                this.player.ads({ timeout: 5000 })

                this.player.on('contentchanged', function () {
                    this.trigger('adsready');
                })

                const context = this

                this.player.on('readyforpreroll', function () {
                    // play your linear ad content
                    this.ads.startLinearAdMode();

                    // send event when ad is playing to remove loading spinner
                    this.one('adplaying', function () {
                        this.trigger('ads-ad-started');
                    });

                    // resume content when all your linear ads have finished
                    this.one('adended', function () {
                        this.ads.endLinearAdMode();
                        context.adSkipped = true
                        AdViewAPI.onAdSuccessfulWatch(context.ad.adId, context.subid, this.WATCHFEE)
                    });
                });

                // in a real plugin, you might fetch ad inventory here
                this.player.trigger('adsready');

                this.status = "SUCCESS";
            } else {
                this.noads = true
                console.log('No ADS');
            }
        },
        adClicked: async function () {
            AdViewAPI.onAdClicked(this.ad.adId, this.subid, this.CLICKFEE)
        }
    },
    mounted() {
        if (this.subid == undefined || this.subid == "") {
            console.log("Invalid subid");
        }
        this.loadAd()
    },
    components: { ProgressBox, PrimaryButton, PrimaryButton }
}
</script>

<style scoped>
.ad_view_container {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    padding: 6px;
    border-radius: 4px;
    backdrop-filter: blur(8px);
    border: 1px #ccc solid;
}

.progress {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.video-js {
    width: 100%;
    height: 450px;
    border-radius: 4px;
    overflow: hidden;
}

video {
    object-fit: cover;
}

.content {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
}

.name {
    margin-top: 10px;
    font-size: 16px;
    font-weight: 500;
}

.powered p {
    font-size: 12px;
    font-weight: 500;
}

.powered span {
    color: var(--primary);
    font-weight: 600;
}

.skip_btn {
    position: absolute;
    z-index: 5;
    bottom: 100px;
    right: 20px;
}
</style>