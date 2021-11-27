Turn based fantasy campaign game powered by Chainlink VRF and user imagination

# Team


# To get it running

```
yarn
yarn node:start
yarn contracts:deploy
yarn web:start
```

There's a number of other commands in the package.json which hopefully should be clear what they do from their names.

# About the SNARKs

**Warning! Some of this is not best practice!**

When the user get so the end point of the maze, the SNARK circuit validates all their moves to check whether they got there legitimately. In some ways you could consider this a rollup 🤔... You can see the tests in the [circuits.test.ts](./circuits/circuits.test.ts).

The circuits themselves are fairly rough and don't check for common attacks but should work fine as a PoC. The input is also limited to just 200 steps - if the user does more than that, validator will throw. This is to keep the performance pretty much realtime.

The maze solution is public ([circuitMap.js](./src/Maze/circuitMap.js) plus the generated [getMaze.circom](./circuits/functions/getMaze.circom)) as well as being shown in the UI but you could imagine this being omitted from the repo and obfuscated from the user. Furthermore since we don't enforce the proof being submitted only once, it's possible to inspect the contract transaction history on the blockchain, extract the proof and then submit it yourself. But that's easy enough to defend against.

Many of the build artefacts that are committed to the repo shouldn't be, but they are there for interest and easy collaboration.

# Troubleshooting

Inevitable bugs from writing a game at breakneck speed in spare time aside, 99% of the problems when running locally come down to:

- Need to reset your MetaMask wallet.
- Didn't successfully run `contracts:deploy` (probably due to a TypeScript issue where in tsconfig.json `module` needs to be `commonjs` (we should fix this!).
- The contracts were deployed twice which results in different contract addresses it won't work.
- The app's got into some weird state. Use the clear storage button top right and reload the page.
- Your wallet isn't set to use the local network (i.e. localhost:8545).
- Your wallet isn't using the local network.
- The app stays on the oracle modal. It takes about 30 seconds for the event to be emitted that clears this modal but there's a chance something else went wrong. If it doesn't clear in 30 seconds reload the page.

If you experience any other issues, let us know!

# Thanks

Thanks specifically to [
Andrija Novakovic](https://github.com/akinovak) for their ultra fast reply in the Iden3 Telegram with some sample code for getting the prover working in the browser... but also thanks to Iden3 in general for all their work.