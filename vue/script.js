import axios from 'axios'

const AdViewAPI = {
    loadAd: async function (subid) {
        try {
            const response = await axios.get(`https://turple-api-v1.onrender.com/loadads?subid=${subid}`)
            return response.data
        } catch (error) {
            console.error(error);
            return null
        }
    },

    onAdSuccessfulWatch: async function (adid, subid) {
        try {
            const response = await axios.post(`https://turple-api-v1.onrender.com/onadwatch?adid=${adid}&subid=${subid}`)
            return response.data
        } catch (error) {
            console.error(error);
            return null
        }
    },

    onAdClicked: async function (adid, subid) {
        try {
            const response = await axios.post(`https://turple-api-v1.onrender.com/onadclick?adid=${adid}&subid=${subid}`)
            return response.data
        } catch (error) {
            console.error(error);
            return null
        }
    }
}

export default AdViewAPI