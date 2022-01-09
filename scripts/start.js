async function main() {
    const [p1, p2] = await hre.ethers.getSigners();
    const keyboardsContractFactory = await hre.ethers.getContractFactory("Keyboards");
    const keyboardsContract = await keyboardsContractFactory.deploy();
    await keyboardsContract.deployed();

    console.log("Keyboards contract address:", keyboardsContract.address);

    let keyboards = await keyboardsContract.getKeyboards();
    console.log("Keyboards:", keyboards);

    const keyboardTxn1 = await keyboardsContract.create("A really great keyboard!");
    await keyboardTxn1.wait();

    const keyboardTxn2 = await keyboardsContract.connect(p2).create("An even better keyboard!");
    await keyboardTxn2.wait();

    keyboards = await keyboardsContract.getKeyboards();
    console.log("Keyboards:", keyboards);

    keyboards = await keyboardsContract.connect(p2).getKeyboards();
    console.log("As somebody else:", keyboards);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });