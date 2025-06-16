let web3;
let contract;
let accounts;

const contractAddress = "0x32880ed747bc5bbe4a2712682004398f32a16e0c";  // G3X24 Staking Contract
const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039";    // G3X Token

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        accounts = await web3.eth.getAccounts();
        document.getElementById("walletAddress").innerText = "Connected: " + accounts[0];
        contract = new web3.eth.Contract(abi, contractAddress);
    } else {
        alert("Please install MetaMask.");
    }
}

async function stake() {
    const amount = document.getElementById("stakeAmount").value;
    const duration = parseInt(document.getElementById("duration").value);

    const token = new web3.eth.Contract([
        { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "type": "function" },
        { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "type": "function" }
    ], tokenAddress);

    const decimals = await token.methods.decimals().call();
    const stakeAmount = BigInt(amount * (10 ** decimals)).toString();

    // Approve first
    await token.methods.approve(contractAddress, stakeAmount).send({ from: accounts[0] });

    // Stake after approved
    await contract.methods.stake(stakeAmount, duration).send({ from: accounts[0] });

    alert("Stake Success!");
}

async function claim() {
    const index = document.getElementById("stakeIndex").value;
    await contract.methods.claim(index).send({ from: accounts[0] });
    alert("Claim Success!");
}

async function unstake() {
    const index = document.getElementById("stakeIndex").value;
    await contract.methods.unstake(index).send({ from: accounts[0] });
    alert("Unstake Success!");
}
