import { FC} from 'react';
import { ThirdwebNftMedia, useContract, useNFT, Web3Button } from '@thirdweb-dev/react';

interface NFTCardProps {
    tokenId: number;
}

const NFTCard: FC<NFTCardProps> = ({tokenId}) => {
    const bonsaiAddress = "0x9A4C4B3D84A741bc9e7d9Ee2055fc0bB7B92d964";
    const stakingAddress = "0x0b424429676Dc2338cB0A87d41F479d34b6c5D67";
  
    const { contract: bonsaiContract } = useContract(bonsaiAddress, "nft-drop");
    const { contract: stakingContract} = useContract(stakingAddress);
    const { data: nft } = useNFT(bonsaiContract, tokenId);

    async function withdraw(nftId: string) {
        await stakingContract?.call("withdraw",[nftId]);
    }
    return (
        <>
            {nft && (
                <div>
                    <h3>{nft.metadata.name} </h3>
                    {nft.metadata && (
                        <ThirdwebNftMedia 
                            metadata={nft.metadata}
                        />
                    )}
                    <Web3Button
                        contractAddress={stakingAddress}
                        action={() => withdraw(nft.metadata.id)}
                    >Withdraw</Web3Button>
                </div>
            )}
        </>
    )
}
export default NFTCard;