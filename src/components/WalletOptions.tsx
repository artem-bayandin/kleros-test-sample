import { useConnect } from 'wagmi'

export function WalletOptions() {
    const { connectors, connect } = useConnect()

    return connectors.map((connector) => (
        <button key={connector.uid} onClick={() => connect({ connector })}>
            connect {connector.name}
        </button>
    ))
}