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

    onAdSuccessfulWatch: async function (adid, subid) {
        try {
            const response = await axios.post(`http://localhost:8080/onadwatch?adid=${adid}&subid=${subid}`)
            return response.data
        } catch (error) {
            console.error(error);
            return null
        }
    }
}

export default AdViewAPI