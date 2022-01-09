import { useState, useEffect } from "react";
import PrimaryButton from "../components/primary-button";
import Keyboard from "../components/keyboard";

import { ethers } from "ethers";
import abi from "../utils/Keyboards.json";

export default function Home() {
  const [ethereum, setEthereum] = useState(undefined);
  const [connectedAccount, setConnectedAccount] = useState(undefined);
  const [keyboards, setKeyboards] = useState([]);
  const [keyboardsLoading, setKeyboardsLoading] = useState(false);

  const contractAddress = "0x85A809b0DEECd5C544043583C9E92FaCDD9aF82e";
  const contractABI = abi.abi;

  const handleAccounts = (accounts) => {
    if (accounts.length > 0) {
      console.log("Authorized account:", accounts[0]);
      setConnectedAccount(accounts[0]);
    } else {
      console.log("No account authorized");
    }
  };

  const getConnectedAccount = async () => {
    if (window.ethereum) {
      setEthereum(window.ethereum);
    }

    if (ethereum) {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      handleAccounts(accounts);
    }
  };

  useEffect(() => { getConnectedAccount(); });

  const connectAccount = () => {
    if (!ethereum) {
      alert('MetaMask is required to connect an account');
      return;
    }

    const accounts = ethereum.request({ method: "eth_requestAccounts" });
    handleAccounts(accounts);
  };

  const getKeyboards = async () => {
    if (ethereum && connectedAccount) {
      setKeyboardsLoading(true);

      try {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
  
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
        const keyboards = await contract.getKeyboards();
        console.log("Retrieved keyboards...", keyboards);

        setKeyboards(keyboards);
      } finally {
        setKeyboardsLoading(false);
      }
    }
  };

  useEffect(() => getKeyboards(), [connectedAccount]);

  if (!connectedAccount) {
    return <PrimaryButton onClick={connectAccount}>Connect MetaMask Wallet</PrimaryButton>
  }

  if (keyboards.length > 0) {
    return (
      <div className="flex flex-col gap-4">
        <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
          {keyboards.map(
            ([kind, isPBT, filter], i) => (
              <Keyboard key={i} kind={kind} isPBT={isPBT} filter={filter} />
            )
          )}
        </div>
      </div>
    )
  }

  if (keyboardsLoading) {
    return (
      <div className="flex flex-col gap-4">
        <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
        <p>Loading Keyboards...</p>
      </div>
    )
  }

  // No keyboards yet
  return (
    <div className="flex flex-col gap-4">
      <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
      <p>No keyboards yet!</p>
    </div>
  )
}