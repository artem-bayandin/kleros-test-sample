// connect to mm
// check network
// switch acc
// switch network
// subscribe to network events

import { BrowserProvider } from 'ethers'
const { log } = console

export function getEthProvider() {
    if (!window?.ethereum || !window?.ethereum.isMetaMask) {
        alert(`please install Metamask`)
        throw new Error(`Metamask not installed`)
    }
    return window.ethereum
}

export function getProvider(): BrowserProvider {
    const ethProvider = getEthProvider()
    return new BrowserProvider(ethProvider as any)
}

export async function getChainId() {
    const provider = getProvider()
    const network = await provider.getNetwork()
    log(`[NetworkService] chain id ${network.chainId}`)
    return network.chainId
}

export async function getConnectedAccount() {
    const provider = getProvider()
    const [ account ] = await provider.listAccounts()
    log(`[NetworkService] getConnectedAccount acc`, account)
    if (!!account) {
        return await account.getAddress() // JsonRpcSigner {provider: BrowserProvider, address:address}
    }
    return ''
}

export async function getAccountOrRequestAccount(): Promise<string> {
    const provider = getProvider()
    const [ account ] = await provider.listAccounts()
    log(`[NetworkService] getAccountOrConnect acc`, account)
    if (!!account) {
        return await account.getAddress() // JsonRpcSigner {provider: BrowserProvider, address:address}
    }

    try {
        const connectedAccouts = await provider.send('eth_requestAccounts', [])
        log(`[NetworkService] getAccountOrConnect res`, connectedAccouts) // only address
        const [ account2 ] = await provider.listAccounts()
        log(`[NetworkService] getAccountOrConnect acc2`, account2)
        return await account2.getAddress()
    } catch(e) {
        // log(e)
        // log('123', !!e)
        // log('000', Object.keys(e as any))
        // const keys = Object.keys(e as any)
        // for (let i = 0; i < keys.length; i++) {
        //     log(`i${i}`, (e as any)[keys[i]])
        // }
        // log('456', (e as any).code)
        // log('789', (e as any).code == 4001)
        // if (e && (e as any).code && (e as any).code == 4001) {
        //     // user rejected
        //     log('GOOD')
        //     return '';
        // } else {
        //     log('BAD')
        //     throw e
        // }
        alert('sounds like you were disconnected, or rejected to connect (#gaora)')
    }
    return ''
}

export async function requestPermissionsAndConnect(): Promise<string> {
    const provider = getProvider()
    try {
        await provider.send('wallet_requestPermissions', [{ eth_accounts: {} }])
        return getAccountOrRequestAccount()
    } catch(e) {
        // log(e)
        // log('123', !!e)
        // log('000', Object.keys(e as any))
        // const keys = Object.keys(e as any)
        // for (let i = 0; i < keys.length; i++) {
        //     log(`i${i}`, (e as any)[keys[i]])
        // }
        // log('456', (e as any).code)
        // log('789', (e as any).code == 4001)
        // if (e && (e as any).code && (e as any).code == 4001) {
        //     // user rejected
        //     log('GOOD')
        //     return '';
        // } else {
        //     log('BAD')
        //     throw e
        // }
        alert('sounds like you were disconnected, or rejected to connect (#rp)')
    }
    return ''
}