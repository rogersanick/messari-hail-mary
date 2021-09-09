import axios from 'axios';

export function getLatestABI() : Promise<string> {
    return new Promise((resolve) => {
        const contractAddress = process.env.GOVERNOR_ALPHA_CONTRACT_ADDRESS
        const apiKey = process.env.ETHERSCAN_API_KEY
        const etherScanQueryURL = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`
        axios.get(etherScanQueryURL).then((response) => {
            resolve(response.data.result)
        })
        
    })
}

