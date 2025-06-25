# simple-metaplex

A simplified Node.js module for creating Metaplex NFTs (NonFungible or ProgrammableNonFungible) on the Solana blockchain using UMI, with metadata and optional image file upload handled via Irys (formerly Bundlr).

## Features

* Simplifies the Metaplex NFT creation process.
* Handles image file (`Buffer` or `File`) upload to Irys.
* Supports using pre-uploaded image URIs.
* Constructs and uploads JSON metadata to Irys.
* Mints the NFT on Solana using UMI and `mpl-token-metadata`.
* Confirms asset creation on-chain with retries.
* Optionally transfers the newly minted NFT to one or more recipients.
* Supports both standard `NonFungible` and `ProgrammableNonFungible` token standards.

## Prerequisites

* Node.js (v18.0.0 or higher recommended - see `package.json` engines)
* An Arweave wallet funded with AR tokens (for Irys uploads) or SOL (if using Solana funding for Irys - requires configuration).
* A Solana wallet (Keypair) for the application/minter, funded with SOL to pay for transaction fees.
* Environment variables set up for:
    * `APP_PRIVATE_KEY`: The secret key of your application's Solana wallet (e.g., as a JSON array string). **Keep this secure!**
    * `SOLANA_RPC_URL`: The Solana RPC endpoint (e.g., `https://api.devnet.solana.com` or your custom RPC).
    * `IRYS_URL`: The Irys network node URL (e.g., `https://devnet.irys.xyz` for devnet, `https://node1.irys.xyz` or `https://node2.irys.xyz` for mainnet).

## Installation

```bash
npm install simple-metaplex