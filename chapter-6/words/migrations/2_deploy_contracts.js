const Words = artifacts.require("Words");
module.exports = function(deployer) {
  deployer.deploy(Words);
};
