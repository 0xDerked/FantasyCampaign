Turn based fantasy campaign game powered by Chainlink VRF and user imagination

# To get it running

```
yarn
yarn node:start
yarn contracts:deploy
yarn web:start
```

There's a number of other commands in the package.json which hopefully should be clear what they do

# On the SNARKs

The maze solution is public (and in the UI!) but you could imagine this not being shown to the user or in the repo.

We really shouldn't commit all these built artefacts, but they are there for interest and easy collaboration.

# Troubleshooting

99% of the problems when running locally come down to:

- Need to reset your MetaMask wallet.
- Didn't successfully run `contracts:deploy` (probably due to a TypeScript issue where in tsconfig.json `module` needs to be `commonjs` (we should fix this!).
- The contracts were deployed twice which results in different contract addresses it won't work.
- The app's got into some weird state. Use the clear storage button top right and reload the page.
- Your wallet isn't set to use the local network (i.e. localhost:8545).
- Your wallet isn't using the local network.

If you experience any other issues, let us know!
