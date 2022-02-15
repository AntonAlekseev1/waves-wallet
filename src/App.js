import logo from './logo.svg';
import './App.css';
const WeSdk = require('@wavesenterprise/js-sdk');

const config = {
  ...WeSdk.MAINNET_CONFIG,
  nodeAddress: '/node-0/',
  crypto: 'waves', // there are two encryption options 'gost' and 'waves'
  networkByte: 'V'.charCodeAt(0)
}

const Waves = WeSdk.create({
  initialConfiguration: config,
  fetchInstance: window.fetch // Browser feature. For Node.js use node-fetch
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
var callContractBtn = document.getElementById('call_contract_btn');
if(callContractBtn != null) {
  callContractBtn.addEventListener('click', () => {
    callContract(contractIdInput.value, versionInput.value);
  })
}

function createSeed() {
  const seed = Waves.Seed.create();
  createMsgBox(seed);
  return seed;
}

function restoreSeed(seedPhrase) {
  const seed = Waves.Seed.fromExistingPhrase(seedPhrase);
  createMsgBox(seed);
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

function callContract(contractId, version) {
  const state = getPublicState();
    Promise.resolve(state).then(function(state) {
      const txBody = {
        contractId: contractId,
        fee: 0,
        sender: state.account.address,
        params: [ {
          key: 'action',
          type: 'string',
          value: 'createUserRegistrationRequest'
        },
        {
          key: 'privateDataHash',
          type: 'string',
          value: 'todo'
         }
        ],
        contractVersion: parseInt(version, 10),
    	timestamp: Date.now(),
        atomicBadge: null
      };
    
      const tx = Waves.API.Transactions.CallContract.V2(txBody);
      var signed = window.WEWallet.signTransaction({ type: 'dockerCallV2', tx: { ...tx, authorPublicKey: state.account.publicKey } })
        Promise.resolve(signed).then(function(signed) {
          const txBroadcastResult = Waves.API.Node.transactions.rawBroadcast(signed)
            Promise.resolve(txBroadcastResult).then(function(txBroadcastResult) {
              alert('transaction id: ' + txBroadcastResult.id);
            })
        })
    })
}

function getPublicState() {
  try {
      const state = window.WEWallet.publicState();
      return state;
  } catch(error) {
      console.error(error); // displaying the result in the console
  }
}

function App() {
  return (
    <div className="App"></div>
  );
}

export default App;
