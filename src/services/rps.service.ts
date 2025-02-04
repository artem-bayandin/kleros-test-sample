import { ethers, BrowserProvider, JsonRpcSigner, JsonRpcProvider } from 'ethers'
import { utils } from 'web3'
import { RPS } from '../../typechain-types'
import { abi, bytecode } from '../../artifacts/contracts/RPS.sol/RPS.json'
import { getProvider } from './network.service'

const { log } = console

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

async function startGame(opponent: string, bet: bigint, choice: number, salt: bigint): Promise<{ contract: string }> {
    const hash = utils.soliditySha3(
        {t: 'uint8', v: BigInt(choice)},
        {t: 'uint256', v: salt}
    )

    const provider = await getProvider()

    const factory = new ethers.ContractFactory(abi, bytecode, provider)
    const entity = await factory.deploy(hash, opponent, { value: bet })
    const txHash = entity.deploymentTransaction()?.hash
    log(`[RpsService] deploying to ${txHash}`)
    const result = await entity.waitForDeployment()
    const address = await result.getAddress()
    log(`[RpsService] deployed at ${address}`)
    
    return { contract: address }
}

async function solve(game: string, choice: number, salt: bigint) {
    const { contract } = await getProviderAndContract(game)
    await runTxWaitReceipt(contract.solve(choice, salt))
}

async function secondPlayerTimeout(game: string) {
    const { contract } = await getProviderAndContract(game)
    await runTxWaitReceipt(contract.j2Timeout())
}

// USER 2

async function reply(game: string, choice: number) {
    const { contract } = await getProviderAndContract(game)
    await runTxWaitReceipt(contract.play(choice))
}

async function firstPlayerTimeput(game: string) {
    const { contract } = await getProviderAndContract(game)
    await runTxWaitReceipt(contract.j1Timeout())
}

// READ

async function getUser1(game: string) {
    const { contract } = await getProviderAndContract(game)
    return contract.j1()
}

async function getUser2(game: string) {
    const { contract } = await getProviderAndContract(game)
    return contract.j2()
}

async function getUser1Hash(game: string) {
    const { contract } = await getProviderAndContract(game)
    return contract.c1Hash()
}

async function getUser2Move(game: string) {
    const { contract } = await getProviderAndContract(game)
    return contract.c2()
}

async function getStake(game: string) {
    const { contract } = await getProviderAndContract(game)
    return contract.stake()
}

async function getTimeout(game: string) {
    const { contract } = await getProviderAndContract(game)
    return contract.TIMEOUT()
}

async function getLastAction(game: string) {
    const { contract } = await getProviderAndContract(game)
    return contract.lastAction()
}

// private funcs

async function getContractAt(providerOrSigner: BrowserProvider | JsonRpcProvider | JsonRpcSigner, address: string): Promise<RPS> {
    return new ethers.Contract(address, abi, providerOrSigner) as unknown as RPS
}

async function getProviderAndContract(game: string) {
    const provider = await getProvider()
    const contract = await getContractAt(provider, game)
    return { provider, contract }
}

async function runTxWaitReceipt(func: Promise<ethers.ContractTransactionResponse>) {
    const tx = await func
    const receipt = await tx.wait()
}

// export

export { startGame, solve, secondPlayerTimeout, reply, firstPlayerTimeput }
export { getUser1, getUser2, getUser1Hash, getUser2Move, getStake, getTimeout, getLastAction }