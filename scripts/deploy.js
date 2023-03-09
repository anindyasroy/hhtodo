//imports
const { ethers, run, network } = require("hardhat");

//async main function
async function main() {
    const todoFactory = await ethers.getContractFactory("TodoDapp");
    console.log("Deploying Contract....");
    const todoContract = await todoFactory.deploy();
    await todoContract.deployed();
    const contractAddress = todoContract.address;
    console.log(contractAddress);
    console.log(network.config);
    if (network.config.chainId == 5 && process.env.ETHERSCAN_API_KEY) {
        console.log("waiting for block confirmation");
        await todoContract.deployTransaction.wait(6);
        await verify(contractAddress, []);
    }
    const createTask = await todoContract.createTask("task1");
    await createTask.wait(1);
    await todoContract.createTask("task2");
    const totaltasks = await todoContract.totalTasks();
    console.log(totaltasks);
}
async function verify(contractAddress, args) {
    console.log("verifying contract....");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("ALready verified");
        } else {
            console.log(e);
        }
    }
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
