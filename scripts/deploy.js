async function main() {
    const keyboardsContractFactory = await hre.ethers.getContractFactory("Keyboards");
    const keyboardsContract = await keyboardsContractFactory.deploy();
    await keyboardsContract.deployed();

    console.log("Keyboards contract deployed to:", keyboardsContract.address);

    let keyboards = await keyboardsContract.getKeyboards();
    console.log("Keyboards:", keyboards);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    }
);