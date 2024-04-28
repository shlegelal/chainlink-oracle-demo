import path from "path";
import fs from "fs";

const jobId = "fc1b8114-6f50-4be4-b585-22bc45459496"

const Client = artifacts.require("Client");
const Operator = artifacts.require('Operator');

module.exports = () => {
    Client.requestEthereumPrice(Operator.address, jobId, 1)
}