const fs = require('fs');
const path = require('path');

let LinkToken = artifacts.require('LinkToken');
let Client = artifacts.require("Client");

module.exports = async (deployer) => {
    await deployer.deploy(Client, LinkToken.address);

    console.log(`Oracle client address is ${Client.address}`)

    let addrFile;
    addrFile = path.join(__dirname, '..', '..', 'config', 'addrs.env');

    fs.writeFileSync(addrFile,`CLIENT_CONTRACT_ADDRESS=${Client.address}\n`, {flag: "a+"});
};
