
let web3;
let contract;
let tokenContract;
const contractAddress = "0x8831b1D039446948bde1dc3b3973d11dde44a0e1";
const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039";
const abi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "CLAIM_INTERVAL",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "calculateRewards",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "depositRewardPool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getStakeInfo",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "startTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "tierDays",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lastClaimTime",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "withdrawn",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardPool",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tierDays",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "apr",
        "type": "uint256"
      }
    ],
    "name": "setTierAPR",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "tierDays",
        "type": "uint256"
      }
    ],
    "name": "stake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "stakes",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "startTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "tierDays",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lastClaimTime",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "withdrawn",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tierAPR",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unstake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const tokenAbi = [
  {"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],
   "name":"allowance","outputs":[{"name":"","type":"uint256"}],"type":"function"},
  {"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],
   "name":"approve","outputs":[{"name":"","type":"bool"}],"type":"function"},
  {"constant":true,"inputs":[{"name":"account","type":"address"}],
   "name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"type":"function"}
];

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    document.getElementById("walletAddress").innerText = "Connected: " + accounts[0];
    contract = new web3.eth.Contract(abi, contractAddress);
    tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);
  } else {
    alert("Please install MetaMask");
  }
}

async function stake() {
  const amount = document.getElementById("stakeAmount").value;
  const tier = document.getElementById("tierSelect").value;
  const accounts = await web3.eth.getAccounts();
  const from = accounts[0];
  const amountWei = web3.utils.toWei(amount);

  const allowance = await tokenContract.methods.allowance(from, contractAddress).call();
  if (parseInt(allowance) < parseInt(amountWei)) {
    await tokenContract.methods.approve(contractAddress, web3.utils.toTwosComplement(-1)).send({ from });
    alert("Approved successfully. Now staking...");
  }

  await contract.methods.stake(amountWei, tier).send({ from });
  alert("Stake successful!");
}

async function claim() {
  const accounts = await web3.eth.getAccounts();
  await contract.methods.claimRewards().send({ from: accounts[0] });
  alert("Claimed successfully!");
}

async function unstake() {
  const accounts = await web3.eth.getAccounts();
  await contract.methods.unstake().send({ from: accounts[0] });
  alert("Unstaked successfully!");
}

document.getElementById("connectButton").onclick = connectWallet;
