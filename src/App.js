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

var button = document.getElementById('send_button');
if(button != null) {
  button.addEventListener('click', () => {
    createSeed();
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

var privacyDataHashInput = document.getElementById('org_privacy_data_hash');
var callContractBtn = document.getElementById('createOrg_btn');
if(callContractBtn != null) {
  callContractBtn.addEventListener('click', () => {
    createOrg(contractIdInput.value, versionInput.value, privacyDataHashInput.value);
  })
}

var orgIdInput = document.getElementById('org_id');
var memberPrivacyDataHashInput = document.getElementById('member_privacy_data_hash');
var addOrgMemberBtn = document.getElementById('addOrgMember_btn');
if(addOrgMemberBtn != null) {
  addOrgMemberBtn.addEventListener('click', () => {
    addOrgMember(contractIdInput.value, versionInput.value, orgIdInput.value, 
                memberPrivacyDataHashInput.value);
  })
}

var payerIdInput = document.getElementById('deal_payer_id');
var recipientIdInput = document.getElementById('deal_recipient_id');
var externalDealIdInput = document.getElementById('external_deal_id');
var parentDealIdInput = document.getElementById('parent_deal_id');
var dealPrivacyDataHashInput = document.getElementById('deal_privacy_data_hash');
var createDealBtn = document.getElementById('createDeal_btn');
if(createDealBtn != null) {
  createDealBtn.addEventListener('click', () => {
    createDeal(contractIdInput.value, versionInput.value, payerIdInput.value,
              recipientIdInput.value, parentDealIdInput.value, externalDealIdInput.value, 
              dealPrivacyDataHashInput.value);
  })
}

var actDealIdInput = document.getElementById('act_deal_id');
var actPrivacyDataHashInput = document.getElementById('act_privacy_data_hash');
var createActBtn = document.getElementById('createAct_btn');
if(createActBtn != null) {
  createActBtn.addEventListener('click', () => {
    createAct(contractIdInput.value, versionInput.value, actDealIdInput.value,
    actPrivacyDataHashInput.value);
  })
}

var paymentDealIdInput = document.getElementById('deal_id');
var createPaymentByDealBtn = document.getElementById('createPaymentByDeal_btn');
if(createPaymentByDealBtn != null) {
  createPaymentByDealBtn.addEventListener('click', () => {
    createPaymentByDeal(contractIdInput.value, versionInput.value, paymentDealIdInput.value);
  })
}

var paymentActIdInput = document.getElementById('act_id');
var createPaymentByActBtn = document.getElementById('createPaymentByAct_btn');
if(createPaymentByActBtn != null) {
  createPaymentByActBtn.addEventListener('click', () => {
    createPaymentByAct(contractIdInput.value, versionInput.value, paymentActIdInput.value);
  })
}

function createSeed() {
  const seed = Waves.Seed.create();
  console.log(seed.phrase);
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

function createOrg(contractId, version, privacyDataHash) {
  const txBody = {
    contractId: contractId,
    fee: 0,
    sender: localStorage.getItem('address'),
    params: [ {
      key: 'action',
      type: 'string',
      value: 'createOrg'
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

function addOrgMember(contractId, version, orgId, privacyDataHash) {
  const txBody = {
    contractId: contractId,
    fee: 0,
    sender: localStorage.getItem('address'),
    params: [ {
      key: 'action',
      type: 'string',
      value: 'addOrgMember'
    },
    {
      key: 'orgId',
      type: 'string',
      value: orgId
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

function createDeal(contractId, version, payerId, recipientId, parentDealId, externalDealId, privacyDataHash) {
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
      key: 'payerId',
      type: 'string',
      value: payerId
    },
    {
      key: 'recipientId',
      type: 'string',
      value: recipientId
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

function createAct(contractId, version, dealId, privacyDataHash) {
  const txBody = {
      contractId: contractId,
      fee: 0,
      sender: localStorage.getItem('address'),
      params: [ {
        key: 'action',
        type: 'string',
        value: 'createAct'
      },
      {
        key: 'dealId',
        type: 'string',
        value: dealId
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

function createPaymentByDeal(contractId, version, dealId) {
  const txBody = {
    contractId: contractId,
    fee: 0,
    sender: localStorage.getItem('address'),
    params: [ {
      key: 'action',
      type: 'string',
      value: 'createPaymentByDeal'
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

function createPaymentByAct(contractId, version, actId) {
  const txBody = {
    contractId: contractId,
    fee: 0,
    sender: localStorage.getItem('address'),
    params: [ {
      key: 'action',
      type: 'string',
      value: 'createPaymentByAct'
    },
    {
      key: 'actId',
      type: 'string',
      value: actId
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
