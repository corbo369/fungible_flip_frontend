import { http, createConfig } from 'wagmi'
import { blastSepolia } from 'wagmi/chains'

export const config = createConfig({
    chains: [blastSepolia],
    transports: {
        [blastSepolia.id]: http('https://rpc.ankr.com/blast_testnet_sepolia/647924a9aa98249697add40f8edd819ae04c3e97ef701d2e425617aff280850f'),
    },
})