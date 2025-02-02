// import { useEffect } from 'react'
import { useAccount, useChainId, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

export function Account() {
    const { address } = useAccount()
    const chainId = useChainId()
    const { disconnect } = useDisconnect()
    const { data: ensName } = useEnsName({ address })
    const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

    // useEffect(() => {
    //     console.log(`account changed`)
    // }, [ address ])
    // useEffect(() => {
    //     console.log(`chain changed`)
    // }, [ chainId ])

    return (
        <div>
            {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
            {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
            {chainId && <div>chainId: {chainId}</div>}
            <button onClick={() => disconnect()}>Disconnect</button>
            <button onClick={() => { console.log(`chain: ${chainId}`) }}>log network</button>
            <button onClick={() => { console.log(`chain: ${address}`) }}>log address</button>
        </div>
    )
}