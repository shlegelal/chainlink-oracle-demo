import path from "path";
import fs from "fs";

const Client = artifacts.require("Client");
const Operator = artifacts.require('Operator');

module.exports = () => {
    let addrFile = path.join(__dirname, '..', '..', 'config', 'job-id.env');
    let job_id = fs.readFileSync(addrFile, "utf-8")
    Client.requestEthereumPrice(Operator.address, job_id)
}