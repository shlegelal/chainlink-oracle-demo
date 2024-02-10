const Client = artifacts.require('Client');
const LinkToken = artifacts.require('LinkToken');

module.exports = async () => {
    const tokenAddress = await Client.getChainlinkToken();
    const token = await LinkToken.at(tokenAddress);

    console.log(`Transferring 50 LINK to GanacheClient (address ${Client.address})...`);
    let receipt = await token.transfer(Client.address, `50`);
    console.log(`LINK Transfer succeeded! Transaction ID: ${receipt.tx}.`);
}
