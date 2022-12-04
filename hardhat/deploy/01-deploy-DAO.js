const { network, ethers } = require("hardhat")
const { verify } = require("../utils/verify")
const { CRYPTO_DEVS_NFT_CONTRACT_ADDRESS } = require("../constants")

const developmentChains = ["hardhat", "localhost"]

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const fakeNFTMarketplace = await deploy("FakeNFTMarketplace", {
        from: deployer,
        log: true,
        args: [],
    })

    log("----------------------")

    const args = [fakeNFTMarketplace.address, CRYPTO_DEVS_NFT_CONTRACT_ADDRESS]

    const cryptoDevsDAO = await deploy("CryptoDevsDAO", {
        from: deployer,
        log: true,
        args: args,
        value: ethers.utils.parseEther("1"),
        waitConfirmations: 6,
    })

    log("----------------------")

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(cryptoDevsDAO.address, args)
    }
}
