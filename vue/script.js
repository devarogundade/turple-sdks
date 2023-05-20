import axios from 'axios'

const AdViewAPI = {
    loadAd: async function (subid) {
        try {
            const response = await axios.get(`http://localhost:8080/loadads?subid=${subid}`)
            return response.data
        } catch (error) {
            console.error(error);
            return null
        }
    },

    onAdSuccessfulWatch: async function (adid, subid, fee = 0) {
        try {
            const response = await axios.post(`http://localhost:8080/onadwatch?adid=${adid}&subid=${subid}&fee=${fee}`)
            return response.data
        } catch (error) {
            console.error(error);
            return null
        }
    },

    onAdClicked: async function (adid, subid, fee = 0) {
        try {
            const response = await axios.post(`http://localhost:8080/onadclick?adid=${adid}&subid=${subid}&fee=${fee}`)
            return response.data
        } catch (error) {
            console.error(error);
            return null
        }
    }
}

export default AdViewAPI