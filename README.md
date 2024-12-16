# Security Token Offerings (STO) Privacy Extension

A "zero-knowledge" bridge software to export security-token-offering (STO) data published in
financial instutiton's private ledger to the public Mina blockchain. The export process parses the
original data stored on the private ledger, storing an encrypted subset of this data. This subset
of data is then publicly available and can be used with Zero Knowledge (ZK) technology to generate
privacy-enhanced claims. Zero Knowledge Proofs (ZK Proofs), in this case zk-SNARKS, ensure data
integrity and privacy.

This monorepo repository also contains a set of components that allow asset owners to make
privacy-enhanced claims of their assets. These privacy-enhanced claims are proofs of ownership for
their STO holdings and can be generated securely on their own devices. The purpose is to provide
additional utility to STO owners without the need to reveal any additional information.

## Instructions

Install dependency:

```
yarn install
```

Build zkapps

```
./ci build_zkapps
```

Run api server:

```
./ci dev_stope_api_server
```

Run web application:

```
./ci dev_stope_web_app
```

Create mock data:

```
./ci create_data
```

Test bridge zk application,

```
./ci test_bridge
```

Test user proof zk application,

```
./ci test_bridge
```

## Testing:

In the `stope_user_proof` package,

```
yarn test -t 'TEST_NAME'
```

## Acknowledgement

Mina Foundation grant 2024
