let web3;
let accounts;
let contract;

const contractAddress = "0x32880ed747bc5bbe4a2712682004398f32a16e0c";  // ใส่ Smart Contract Staking G3X24
const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039";   // ใส่ Token Address G3X24

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    accounts = await web3.eth.getAccounts();
    contract = new web3.eth.Contract(stakingABI, contractAddress);
    document.getElementById("wallet").innerText = "Connected: " + accounts[0];
  } else {
    alert("Please install MetaMask");
  }
}

async function stake() {
  const amount = document.getElementById("amount").value;
  const duration = document.getElementById("duration").value;
  const decimals = 18;
  const amountInWei = web3.utils.toBN(amount * 10 ** decimals);
  const token = new web3.eth.Contract([
    {"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"name":"approve","outputs":[],"type":"function"},
    {"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"type":"function"}
  ], tokenAddress);

  const allowance = await token.methods.allowance(accounts[0], contractAddress).call();

  if (web3.utils.toBN(allowance).lt(amountInWei)) {
    await token.methods.approve(contractAddress, amountInWei).send({ from: accounts[0] });
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
