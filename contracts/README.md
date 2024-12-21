## Randaom Number Generator Example

cast wallet new

export ADDRESS=<address from above>
export PRIVATE_KEY=<your private key from above>
export RPC_URL="https://sepolia.optimism.io"
export ENTROPY_ADDRESS=0x4821932D0CDd71225A6d914706A621e0389D7061
export PROVIDER_ADDRESS=0x6CC14824Ea2918f5De5C2f75A9Da968ad4BD6344


cast balance $ADDRESS -r $RPC_URL -e

## Deploy the contract
forge create src/CoinFlip.sol:CoinFlip \
--private-key $PRIVATE_KEY \
--rpc-url $RPC_URL \
--constructor-args $ENTROPY_ADDRESS $PROVIDER_ADDRESS

export COINFLIP_ADDRESS=<Deployed to address from above>



### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ cast --help
```
