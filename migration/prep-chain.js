const fs = require('fs');
const path = require('path');

let LinkToken = artifacts.require('LinkToken');
let Operator = artifacts.require('Operator');

module.exports = async (deployer, network, [defaultAccount]) => {
    await deployer.deploy(LinkToken);
    await deployer.deploy(Operator, LinkToken.address, defaultAccount);

    console.log(`Link address is ${LinkToken.address}`)
    console.log(`Operator address is ${Operator.address}`)

    let addrFile;
    addrFile = path.join(__dirname, '..', 'config', 'addrs.env');

    try {
        fs.unlinkSync(addrFile);
    } catch {
        // delete if exists; ignore errors
    }

    fs.writeFileSync(addrFile, `LINK_CONTRACT_ADDRESS=${LinkToken.address}\nOPERATOR_CONTRACT_ADDRESS=${Operator.address}\n`);
};
