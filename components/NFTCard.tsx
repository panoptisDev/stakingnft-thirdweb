import { FC} from 'react';
import { ThirdwebNftMedia, useContract, useNFT, Web3Button } from '@thirdweb-dev/react';

interface NFTCardProps {
    tokenId: number;
}

const NFTCard: FC<NFTCardProps> = ({tokenId}) => {
    const bonsaiAddress = "0x56f41ff18a7E45ee4E5faf3f61114F80b8926885"; //shrimp nft
    const stakingAddress = "0x5C35579DE9edEEf0806653b0053151cB9d6744Ad"; // staking contract
  
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
