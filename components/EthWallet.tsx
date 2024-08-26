import React, { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet, ethers } from "ethers";

interface EthWalletProps {
  mnemonic: string;
}

const EthWallet: React.FC<EthWalletProps> = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [addresses, setAddresses] = useState<string[]>([]);
  const [balances, setBalances] = useState<{ [key: string]: string }>({});

  const provider = new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");

  const fetchBalance = async (address: string) => {
    try {
      const balance = await provider.getBalance(address);
      setBalances((prev) => ({
        ...prev,
        [address]: ethers.formatEther(balance), // Convert wei to ETH
      }));
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  return (
    <div className="space-y-4">
      <button
        className="bg-white text-primary p-2 rounded"
        onClick={async function () {
          const seed = await mnemonicToSeed(mnemonic);
          const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
          const hdNode = HDNodeWallet.fromSeed(seed);
          const child = hdNode.derivePath(derivationPath);
          const wallet = new Wallet(child.privateKey);

          setCurrentIndex(currentIndex + 1);
          setAddresses([...addresses, wallet.address]);
          fetchBalance(wallet.address);
        }}
      >
        Add ETH Wallet
      </button>
      {addresses.map((p) => (
        <div key={p}>
          {p} - Balance: {balances[p] || "Fetching..."} ETH
        </div>
      ))}
    </div>
  );
};

export default EthWallet;
