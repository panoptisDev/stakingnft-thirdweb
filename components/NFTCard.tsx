import { FC} from 'react';
import { ThirdwebNftMedia, useContract, useNFT, Web3Button } from '@thirdweb-dev/react';

interface NFTCardProps {
    tokenId: number;
}

const NFTCard: FC<NFTCardProps> = ({tokenId}) => {
    const bonsaiAddress = "0x51f7d21aa7B67e78700eFB0503c46BAF2f3A93B9";
    const stakingAddress = "0x4B0FBC5D574941D1C69092f1BeF6B1D0a6515Fb4";
  
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