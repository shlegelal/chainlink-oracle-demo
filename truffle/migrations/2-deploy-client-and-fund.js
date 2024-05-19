const fs = require('fs');
const path = require('path');

let LinkToken = artifacts.require('LinkToken');
let Client = artifacts.require("Client");

const conf = require("../../config/addrs.json")

module.exports = async (deployer) => {
    await deployer.deploy(Client, LinkToken.address);

    console.log(`Oracle client address is ${Client.address}`)

    conf.clientAddress = Client.address

    let addrFile = path.join(__dirname, '..', '..', 'config', 'addrs.json');
    fs.writeFileSync(addrFile, JSON.stringify(conf, null, '\t'));

    const token = await LinkToken.at(LinkToken.address);
    console.log(`Transferring 50 LINK to GanacheClient (address ${Client.address})...`);
    let receipt = await token.transfer(Client.address, `50`);
    console.log(`LINK Transfer succeeded! Transaction ID: ${receipt.tx}.`);
};
