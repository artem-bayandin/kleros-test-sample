import { createContext } from 'react'

const ChainContext = createContext({
    chainId: null as BigInt | null
    , address: ''
})

export { ChainContext }