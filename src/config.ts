import { http, createConfig } from 'wagmi'
import { blastSepolia } from 'wagmi/chains'
import { defineChain } from 'viem'

export const blast = defineChain({
    id: 81457,
    name: 'Blast',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://rpc.blast.io'] },
    },
    blockExplorers: {
        default: { name: 'Blastscan', url: 'https://blastscan.io' },
    },
})

export const config = createConfig({
    chains: [blast, blastSepolia],
    transports: {
        [blast.id]: http('https://rpc.ankr.com/blast/647924a9aa98249697add40f8edd819ae04c3e97ef701d2e425617aff280850f'),
        [blastSepolia.id]: http('https://rpc.ankr.com/blast_testnet_sepolia/647924a9aa98249697add40f8edd819ae04c3e97ef701d2e425617aff280850f'),
    },
})