import { useState, useEffect } from "react";
import PrimaryButton from "../components/primary-button";

import { ethers } from "ethers";
import abi from "../utils/Keyboards.json";

export default function Home() {
  const [ethereum, setEthereum] = useState(undefined);
  const [connectedAccount, setConnectedAccount] = useState(undefined);
  const [keyboards, setKeyboards] = useState([]);
  const [newKeyboard, setNewKeyboard] = useState("");

  const contractAddress = "0xe20A601DbF1418B0b7f567D26BEe253c4059F6F1";
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
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const keyboards = await contract.getKeyboards();
      console.log("Retrieved keyboards...", keyboards);
      setKeyboards(keyboards);
    }
  };

  useEffect(() => getKeyboards(), [connectedAccount]);

  const submitCreate = async (e) => {
    e.preventDefault();

    if (!ethereum) {
      console.error('Ethereum object is required to create a keyboard');
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const txn = await contract.create(newKeyboard);
    console.log("Create transaction started...", txn.hash);

    await txn.wait();
    console.log("Created Keyboard!", txn.hash);

    await getKeyboards();
  };

  if (!ethereum) {
    return <p>Please install MetaMask to connect to this site</p>
  }

  if (!connectedAccount) {
    return <PrimaryButton onClick={connectAccount}>Connect MetaMask Wallet</PrimaryButton>
  }

  return (
    <div className="flex flex-col gap-y-8">
      <form className="flex flex-col gap-y-2">
        <div>
          <label htmlFor="keyboard-description" className="block text-sm font-medium text-gray-700">
            Keyboard Description
          </label>
        </div>
        <input
          name="keyboard-type"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={newKeyboard}
          onChange={(e) => { setNewKeyboard(e.target.value) }}
        />
        <PrimaryButton type="submit" onClick={submitCreate}>
          Create Keyboard!
        </PrimaryButton>
      </form>

      <div>{keyboards.map((keyboard, i) => <p key={i}>{keyboard}</p>)}</div>
    </div>
  )
}