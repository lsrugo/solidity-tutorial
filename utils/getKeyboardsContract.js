import { ethers } from "ethers";

import abi from "../utils/Keyboards.json"

const contractAddress = '0x7BCC7816227b0db218BC3aE31a6D3E2890FFd14F';
const contractABI = abi.abi;

export default function getKeyboardsContract(ethereum) {
  if(ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  } else {
    return undefined;
  }
}