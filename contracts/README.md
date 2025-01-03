## Random Number Generator Example

### Build

```shell
$ forge build
```

### Format

```shell
$ forge fmt
```

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

## Interact with contract

```bash
# 1. Get the fee (it's already in Wei)
export FEE=$(cast call $ENTROPY_ADDRESS "getFee(address)" $PROVIDER_ADDRESS --rpc-url $RPC_URL)
# 2. Convert hex fee to decimal format
export FEE_DEC=$(cast --to-dec $FEE)
# 3. Generate random bytes32
export USER_RANDOM=$(cast keccak "$(date)")
# 4. Send the transaction with decimal fee
cast send  --private-key $PRIVATE_KEY $COINFLIP_ADDRESS --rpc-url $RPC_URL "requestRandomNumber(bytes32)" $USER_RANDOM --value $FEE_DEC


cast tx txHash --rpc-url $RPC_URL

cast receipt YOUR_TX_HASH --rpc-url $RPC_URL --json

CURRENT_BLOCK=$(cast block-number --rpc-url $RPC_URL)
START_BLOCK=$((CURRENT_BLOCK - 1000))

cast logs --address $COINFLIP_ADDRESS --rpc-url $RPC_URL --from-block $START_BLOCK --to-block $CURRENT_BLOCK

``` 

### Help

```shell
$ forge --help
$ cast --help
```
