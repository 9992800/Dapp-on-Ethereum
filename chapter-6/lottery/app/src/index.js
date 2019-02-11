import Web3 from "web3";
import coin_artifacts from '../../build/contracts/LotteryCoin.json'
import shop_artifacts from '../../build/contracts/LotteryCoin.json'

const App = {
  web3: null,
  account: null,
  coin: null,
  shop: null,

  init: async function () {
    const {web3} = this;
    try {
      const networkId = await web3.eth.net.getId();
      this.coin = new web3.eth.Contract(
          coin_artifacts.abi,
          coin_artifacts.networks[networkId].address,
      );

      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      this.shop = new web3.eth.Contract(
          shop_artifacts.abi,
          shop_artifacts.networks[networkId].address,
      );

      this.loadBasicInfo();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  loadBasicInfo :async function (){
    const {balanceOf, owner, sellPrice, buyPrice} = this.coin.methods;

    const adminAddr = await owner().call()

    const sell_price = await sellPrice().call()
    const sell_price_infin = this.web3.utils.fromWei(sell_price, 'finney')
    const buy_price = await buyPrice().call()
    const buy_price_infin = this.web3.utils.fromWei(buy_price, 'finney')

    if (this.account == adminAddr){
      $("#admin-area").show()
      $("#sell-price").val(sell_price_infin)
      $("#buy-price").val(buy_price_infin)
    }else{
      $("#admin-area").hide()
    }
    $("#buyTokenNo-msg")[0].innerText = "售价/token:"+sell_price_infin +" finney"

    const accEthEl = $("#account-eth")[0]
    this.web3.eth.getBalance(this.account).then(
        (result) =>{
          const balanceInEth = this.web3.utils.fromWei(result, 'ether')
          accEthEl.innerText = balanceInEth +" ETH"
        }
    )

    const tokenBEl = $("#account-token")[0]
    const tokenB = await balanceOf(this.account).call()
    tokenBEl.innerText = (tokenB / 100) + " LTC"
  },

  buyTokens: async function (){
    const { buy, sell } = this.coin.methods;

    let no = $("#buyTokenSum").val()
    if (no <= 0){
      alert("无效的金额")
      return
    }
    console.warn(this.web3.utils.toWei(no, "ether"))

    buy().send({value:this.web3.utils.toWei(no, "ether"), from: this.account
      }).on('error', function(error){
        console.error(error)
      }).on('transactionHash', function(txHash){
            console.warn("pending",txHash)
      }).on('confirmation', function(confirmationNumber, receipt){
          console.warn(confirmationNumber, receipt)
      });
  },
}

window.App = App;

$(document).ready(function() {
  if (window.ethereum) {
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); //
  } else {
    console.warn(
        "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",
    );
    App.web3 = new Web3(
        new Web3.providers.HttpProvider("http://127.0.0.1:9545"),
    );
  }

  App.init();
});