module.exports = {
    contracts_directory: "./contracts",
    contracts_build_directory: "./build",
    networks: {
        ganache: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*"
        }
    },
    compilers: {
        solc: {
            version: "pragma"
        }
    }
}
