## Random Number Generator Example - Pyth Entropy

### Build

```shell
forge build
```

### Format

```shell
forge fmt
```

## Setup for Demo

```bash
export ADDRESS=<your address>
export PRIVATE_KEY=<your private key>
export RPC_URL="https://berachain-testnet-evm-rpc.publicnode.com"
export ENTROPY_ADDRESS=0x36825bf3Fbdf5a29E2d5148bfe7Dcf7B5639e320
export PROVIDER_ADDRESS=0x6CC14824Ea2918f5De5C2f75A9Da968ad4BD6344
```

```bash
cast balance $ADDRESS -r $RPC_URL -e
```

## Deploy the contract

```bash
forge create src/CoinFlip.sol:CoinFlip \
--private-key $PRIVATE_KEY \
--rpc-url $RPC_URL \
--constructor-args $ENTROPY_ADDRESS $PROVIDER_ADDRESS
```

```bash
export COINFLIP_ADDRESS=<Deployed to address from above>
```

## Interact with contract - via cast CLI - First way

```bash
# 1. Get the fee (it's already in Wei)
export FEE=$(cast call $ENTROPY_ADDRESS "getFee(address)" $PROVIDER_ADDRESS --rpc-url $RPC_URL)
# 2. Convert hex fee to decimal format
export FEE_DEC=$(cast --to-dec $FEE)
# 3. Generate random bytes32
export USER_RANDOM=$(cast keccak "$(date)")
# 4. Send the transaction with decimal fee
cast send  --private-key $PRIVATE_KEY $COINFLIP_ADDRESS --rpc-url $RPC_URL "request(bytes32)" $USER_RANDOM --value $FEE_DEC
```

### Information about transaction (Optional)
```bash
cast tx txHash --rpc-url $RPC_URL

cast receipt YOUR_TX_HASH --rpc-url $RPC_URL --json
```

### Processing to understand the result

```bash
CURRENT_BLOCK=$(cast block-number --rpc-url $RPC_URL)
START_BLOCK=$((CURRENT_BLOCK - 1000))

cast logs --address $COINFLIP_ADDRESS --rpc-url $RPC_URL --from-block $START_BLOCK --to-block $CURRENT_BLOCK
```

In the result, the "data" field of second topic has something similiar to `"data: 0x000000000000000000000000000000000000000000000000000000000002bc180000000000000000000000000000000000000000000000000000000000000000"`

The first 32 bytes represents the sequence number and next 32 bytes represents the result of coin flip (boolean)

## Interact with contract - via application - Second way 
To see the second method to interact with the smart contract through the application, go to "app" folder and follow its README.md.

Feel free to pick whatever interaction works best for you. 

## Exercise for you
Write tests for the smart contract in test folder. To get started, check out https://book.getfoundry.sh/forge/tests

Don't forge to raise a pull request after writing tests.

### Help

```shell
$ forge --help
$ cast --help
```
