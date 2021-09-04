import axios from 'axios';

export default function () : Promise<string> {
    return new Promise(async (resolve, reject) => {
        const contractAddress = process.env.GOVERNOR_ALPHA_CONTRACT_ADDRESS
        const apiKey = process.env.ETHERSCAN_API_KEY
        const etherScanQueryURL = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`
        const response = await axios.get(etherScanQueryURL)
        resolve(response.data.result)
    })
}

