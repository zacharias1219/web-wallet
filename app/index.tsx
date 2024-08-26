import React, { useState } from "react";
import Layout from "@/components/layout";
import { generateMnemonic } from "bip39";
import SolanaWallet from "@/components/SolanaWallet";
import EthWallet from "@/components/EthWallet";

const Home: React.FC = () => {
  const [mnemonic, setMnemonic] = useState<string>("");

  return (
    <Layout>
      <div className="space-y-4">
        <div>
          <button
            className="bg-white text-primary p-2 rounded"
            onClick={async function () {
              const mn = await generateMnemonic();
              setMnemonic(mn);
            }}
          >
            Create Seed Phrase
          </button>
        </div>
        <div>
          <input
            className="w-full p-2 text-primary"
            type="text"
            value={mnemonic}
            readOnly
          />
        </div>
        {mnemonic && (
          <>
            <SolanaWallet mnemonic={mnemonic} />
            <EthWallet mnemonic={mnemonic} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Home;
