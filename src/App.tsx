import { useEffect, useState } from 'react';
import './App.css'
import Game from './components/Game'
import { getChainId, getEthProvider, requestPermissionsAndConnect } from './services/network.service';
import { ChainContext } from './contexts/chainContext';

const { log } = console

function App() {
	const [ currentChainId, setCurrentChainId ] = useState(0n as BigInt | null)
	const [ currentAddress, setCurrentAddress ] = useState('')

	const provider = getEthProvider() as any

	const connectListener = ({ chainId }: { chainId: string }) => {
		log('[APP] on connect', chainId)
		setCurrentChainId(BigInt(chainId))
	}

	const chainChangedListener = (chainId: string) => {
		log('[APP] on chainChanged', chainId)
		setCurrentChainId(BigInt(chainId))
	}

	const disconnectListener = (reason: string) => {
		log('[APP] on disconnect', reason)
		setCurrentChainId(null)
		setCurrentAddress('')
	}

	const accountsChangedListener = (accounts: string[]) => {
		log('[APP] on accountsChanged', accounts)
		setCurrentAddress(accounts.length ? accounts[0] : '')
	}

	useEffect(() => {
		provider.on('connect', connectListener)
		provider.on('disconnect', disconnectListener)
		provider.on('accountsChanged', accountsChangedListener)
		provider.on('chainChanged', chainChangedListener)

		return () => {
			provider.removeListener('connect', connectListener)
			provider.removeListener('disconnect', disconnectListener)
			provider.removeListener('accountsChanged', accountsChangedListener)
			provider.removeListener('chainChanged', chainChangedListener)
		}
	}, [ currentAddress, currentChainId ])

	const onConnectClicked = () => {
		// green line to just read current address and network, but if you changed address in MM, this will still read previous address
		// `requestPermissionsAndConnect` disconnects current account and requests new one
		// getAccountOrRequestAccount().then((acc) => {
		requestPermissionsAndConnect().then((acc) => {
			setCurrentAddress(acc)
			getChainId().then((chid) => {
				setCurrentChainId(chid)
			})
		})
	}

	return (
		<ChainContext.Provider value={{ chainId: currentChainId, address: currentAddress }}>
			<h2>Account section</h2>
			<div>address: {currentAddress}</div>
			<div>chain id: {currentChainId?.toString()}</div>
			<div><button onClick={onConnectClicked}>{ (!currentAddress && !currentChainId) ? 'connect' : 'refresh or re-connect' }</button></div>
			<hr />
            {!!currentAddress && !!currentChainId && <Game />}
		</ChainContext.Provider>
	);
}

export default App;
