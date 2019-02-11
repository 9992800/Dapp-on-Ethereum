const LotteryCoin = artifacts.require("LotteryCoin");
const LotteryShop = artifacts.require("LotteryShop");

module.exports = function(deployer) {
  deployer.deploy(LotteryCoin);
  deployer.deploy(LotteryShop, LotteryCoin.address);
};
