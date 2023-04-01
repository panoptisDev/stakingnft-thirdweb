import { FC} from 'react';
import { ThirdwebNftMedia, useContract, useNFT, Web3Button } from '@thirdweb-dev/react';

interface NFTCardProps {
    tokenId: number;
}

const NFTCard: FC<NFTCardProps> = ({tokenId}) => {
    const bonsaiAddress = "0x027E551902EF89c8Ccb4DC2C71b2aA6E7B6dbB96";
    const stakingAddress = "0x2Aa7A57FB7D668401BE306e814cc14850Be6c969";
  
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