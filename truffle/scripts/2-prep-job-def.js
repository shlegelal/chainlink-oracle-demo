const fs = require('fs');
const path = require('path');

let Operator = artifacts.require('Operator');

module.exports = async () => {
    let addrFile;
    addrFile = path.join(__dirname, '..', '..', 'config', 'job-definition.toml');

    try {
        fs.unlinkSync(addrFile);
    } catch {
        // delete if exists; ignore errors
    }

    fs.writeFileSync(addrFile, `
name = "Get price -> Uint256"
type = "directrequest"
schemaVersion = 1
maxTaskDuration = "0s"
externalJobID = "fc1b8114-6f50-4be4-b585-22bc45459496"
forwardingAllowed = false
contractAddress = "${Operator.address}"
evmChainID = "1337"
minIncomingConfirmations = 0
minContractPaymentLinkJuels = "0"
observationSource = """
    decode_log   [type="ethabidecodelog"
                  abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
                  data="$(jobRun.logData)"
                  topics="$(jobRun.logTopics)"]

    decode_cbor  [type="cborparse" data="$(decode_log.data)"]
    fetch        [type="http" method=GET url="$(decode_cbor.get)" allowUnrestrictedNetworkAccess="true"]
    parse        [type="jsonparse" path="$(decode_cbor.path)" data="$(fetch)"]

    multiply     [type="multiply" input="$(parse)" times="$(decode_cbor.times)"]

    encode_data  [type="ethabiencode" abi="(bytes32 requestId, uint256 value)" data="{ \\\\"requestId\\\\": $(decode_log.requestId), \\\\"value\\\\": $(multiply) }"]
    encode_tx    [type="ethabiencode"
                  abi="fulfillOracleRequest2(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes calldata data)"
                  data="{\\\\"requestId\\\\": $(decode_log.requestId), \\\\"payment\\\\":   $(decode_log.payment), \\\\"callbackAddress\\\\": $(decode_log.callbackAddr), \\\\"callbackFunctionId\\\\": $(decode_log.callbackFunctionId), \\\\"expiration\\\\": $(decode_log.cancelExpiration), \\\\"data\\\\": $(encode_data)}"
                  ]
    submit_tx    [type="ethtx" to="${Operator.address}" data="$(encode_tx)"]

    decode_log -> decode_cbor -> fetch -> parse -> multiply -> encode_data -> encode_tx -> submit_tx
"""`);
};