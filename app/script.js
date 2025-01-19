const { Web3 } = require("web3");
const CoinFlipAbi = require("../contracts/out/CoinFlip.sol/CoinFlip.json");
const EntropyAbi = require("@pythnetwork/entropy-sdk-solidity/abis/IEntropy.json");

async function main() {
    const web3 = new Web3(process.env["RPC_URL"]);
    const { address } = web3.eth.accounts.wallet.add(
        process.env["PRIVATE_KEY"]
    )[0];

    web3.eth.defaultBlock = "finalized";

    const coinFlipContract = new web3.eth.Contract(
        CoinFlipAbi.abi,
        process.env["COINFLIP_ADDRESS"]
    );

    const entropyContract = new web3.eth.Contract(
        EntropyAbi,
        process.env["ENTROPY_ADDRESS"]
    );

    // Request a random number

    // Generate user random number
    const userRandomNumber = web3.utils.randomHex(32);
    console.log(`user random : ${userRandomNumber}`);

    const fee = await entropyContract.methods.getFee(process.env["PROVIDER_ADDRESS"]).call()
    console.log(`fee         : ${fee}`);

    const requestReceipt = await coinFlipContract.methods
        .request(userRandomNumber)
        .send({
            value: fee,
            from: address,
        });

    console.log(`request tx  : ${requestReceipt.transactionHash}`);
    // Read the sequence number for the request from the transaction events.
    const sequenceNumber =
        requestReceipt.events.FlipRequested.returnValues.sequenceNumber;
    console.log(`sequence    : ${sequenceNumber}`);

    let fromBlock = requestReceipt.blockNumber;
    const intervalId = setInterval(async () => {
        const currentBlock = await web3.eth.getBlockNumber();

        if (fromBlock > currentBlock) {
            return;
        }

        // Get 'FlipResult' events emitted by the CoinFlip contract for given block range.
        const events = await coinFlipContract.getPastEvents("FlipResult", {
            fromBlock: fromBlock,
            toBlock: currentBlock,
        });
        fromBlock = currentBlock + 1n;

        // Find the event with the same sequence number as the request.
        const event = events.find(event => event.returnValues.sequenceNumber === sequenceNumber);

        // If the event is found, log the result and stop polling.
        if (event !== undefined) {
            console.log(`result      : ${event.returnValues.isHeads ? 'Heads' : 'Tails'}`);
            clearInterval(intervalId);
        }

    }, 1000);
}

main();