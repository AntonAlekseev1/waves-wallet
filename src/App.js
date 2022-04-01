import logo from './logo.svg';
import './App.css';
const WeSdk = require('@wavesenterprise/js-sdk');

const config = {
  ...WeSdk.MAINNET_CONFIG,
  nodeAddress: '/node-test/',
  crypto: 'gost', // there are two encryption options 'gost' and 'waves'
  networkByte: 'Z'.charCodeAt(0)
}

const Waves = WeSdk.create({
  initialConfiguration: config,
//  fetchInstance: node-fetch // Browser feature. For Node.js use node-fetch
});

var input = document.getElementById('password');
var button = document.getElementById('send_button');
if(button != null) {
  button.addEventListener('click', () => {
    createSeed(input.value);
  });
}

var addresToInput = document.getElementById('addres_to');
var amountInput = document.getElementById('amount_input');
var sendTransactionButton = document.getElementById('send_transaction_button');
if(sendTransactionButton != null) {
  sendTransactionButton.addEventListener('click', () => {
    brodcastTransaction(addresToInput.value, amountInput.value)
  });
}

var seedPhraseInput = document.getElementById('seed_phrase');
var restoreBtn = document.getElementById('restore_button');
if(restoreBtn != null) {
  restoreBtn.addEventListener('click', () => {
    restoreSeed(seedPhraseInput.value);
  })
}

var contractIdInput = document.getElementById('contract_id');
var versionInput = document.getElementById('contract_version');

var privateDataHashInput = document.getElementById('private_data_hash');
var callContractBtn = document.getElementById('call_contract_btn');
if(callContractBtn != null) {
  callContractBtn.addEventListener('click', () => {
    createParticipant(contractIdInput.value, versionInput.value, privateDataHashInput.value);
  })
}

var dealRecipientAddress = document.getElementById('deal_recipient_address');
var parentDealId = document.getElementById('parent_deal_id');
var externalDealId = document.getElementById('external_deal_id');
var dealPrivacyDataHashInput = document.getElementById('deal_privacy_data_hash');
var dealCallContractBtn = document.getElementById('deal_call_contract_btn');
if(dealCallContractBtn != null) {
  dealCallContractBtn.addEventListener('click', () => {
    createDeal(contractIdInput.value, versionInput.value, dealRecipientAddress.value, 
                parentDealId.value, externalDealId.value, dealPrivacyDataHashInput.value);
  })
}

var dealInput = document.getElementById('deal_id');
var createDealBtn = document.getElementById('create_deal_btn');
if(createDealBtn != null) {
  createDealBtn.addEventListener('click', () => {
    createPayment(contractIdInput.value, versionInput.value, dealInput.value);
  })
}
function createSeed(password) {
	const seed = Waves.Seed.create();
	
	console.log(seed.phrase);
	
	const encrypted = seed.encrypt(password);
	console.log(encrypted);
	const restoredPhrase = Waves.Seed.decryptSeedPhrase(encrypted, password);
  
  console.log(restoredPhrase);
  saveSeedToLocalStorage(seed);

  createMsgBox(seed);
  return seed;
}

function restoreSeed(seedPhrase) {
  const seed = Waves.Seed.fromExistingPhrase(seedPhrase);
  saveSeedToLocalStorage(seed);
  createMsgBox(seed);
}

function saveSeedToLocalStorage(seed) {
  localStorage.setItem('address', seed.address);
  localStorage.setItem('publicKey', seed.keyPair.publicKey);
  localStorage.setItem('privateKey', seed.keyPair.privateKey);
}

function createMsgBox(seed) {
  var html = document.querySelector('html');
          
  var panel = document.createElement('div');
  panel.setAttribute('class', 'msgBox');
  html.appendChild(panel);

  var msg = document.createElement('p')
  msg.textContent = seed.phrase
  panel.appendChild(msg);

  var address = document.createElement('p');
  address.textContent = seed.address;
  panel.appendChild(address);

  var closeBtn = document.createElement('button');
  closeBtn.textContent = 'x';
  panel.appendChild(closeBtn);
  
  closeBtn.onclick = function() {
    panel.parentNode.removeChild(panel);
  }
}

function brodcastTransaction(addressTo, amount) {
  const txBody = {
    sender: localStorage.getItem('address'),
    recipient: addressTo,
    assetId: '',
    amount: parseInt(amount, 10),
    fee: 0,
    attachment: Waves.tools.base58.encode('Examples transfer attachment'),
    timestamp: Date.now()
  };

  const tx = Waves.API.Transactions.Transfer.V3(txBody);

  var keyPair = getKeyPair();
  var result = tx.broadcast(keyPair);
  Promise.resolve(result).then(function(result) {
    console.log(result);
    alert('transaction id: ' + result.id);
  })

}

function createParticipant(contractId, version, privateDataHash) {
  const txBody = {
    contractId: contractId,
    fee: 0,
    sender: localStorage.getItem('address'),
    params: [ {
      key: 'action',
      type: 'string',
      value: 'createParticipant'
    },
    {
      key: 'privateDataHash',
      type: 'string',
      value: privateDataHash
     }
    ],
    contractVersion: parseInt(version, 10),
	timestamp: Date.now(),
    atomicBadge: null
  };

  callContract(txBody);
}

function createDeal(contractId, version, recipientAddress, parentDealId, externalDealId, privacyDataHash) {
  const txBody = {
    contractId: contractId,
    fee: 0,
    sender: localStorage.getItem('address'),
    params: [ {
      key: 'action',
      type: 'string',
      value: 'createDeal'
    },
    {
      key: 'recipientAddress',
      type: 'string',
      value: recipientAddress
    },
    {
      key: 'parentDealId',
      type: 'string',
      value: parentDealId
    },
    {
      key: 'externalDealId',
      type: 'string',
      value: externalDealId
    },
    {
      key: 'privacyDataHash',
      type: 'string',
      value: privacyDataHash
     }
    ],
    contractVersion: parseInt(version, 10),
	timestamp: Date.now(),
    atomicBadge: null
  };

  callContract(txBody);
}

function createPayment(contractId, version, dealId) {
  const txBody = {
    contractId: contractId,
    fee: 0,
    sender: localStorage.getItem('address'),
    params: [ {
      key: 'action',
      type: 'string',
      value: 'createPayment'
    },
    {
      key: 'dealId',
      type: 'string',
      value: dealId
    }
    ],
    contractVersion: parseInt(version, 10),
	timestamp: Date.now(),
    atomicBadge: null
  };

  callContract(txBody);
}

function callContract(txBody) {
  const tx = Waves.API.Transactions.CallContract.V3(txBody);
  var keyPair = getKeyPair();
  var result = tx.broadcast(keyPair);
  Promise.resolve(result).then(function(result) {
    console.log(result);
    alert('transaction id: ' + result.id);
  })
}

function getKeyPair() {
  var keyPair = {
    publicKey: localStorage.getItem('publicKey'),
    privateKey: localStorage.getItem('privateKey')
  };
  return keyPair;
}

function App() {
  return (
    <div className="App"></div>
  );
}

export default App;
