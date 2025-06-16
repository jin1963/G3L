let web3;
let contract;
let accounts;

const contractAddress = "0x32880ed747bc5bbe4a2712682004398f32a16e0c";  // G3X24 Staking Contract
const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039";    // G3X Token Address

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        accounts = await web3.eth.getAccounts();
        contract = new web3.eth.Contract(stakingABI, contractAddress);
        document.getElementById("walletAddress").innerText = "Connected: " + accounts[0];
    } else {
        alert("Please install MetaMask");
    }
}

async function stake() {
    const amount = document.getElementById("amount").value;
    const duration = document.getElementById("duration").value;
    const amountInWei = web3.utils.toWei(amount, "ether");

    const tokenContract = new web3.eth.Contract([
        { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "type": "function" }
    ], tokenAddress);

    const allowance = await tokenContract.methods.allowance(accounts[0], contractAddress).call();

    if (parseInt(allowance) < parseInt(amountInWei)) {
        await tokenContract.methods.approve(contractAddress, web3.utils.toTwosComplement(-1)).send({ from: accounts[0] });
    }

    await contract.methods.stake(amountInWei, duration).send({ from: accounts[0] });
}

async function claim() {
    const index = document.getElementById("index").value;
    await contract.methods.claim(index).send({ from: accounts[0] });
}

async function unstake() {
    const index = document.getElementById("index").value;
    await contract.methods.claim(index).send({ from: accounts[0] });
}
