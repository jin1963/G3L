
let web3;
let contract;
const contractAddress = "0x27d82cC200033D8eCf6B5558EbE60Ca212338A4F";
const abi = [{"inputs": [{"internalType": "address", "name": "_token", "type": "address"}], "stateMutability": "nonpayable", "type": "constructor"}, {"inputs": [], "name": "CLAIM_INTERVAL", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "address", "name": "user", "type": "address"}, {"internalType": "uint256", "name": "index", "type": "uint256"}], "name": "calculateReward", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "uint256", "name": "index", "type": "uint256"}], "name": "claimRewards", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}], "name": "depositRewardPool", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "address", "name": "user", "type": "address"}], "name": "getStakeCount", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "address", "name": "user", "type": "address"}, {"internalType": "uint256", "name": "index", "type": "uint256"}], "name": "getStakeInfo", "outputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}, {"internalType": "uint256", "name": "startTime", "type": "uint256"}, {"internalType": "uint256", "name": "tierDays", "type": "uint256"}, {"internalType": "uint256", "name": "lastClaimTime", "type": "uint256"}, {"internalType": "bool", "name": "withdrawn", "type": "bool"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "getTotalStaked", "outputs": [{"internalType": "uint256", "name": "total", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "owner", "outputs": [{"internalType": "address", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "rewardPool", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "uint256", "name": "tierDays", "type": "uint256"}, {"internalType": "uint256", "name": "apr", "type": "uint256"}], "name": "setTierAPR", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}, {"internalType": "uint256", "name": "tierDays", "type": "uint256"}], "name": "stake", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "uint256", "name": "index", "type": "uint256"}], "name": "unstake", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [], "name": "token", "outputs": [{"internalType": "contract IERC20", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"}];

async function connectWallet() {
  console.log("🔌 Connecting wallet...");
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    const user = accounts[0];
    document.getElementById("walletAddress").innerText = "Connected: " + user;
    contract = new web3.eth.Contract(abi, contractAddress);
    startPolling(user);
  }
}

async function startPolling(user) {
  console.log("📡 Start polling for:", user);
  updateTotalStaked();
  updateStakeList(user);
  setInterval(async () => {
    updateTotalStaked();
    updateStakeList(user);
  }, 10000);
}

async function updateTotalStaked() {
  console.log("📊 Fetching total staked...");
  const total = const total = await contract.methods.getTotalStaked().call();
  console.log("✅ Total staked (raw):", total);
  document.getElementById("totalStaked").innerText = (web3.utils.fromWei(total) + " G3X");
}

async function updateStakeList(user) {
  console.log("📋 Getting stake list for:", user);
  const count = await contract.methods.getStakeCount(user).call();
  const container = document.getElementById("stakeList");
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const s = const s = await contract.methods.getStakeInfo(user, i).call();
    console.log(`➡️ Stake #${i}`, s);
    const now = Math.floor(Date.now() / 1000);
    const unlock = parseInt(s.startTime) + parseInt(s.tierDays) * 86400;
    const remaining = Math.max(unlock - now, 0);
    const minutes = Math.floor(remaining / 60);
    const html = `
      <div>
        ✅ Stake #${i}: ${web3.utils.fromWei(s.amount)} G3X | Unlock in: ${minutes} min
        ${!s.withdrawn ? `
          <button onclick="claim(${i})">Claim</button>
          <button onclick="unstake(${i})">Unstake</button>
        ` : "(Withdrawn)"}
      </div>
    `;
    container.innerHTML += html;
  }
}

async function stake() {
  const amount = document.getElementById("stakeAmount").value;
  const tier = document.getElementById("tierSelect").value;
  const accounts = await web3.eth.getAccounts();
  await contract.methods.stake(web3.utils.toWei(amount), tier).send({ from: accounts[0] });
  alert("Stake successful!");
}

async function claim(index) {
  const accounts = await web3.eth.getAccounts();
  await contract.methods.claimRewards(index).send({ from: accounts[0] });
  alert("Claimed successfully!");
}

async function unstake(index) {
  const accounts = await web3.eth.getAccounts();
  await contract.methods.unstake(index).send({ from: accounts[0] });
  alert("Unstaked successfully!");
}

document.getElementById("connectButton").onclick = connectWallet;
