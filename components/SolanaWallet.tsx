import React, { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair, Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

interface SolanaWalletProps {
  mnemonic: string;
}

const SolanaWallet: React.FC<SolanaWalletProps> = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [publicKeys, setPublicKeys] = useState<PublicKey[]>([]);
  const [balances, setBalances] = useState<{ [key: string]: number }>({});

  const connection = new Connection(clusterApiUrl("devnet"));

  const fetchBalance = async (publicKey: PublicKey) => {
    try {
      const balance = await connection.getBalance(publicKey);
      setBalances((prev) => ({
        ...prev,
        [publicKey.toBase58()]: balance / 1e9, // Convert lamports to SOL
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
          const path = `m/44'/501'/${currentIndex}'/0'`;
          const derivedSeed = derivePath(path, seed.toString("hex")).key;
          const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
          const keypair = Keypair.fromSecretKey(secret);
          const publicKey = keypair.publicKey;

          setCurrentIndex(currentIndex + 1);
          setPublicKeys([...publicKeys, publicKey]);
          fetchBalance(publicKey);
        }}
      >
        Add Solana Wallet
      </button>
      {publicKeys.map((p) => (
        <div key={p.toBase58()}>
          {p.toBase58()} - Balance: {balances[p.toBase58()] || "Fetching..."} SOL
        </div>
      ))}
    </div>
  );
};

export default SolanaWallet;
