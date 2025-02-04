import { ethers } from 'hardhat'
import { utils } from 'web3'
const { log } = console

async function main() {
    const [ signer ] = await ethers.getSigners()
    log(`deploying under ${signer.address}`)
    const provider = ethers.provider
    const network = await provider.getNetwork()
    log(network.chainId)
    log(` -> tested`)

    await deployRps('0x00000000123456789abcdef01234567890abcdef', 100, 300n, 700n)
}

export async function deployRps(opponent: string, initialMove: number, salt: BigInt, value: BigInt) {
    const hash = utils.soliditySha3(
        {t: 'uint8', v: BigInt(initialMove)},
        {t: 'uint256', v: salt}
    )

    const factory = await ethers.getContractFactory('RPS')
    const contract = await factory.deploy(hash, opponent, { value: value })
    const tx = contract.deploymentTransaction()
    log(`rps deployment tx hash: ${tx?.hash}`)
    await contract.waitForDeployment()
    const contractAddress = await contract.getAddress()
    log(`rps deployed at ${contractAddress}`)
    return { contractAddress, contract }
}

if (require.main === module) {
    log(` -> deploy.ts`)
    main()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error)
            process.exit(1)
        })
}