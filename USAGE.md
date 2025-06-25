# Module Usage

This document explains how to use the main `uploadNft` function provided by this module.

## Example

Here is a complete example of how to import and use the `uploadNft` function in a Node.js environment:

```typescript
// Example: mint-nft.ts

import { Keypair } from "@metaplex-foundation/umi";
import {
    uploadNft, // Assuming this is the main exported function from your module
    MetaDataInput
} from "simple-metaplex"; // Use your actual package name here
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    try {
        // --- 1. Prepare Inputs ---
        console.log("Preparing NFT data...");

            // Load App Keypair from environment variable
        const privateKeyBase58EnvVar = process.env.SERVER_PRIVATE_KEY_BASE58!;
        const publicKeyEnvVar = process.env.SERVER_PUBLIC_KEY!;
    
        const expectedPublicKey = publicKeyEnvVar as UmiPublicKey;
        const umiTemp = createUmi(process.env.RPC_URL || "https://api.devnet.solana.com");
        let appKeyPair: UmiKeypair;
    
        try {
        appKeyPair = umiTemp.eddsa.createKeypairFromSecretKey(bs58.decode(privateKeyBase58EnvVar));
        } catch (error) {
        throw new Error(
            "Failed to derive keypair via UMI from the provided secret key. Ensure the secret key is valid."
        );
        }
    
        if (appKeyPair.publicKey !== expectedPublicKey) {
        throw new Error(
            "Derived public key does not match the expected public key. " +
            "Please check that you have the correct private key for the intended public key."
        );
        }

        // Load Image File (Example - adjust the path!)
        const imagePath = path.join(__dirname, 'assets', 'my_nft_image.png'); // ADJUST THIS PATH
        const imageBuffer = await fs.readFile(imagePath);

        // Define NFT Metadata
        const metaData: MetaDataInput = {
            name: "My First Module NFT",
            description: "This NFT was created easily using the custom module!",
            symbol: "MODNFT",
            sellerFeeBasisPoints: 500, // Represents 5.00% royalty
            imageFile: imageBuffer, // Provide the image data as a Buffer or File object
            // --- OR --- use a pre-uploaded URI instead of imageFile:
            // imageUri: "",
            attributes: [
                { trait_type: "Background", value: "Blue" },
                { trait_type: "Type", value: "Example" },
            ],
            properties: {
                files: [
                    // imageFile/imageUri is automatically added by the module.
                    // Add other files like animation_url if needed:
                    // { uri: "", type: "video/mp4" }
                ],
                category: "image", // e.g., "image", "video", "audio", "vr", "html"
                creators: [ // Off-chain metadata creators list
                    { address: appKeyPair.publicKey.toString(), share: 100 }
                ],
            },
            // collection: { key: "YOUR_COLLECTION_MINT_ADDRESS" }, // Optional: Add if part of a verified collection
            // externalUri: "[https://yoursite.com/nft/details/123](https://yoursite.com/nft/details/123)" // Optional: Link to external site page for this NFT
        };

        // Define Service Input for the main function
        const input = {
            metaData: metaData,
            rpcUrl: process.env.SOLANA_RPC_URL || "[https://api.devnet.solana.com](https://api.devnet.solana.com)",
            irysUrl: process.env.IRYS_URL || "[https://devnet.irys.xyz](https://devnet.irys.xyz)",
            appKeyPair: appKeyPair, // The keypair that signs and pays
            unchangable: false, // Optional: Set true for immutable NFT metadata (default: false)
        };

        // 'uploadNft' should be the main function exported by your module's index.ts
        const result = await uploadNft(input);

        // --- 3. Use the Output ---
        console.log("--------------------------");
        console.log("NFT Creation Successful!");
        console.log("--------------------------");
        console.log(`Mint Address: ${result.mintAddress}`);
        console.log(`Transaction Signature: ${result.transactionSignature}`);
        console.log(`Metadata URL (Irys): ${result.metadataUrl}`);
        console.log(`Image URL (Irys/Provided): ${result.imageUrl}`);
        console.log("--------------------------");

        // You can now store result.mintAddress in your database or use it otherwise.

    } catch (error) {
        console.error("--------------------------");
        console.error("NFT Creation Failed:");
        console.error(error); // Log the full error object for details
        console.error("--------------------------");
    }
}

main();