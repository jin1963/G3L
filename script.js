let web3;
let contract;
let tokenContract;
let accounts;

const stakingAddress = "0x32880ed747bc5bbe4a2712682004398f32a16e0c"; 
const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039";  

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        accounts = await web3.eth.getAccounts();
        document.getElementById("wallet").innerText = "Connected: " + accounts[0];
        contract = new web3.eth.Contract(abi, stakingAddress);
        tokenContract = new web3.eth.Contract([
            { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "remaining", "type": "uint256" }], "type": "function" },
            { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "type": "function" }
        ], tokenAddress);
    }
}

async function stake() {
    const amount = document.getElementById("stakeAmount").value;
    const days = parseInt(document.getElementById("stakeDays").value);
    const decimals = web3.utils.toBN(10).pow(web3.utils.toBN(18));
    const stakeAmount = web3.utils.toBN(amount).mul(decimals);

    const allowance = await tokenContract.methods.allowance(accounts[0], stakingAddress).call();
    if (web3.utils.toBN(allowance).lt(stakeAmount)) {
        await tokenContract.methods.approve(stakingAddress, web3.utils.toBN("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"))
            .send({ from: accounts[0] });
    }

    await contract.methods.stake(stakeAmount, days).send({ from: accounts[0] });
}

async function claim() {
    const index = document.getElementById("stakeIndex").value;
    await contract.methods.claim(index).send({ from: accounts[0] });
}

async function unstake() {
    const index = document.getElementById("stakeIndex").value;
    await contract.methods.unstake(index).send({ from: accounts[0] });
}
