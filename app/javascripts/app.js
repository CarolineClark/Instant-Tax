// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import tax_artifacts from '../../build/contracts/Tax.json'

// Tax is our usable abstraction, which we'll use through the code below.
var Tax = contract(tax_artifacts);
// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account_address;
var company_account_address;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the Tax abstraction for Use.
    Tax.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account_address = accounts[0];
      if (App.view == 0) {
        document.getElementById('customer_tax_id').innerHTML = account_address;
      }
      company_account_address = accounts[1];
      console.log(accounts)
      if (App.view == 1){
        App.showTotal(account_address);
        App.showFee(account_address);
        App.showTax(account_address);
      }
    });
  },

  showTotal: function(account_address){
    var self = this;
    var tax;
    var transaction_hash;
    var claim_id_hash;
    Tax.deployed().then(function(instance) {
      tax = instance;
      return tax.getLastTransactionNumber(account_address, {from: company_account_address, gas: 400000 });
    }).then(function(value){
      console.log("getlasttransactionnumber");
      console.log(value);
      return tax.calculateTransactionIdHash(account_address, value, {from: company_account_address, gas: 400000 });
    }).then(function(value) {
      console.log("idhash");
      console.log(value);
      return tax.ReadTotalForCurrent(value, {from: company_account_address, gas: 400000 });
    }).then(function(value) {
      console.log(value);
      document.getElementById("transaction_amount").innerHTML = value.toString();
    });
  },

  showTax: function(account_address){
    var self = this;
    var tax;
    var transaction_hash;
    var claim_id_hash;
    Tax.deployed().then(function(instance) {
      tax = instance;
      return tax.getLastTransactionNumber(account_address, {from: company_account_address, gas: 400000 });
    }).then(function(value){
      console.log("getlasttransactionnumber");
      console.log(value);
      return tax.calculateTransactionIdHash(account_address, value, {from: company_account_address, gas: 400000 });
    }).then(function(value) {
      console.log("idhash");
      console.log(value);
      return tax.ReadTaxForCurrent(value, {from: company_account_address, gas: 400000 });
    }).then(function(value) {
      console.log(value);
      document.getElementById("tax_paid").innerHTML = value.toString();
    });
  },

  showFee: function(account_address){
    var self = this;
    var tax;
    var transaction_hash;
    var claim_id_hash;
    Tax.deployed().then(function(instance) {
      tax = instance;
      return tax.getLastTransactionNumber(account_address, {from: company_account_address, gas: 400000 });
    }).then(function(value){
      console.log("getlasttransactionnumber");
      console.log(value);
      return tax.calculateTransactionIdHash(account_address, value, {from: company_account_address, gas: 400000 });
    }).then(function(value) {
      console.log("idhash");
      console.log(value);
      return tax.ReadFeeForCurrent(value, {from: company_account_address, gas: 400000 });
    }).then(function(value) {
      console.log(value);
      document.getElementById("fee").innerHTML = value.toString();
    });
  },

  sendTax: function() {
    var self = this;
    var tax;
    var amount = document.getElementById("amount_input").value;
    console.log(amount);
    console.log(company_account_address);
    Tax.deployed().then(function(instance) {
      tax = instance ;
      return tax.Send(account_address, company_account_address, amount, {from: account_address, gas: 600000 });
    }).then(function(value){
      console.log("tax sent!" + value);
    }).catch(function(e) {
      console.log(e);
    });
  }
};


window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  }
  else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
