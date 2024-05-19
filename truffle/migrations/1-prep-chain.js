const fs = require('fs');
const path = require('path');

let LinkToken = artifacts.require('LinkToken');
let Operator = artifacts.require('Operator');

module.exports = async (deployer, network, [defaultAccount]) => {
    await deployer.deploy(LinkToken);
    await deployer.deploy(Operator, LinkToken.address, defaultAccount);

    console.log(`Link address is ${LinkToken.address}`)
    console.log(`Operator address is ${Operator.address}`)

    const conf = {
        linkTokenAddress: LinkToken.address,
        operatorAddress: Operator.address
    }

    let addrFile = path.join(__dirname, '..', '..', 'config', 'addrs.json');
    fs.writeFileSync(addrFile, JSON.stringify(conf, null, '\t'));
};
