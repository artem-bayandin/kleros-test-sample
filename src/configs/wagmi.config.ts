import { http, createConfig } from 'wagmi'
import { mainnet, bsc, bscTestnet, polygon, polygonMumbai } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'

export const config = createConfig({
	chains: [mainnet, bsc, bscTestnet, polygon, polygonMumbai],
	connectors: [
		metaMask()
	],
	transports: {
		[mainnet.id]: http(),
		[bsc.id]: http(),
		[bscTestnet.id]: http(),
		[polygon.id]: http(),
		[polygonMumbai.id]: http(),
	},
	syncConnectedChain: true
})