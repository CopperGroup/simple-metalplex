import { generateSigner, none, percentAmount, publicKey, Signer, some, Umi } from "@metaplex-foundation/umi";
import { MetaDataInput } from "../types.js";
import { createNft, Creator, TokenStandard } from "@metaplex-foundation/mpl-token-metadata";

interface MintResult {
    mintSigner: Signer;
    signature: Uint8Array;
    tokenStandard: TokenStandard;
}

export async function uploadNft(
    umi: Umi,
    metaData: MetaDataInput,
    metadataUrl: string,
    onChainCreators: Creator[],
    unchangable: boolean = false,
    tokenStandard: TokenStandard
): Promise<MintResult> {
    const mintSigner: Signer = generateSigner(umi);

    const nftInputArgs = {
        mint: mintSigner,
        authority: umi.identity,
        name: metaData.name,
        uri: metadataUrl,
        sellerFeeBasisPoints: percentAmount(metaData.sellerFeeBasisPoints / 100, 2),
        creators: some(onChainCreators),
        isMutable: !unchangable,
        collection: metaData.collection ? some(publicKey(metaData.collection.key)) : none(),
        tokenStandard,
    };

    const txBuilder = createNft(umi, nftInputArgs as any);

    try {
        const { signature } = await txBuilder.sendAndConfirm(umi, {
            confirm: { commitment: "confirmed" },
        });

        return { mintSigner, signature, tokenStandard };

    } catch (error) {
        throw error;
    }
}