import { useContract, useAddress, Web3Button, ThirdwebNftMedia, useOwnedNFTs, useContractRead } from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import NFTCard from "../components/NFTCard";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const address = useAddress();

  const bonsaiAddress = "0x51f7d21aa7B67e78700eFB0503c46BAF2f3A93B9";
  const stakingAddress = "0x4B0FBC5D574941D1C69092f1BeF6B1D0a6515Fb4";

  const { contract: bonsaiContract } = useContract(bonsaiAddress, "nft-drop");
  const { contract: stakingContract} = useContract(stakingAddress);

  const { data:myBonsaiNFTs} = useOwnedNFTs(bonsaiContract, address);
  const { data: stakedBonsaiNFTs } = useContractRead(stakingContract, "getStakeInfo", address);

  async function stakeNFT (nftId: string) {
    if(!address) return;

    const isApproved = await bonsaiContract?.isApproved(
      address,
      stakingAddress
    );

    if ( !isApproved) {
      await bonsaiContract?.setApprovalForAll(stakingAddress, true);
    }

    await stakingContract?.call("stake", [nftId])
  }

  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();

  useEffect(() => {
    if(!stakingContract || !address) return;

    async function loadClaimableRewards() {
      const stakeInfo = await stakingContract?.call("getStakeInfo", address);
      setClaimableRewards(stakeInfo[1]);
    }

    loadClaimableRewards();
  }, [address, stakingContract]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>LitOne NFTs</h1>
        <Web3Button
        contractAddress={bonsaiAddress}
        action={(bonsaiContract) => bonsaiContract.erc721.claim(1)}
        >Claim LitOne NFTs        
        </Web3Button>
        <br />
        <h1>My LitOne NFTs</h1>
        <div>
          {myBonsaiNFTs?.map((nft) =>(
            // eslint-disable-next-line react/jsx-key
            <div>
              <h3>{nft.metadata.name} </h3>
              <ThirdwebNftMedia 
              metadata={nft.metadata}
              height="100px"
              width="100px"
              />
              <Web3Button
                contractAddress={stakingAddress}
                action={() => stakeNFT(nft.metadata.id)}
              >Stake Lit</Web3Button>
            </div>
          ))}
        </div>
        <h1>Staked LitOne NFTs</h1>
        <h2>Open Coming soon </h2>
        <div>
          {stakedBonsaiNFTs && stakedBonsaiNFTs[0].map((stakedNFT: BigNumber) => (
            <div key={stakedNFT.toString()}>
              <NFTCard tokenId={stakedNFT.toNumber()} />
            </div>
          ))}
        </div>
        <br />
        <h1>Claimable $LIT:</h1>
        {!claimableRewards ? "Loading..." : ethers.utils.formatUnits(claimableRewards, 18)}
        <Web3Button
          contractAddress={stakingAddress}
          action={(stakingContract) => stakingContract.call("claimRewards")}
        >Claim $LIT</Web3Button>
      </main>
    </div>
  );
};

export default Home;
