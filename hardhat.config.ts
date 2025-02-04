import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomicfoundation/hardhat-chai-matchers'
import '@nomicfoundation/hardhat-ethers'
import '@nomicfoundation/hardhat-verify'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'

const config: HardhatUserConfig = {
  solidity: '0.4.26',
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 127002,
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk',
      },
      blockGasLimit: 30000000,
      gas: 4000000,
      gasPrice: 71 * 1000000000,
      allowUnlimitedContractSize: false,
      throwOnTransactionFailures: false,
      throwOnCallFailures: true,
      loggingEnabled: true
    }
  },
  paths: {
    sources: './contracts',
    tests: './test/hardhat',
    artifacts: './src/hardhat-artifacts'
  },
}

export default config
