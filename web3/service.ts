import { ethers, BrowserProvider, JsonRpcSigner, JsonRpcProvider } from 'ethers'
import { deployRps } from './deploy'
import { RPS } from '../typechain-types'
import { abi } from '../artifacts/contracts/RPS.sol/RPS.json'

/*
user 1:
    - [start_game]
        - input address of another user
        - input eth value
        - choose radio hand
        - input salt
        - clicks `create game`
            - receives contract address, salt, hand played
    - [solve]
        - input contract address of a game
        - choose radio hand
        - input salt
        - clicks `solve`
    - [j2_timeout]
        - input contract address of a game
        - clicks `j2 timeout`

user 2:
    - [reply]
        - input contract address of a game
        - choose radio hand
        - clicks `play`
    - [j1_timeout]                              // this might take all the stakes even if player_1 wins
        - input contract address of a game
        - clicks `j1 timeout`
*/

// USER 1

async function startGame(provider: BrowserProvider | JsonRpcProvider | JsonRpcSigner, opponent: string, price: bigint, choice: number, salt: bigint): Promise<{ contract: string }> {
    const { contractAddress } = await deployRps(opponent, choice, salt, price)
    return { contract: contractAddress }
}

async function solve(provider: BrowserProvider | JsonRpcProvider | JsonRpcSigner, game: string, choice: number, salt: bigint) {
    const contract = await getContractAt(provider, game)
    const tx = await contract.solve(choice, salt)
    const receipt = await tx.wait()
}

async function secondPlayerTimeout(provider: BrowserProvider | JsonRpcProvider | JsonRpcSigner, game: string) {
    const contract = await getContractAt(provider, game)
    const tx = await contract.j2Timeout()
    const receipt = await tx.wait()
}

// USER 2

async function reply(provider: BrowserProvider | JsonRpcProvider | JsonRpcSigner, game: string, choice: number) {
    const contract = await getContractAt(provider, game)
    const tx = await contract.play(choice)
    const receipt = await tx.wait()
}

async function firstPlayerTimeput(provider: BrowserProvider | JsonRpcProvider | JsonRpcSigner, game: string) {
    const contract = await getContractAt(provider, game)
    const tx = await contract.j1Timeout()
    const receipt = await tx.wait()
}

// private funcs

async function getContractAt(providerOrSigner: BrowserProvider | JsonRpcProvider | JsonRpcSigner, address: string): Promise<RPS> {
    return new ethers.Contract(address, abi, providerOrSigner) as unknown as RPS
}

// export

export { startGame, solve, secondPlayerTimeout, reply, firstPlayerTimeput }