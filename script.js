let web3;
let contract;
let tokenContract;
let accounts;

const contractAddress = "0x32880ed747bc5bbe4a2712682004398f32a16e0c"; // G3X Staking Contract
const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039"; // G3X Token Address

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        accounts = await web3.eth.getAccounts();
        contract = new web3.eth.Contract(stakingABI, contractAddress);
        tokenContract = new web3.eth.Contract([
            {"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"},
            {"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"type":"function"},
            {"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"type":"function"}
        ], tokenAddress);
        document.getElementById("walletAddress").innerText = accounts[0];
    } else {
        alert("Please install MetaMask!");
    }
}

async function stake() {
    const amount = document.getElementById("stakeAmount").value;
    const days = document.getElementById("stakeDays").value;
    const decimals = await tokenContract.methods.decimals().call();
    const stakeAmount = web3.utils.toWei(amount, 'ether');

    const allowance = await tokenContract.methods.allowance(accounts[0], contractAddress).call();
    if (parseInt(allowance) < parseInt(stakeAmount)) {
        await tokenContract.methods.approve(contractAddress, web3.utils.toWei('1000000000', 'ether')).send({from: accounts[0]});
    }

    await contract.methods.stake(stakeAmount, days).send({from: accounts[0]});
}

async function claim() {
    const index = document.getElementById("stakeIndex").value;
    await contract.methods.claim(index).send({from: accounts[0]});
}

async function unstake() {
    const index = document.getElementById("stakeIndex").value;
    await contract.methods.unstake(index).send({from: accounts[0]});
}
