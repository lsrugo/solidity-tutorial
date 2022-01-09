async function main() {
  const [p1, p2] = await hre.ethers.getSigners();
  const keyboardsContractFactory = await hre.ethers.getContractFactory(
    "Keyboards"
  );
  const keyboardsContract = await keyboardsContractFactory.deploy();
  await keyboardsContract.deployed();

  console.log("Keyboards contract address:", keyboardsContract.address);

  const keyboardTxn1 = await keyboardsContract.create(0, true, "Sepia");
  const keyboardTxnReceipt = await keyboardTxn1.wait();
  console.log(keyboardTxnReceipt.events);

  keyboards = await keyboardsContract.getKeyboards();
  console.log("Keyboards:", keyboards);

  const balanceBefore = await hre.ethers.provider.getBalance(
    p2.address
  );
  console.log(
    "p2 balance before!",
    hre.ethers.utils.formatEther(balanceBefore)
  );

  const tipTxn = await keyboardsContract.connect(p2).tip(0, {
    value: hre.ethers.utils.parseEther("1000"),
  }); // tip the 2nd keyboard as owner!
  const tipTxnReceipt = await tipTxn.wait();
  console.log(tipTxnReceipt.events);

  const balanceAfter = await hre.ethers.provider.getBalance(
    p2.address
  );
  console.log(
    "p2 balance after!",
    hre.ethers.utils.formatEther(balanceAfter)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
