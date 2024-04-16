const fs = require('fs');
const path = require("path");

const Operator = artifacts.require('Operator');

module.exports = () => {
    let addrFile = path.join(__dirname, '..', '..', 'config', 'nodes.env');
    const nodes = fs.readFileSync(addrFile, "utf-8").split("\n");
    Operator.setAuthorizedSenders(nodes)
}