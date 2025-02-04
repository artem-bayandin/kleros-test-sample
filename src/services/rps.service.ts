import { ethers, BrowserProvider, JsonRpcSigner, isAddress } from 'ethers'
import { utils } from 'web3'
import { RPS } from '../../typechain-types'
import RPSData from '../hardhat-artifacts/contracts/RPS.sol/RPS.json'
import { getProvider } from './network.service'

const { log } = console

type Result<T> = { errors?: string[], data?: T }

// USER 1

async function startGame(opponent: string, bet: bigint, choice: number, salt: bigint): Promise<Result<{ contract: string }>> {
    // validate input
    const errors = []
    if (!isAddress(opponent)) {
        errors.push('invalid opponent address')
    }
    if (bet < 1n) {
        errors.push('invalid bet')
    }
    if (choice < 1 || choice > 5) {
        errors.push('invalid choice')
    }
    if (errors.length) {
        return { errors }
    }

    // prepare tx and run
    try {
        const hash = calcHash(choice, salt)
    
        const provider = getProvider()
        const signer = await provider.getSigner()
        if (!opponent.toLowerCase().localeCompare((await signer.getAddress()).toLowerCase())) {
            return { errors: [ 'cannot play with yourself' ] }
        }
    
        const factory = new ethers.ContractFactory(RPSData.abi, RPSData.bytecode, signer)
        const entity = await factory.deploy(hash, opponent, { value: bet })
        const txHash = entity.deploymentTransaction()?.hash
        log(`[RpsService] deployment tx hash ${txHash}`)
        const result = await entity.waitForDeployment()
        const address = await result.getAddress()
        log(`[RpsService] deployed at ${address}`)
        
        return { data: { contract: address } }
    } catch (e) {
        return { errors: [ 'This error was caught, but for tests it will be shown', JSON.stringify(e) ] }
    }
}

async function solve(game: string, choice: number, salt: bigint): Promise<Result<{}>> {
    // validate input
    const errors = []
    if (!isAddress(game)) {
        errors.push('invalid game address')
    }
    if (choice < 1 || choice > 5) {
        // require(_c1!=Move.Null); // J1 should have made a valid move.
        errors.push('invalid choice')
    }
    if (errors.length) {
        return { errors }
    }

    // connect to contract
    const { contract, signer } = await getContractToWrite(game)

    // validate internal contract conditions
    // require(c2!=Move.Null); // J2 must have played.
    const c2 = await contract.c2()
    if (c2 == 0n) {
        errors.push('invalid contract state: J2 must have played')
    }
    // require(msg.sender==j1); // J1 can call this.
    const j1 = await contract.j1()
    if (j1.toLowerCase().localeCompare((await signer.getAddress()).toLowerCase())) {
        errors.push('invalid contract state: J1 can call this')
    }
    // require(keccak256(_c1,_salt)==c1Hash); // Verify the value is the commited one.
    const c1Hash = await contract.c1Hash()
    const localHash = calcHash(choice, salt)
    if (c1Hash.localeCompare(localHash)) {
        errors.push('invalid contract state: invalid hash')
    }
    if (errors.length) {
        return { errors }
    }

    // act
    try {
        await runTxWaitReceipt(contract.solve(choice, salt))
        return {}
    } catch (e) {
        return { errors: [ 'This error was caught, but for tests it will be shown', JSON.stringify(e) ] }
    }
}

async function secondPlayerTimeout(game: string): Promise<Result<{}>> {
    // validate input
    const errors = []
    if (!isAddress(game)) {
        errors.push('invalid game address')
    }
    if (errors.length) {
        return { errors }
    }

    // connect to contract
    const { contract } = await getContractToWrite(game)

    // validate internal contract conditions
    // require(c2==Move.Null); // J2 has not played.
    const c2 = await contract.c2()
    if (c2 > 0n) {
        errors.push('invalid contract state: J2 should have not played')
    }
    // require(now > lastAction + TIMEOUT); // Timeout time has passed.
    const lastAction = await contract.lastAction()
    const timeout = await contract.TIMEOUT()
    const jsNow = Math.floor(Date.now() / 1000) // assume provider time and local time is the same
    if (jsNow <= lastAction + timeout) {
        errors.push('invalid contract state: time has not passed')
    }
    if (errors.length) {
        return { errors }
    }

    // act
    try {
        await runTxWaitReceipt(contract.j2Timeout())
        return {}
    } catch (e) {
        return { errors: [ 'This error was caught, but for tests it will be shown', JSON.stringify(e) ] }
    }
}

// USER 2

async function reply(game: string, choice: number): Promise<Result<{}>> {
    // validate input
    const errors = []
    if (!isAddress(game)) {
        errors.push('invalid game address')
    }
    if (choice < 1 || choice > 5) {
        // require(_c2!=Move.Null); // A move is selected.
        errors.push('invalid choice')
    }
    if (errors.length) {
        return { errors }
    }

    // connect to contract
    const { contract, signer } = await getContractToWrite(game)

    // validate internal contract conditions
    // require(c2==Move.Null); // J2 has not played yet.
    const c2 = await contract.c2()
    if (c2 > 0n) {
        errors.push('invalid contract state: J2 should have not played')
    }
    // require(msg.value==stake); // J2 has paid the stake.
    const stake = await contract.stake()

    // require(msg.sender==j2); // Only j2 can call this function.
    const j2 = await contract.j2()
    if (j2.toLowerCase().localeCompare((await signer.getAddress()).toLowerCase())) {
        errors.push('invalid contract state: J2 can call this')
    }
    if (errors.length) {
        return { errors }
    }

    // act
    try {
        await runTxWaitReceipt(contract.play(choice, { value: stake }))
        return {}
    } catch (e) {
        return { errors: [ 'This error was caught, but for tests it will be shown', JSON.stringify(e) ] }
    }
}

async function firstPlayerTimeout(game: string): Promise<Result<{}>> {
    // validate input
    const errors = []
    if (!isAddress(game)) {
        errors.push('invalid game address')
    }
    if (errors.length) {
        return { errors }
    }

    // connect to contract
    const { contract } = await getContractToWrite(game)

    // validate internal contract conditions
    // require(c2!=Move.Null); // J2 already played.
    const c2 = await contract.c2()
    if (c2 == 0n) {
        errors.push('invalid contract state: J2 should have played')
    }
    // require(now > lastAction + TIMEOUT); // Timeout time has passed.
    const lastAction = await contract.lastAction()
    const timeout = await contract.TIMEOUT()
    const jsNow = Math.floor(Date.now() / 1000) // assume provider time and local time is the same
    if (jsNow <= lastAction + timeout) {
        errors.push('invalid contract state: time has not passed')
    }
    if (errors.length) {
        return { errors }
    }

    // act
    try {
        await runTxWaitReceipt(contract.j1Timeout())
        return {}
    } catch (e) {
        return { errors: [ 'This error was caught, but for tests it will be shown', JSON.stringify(e) ] }
    }
}

// READ

async function getUser1(game: string): Promise<string> {
    const { contract } = await getContractToRead(game)
    return contract.j1()
}

async function getUser2(game: string): Promise<string> {
    const { contract } = await getContractToRead(game)
    return contract.j2()
}

async function getUser1Hash(game: string): Promise<string> {
    const { contract } = await getContractToRead(game)
    return contract.c1Hash()
}

async function getUser2Move(game: string): Promise<bigint> {
    const { contract } = await getContractToRead(game)
    return contract.c2()
}

async function getStake(game: string): Promise<bigint> {
    const { contract } = await getContractToRead(game)
    return contract.stake()
}

async function getTimeout(game: string): Promise<bigint> {
    const { contract } = await getContractToRead(game)
    return contract.TIMEOUT()
}

async function getLastAction(game: string): Promise<bigint> {
    const { contract } = await getContractToRead(game)
    return contract.lastAction()
}

// private funcs

async function getContractAt(providerOrSigner: BrowserProvider | JsonRpcSigner, address: string): Promise<RPS> {
    return new ethers.Contract(address, RPSData.abi, providerOrSigner) as unknown as RPS
}

async function getContractToRead(game: string) {
    const provider = getProvider()
    const contract = await getContractAt(provider, game)
    return { provider, contract }
}

async function getContractToWrite(game: string) {
    const provider = getProvider()
    const signer = await provider.getSigner()
    const contract = await getContractAt(signer, game)
    return { provider, contract, signer }
}

async function runTxWaitReceipt(func: Promise<ethers.ContractTransactionResponse>) {
    const tx = await func
    const receipt = await tx.wait()
}

function calcHash(choice: number, salt: bigint): string {
    const value = utils.soliditySha3(
        {t: 'uint8', v: choice},
        {t: 'uint256', v: salt}
    )
    if (!value) {
        throw new Error('failed to calculate hash locally')
    }
    return value
}

// export

export { startGame, solve, secondPlayerTimeout, reply, firstPlayerTimeout }
export { getUser1, getUser2, getUser1Hash, getUser2Move, getStake, getTimeout, getLastAction }