var Tax = artifacts.require("./Tax.sol");

module.exports = function(deployer) {
  deployer.deploy(Tax);
};
