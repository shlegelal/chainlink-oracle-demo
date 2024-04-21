
const Client = artifacts.require("Client");

module.exports = () => {
    console.log(`Current price of USD = ${Client.currentPrice.call()/100} RUB`)
}