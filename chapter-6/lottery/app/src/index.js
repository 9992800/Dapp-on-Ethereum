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

  loadTokenPrice : async function() {
    const {sellPrice, buyPrice} = this.coin.methods;

    const sell_price = await sellPrice().call()
    const sell_price_infin = this.web3.utils.fromWei(sell_price, 'finney')
    const buy_price = await buyPrice().call()
    const buy_price_infin = this.web3.utils.fromWei(buy_price, 'finney')


    $("#sell-price").val(sell_price_infin)
    $("#buy-price").val(buy_price_infin)
    $("#buyTokenNo-msg")[0].innerText = "售价/token:"+sell_price_infin +" finney"
  },

  loadEthBalance: async function(){
    const accEthEl = $("#account-eth")[0]
    this.web3.eth.getBalance(this.account).then(
        (result) =>{
          const balanceInEth = this.web3.utils.fromWei(result, 'ether')
          accEthEl.innerText = balanceInEth +" ETH"
        }
    )
  },

  loadTokenBalance: async function(){
    const {balanceOf} = this.coin.methods;

    const tokenBEl = $("#account-token")[0]
    const tokenB = await balanceOf(this.account).call()
    tokenBEl.innerText = (tokenB / 100) + " LTC"
  },

  loadBasicInfo :async function (){
    const {owner} = this.coin.methods;

    const adminAddr = await owner().call()
    if (this.account == adminAddr){
      $("#admin-area").show()
    }else{
      $("#admin-area").hide()
    }

    this.loadTokenPrice()
    this.loadEthBalance()
    this.loadTokenBalance()
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
      }).on('transactionHash', (txHash) =>{
            console.warn("transactionHash",txHash)

      }).on('confirmation', (confirmationNumber, receipt) =>{
          console.warn(confirmationNumber, receipt)
      }).on('receipt', (receipt) =>{
        console.warn("receipt", receipt)
        alert("购买成功")
        this.loadEthBalance()
        this.loadTokenBalance()
    });
  },

  bidThisPhase :async function (){

  },

  setPrice :async function (){
    var sp = $("#sell-price").val()
    var bp = $("#buy-price").val()

    if (sp <=0 || bp <= 0){
      alert("检查参数")
      return
    }

    sp = this.web3.utils.toWei(sp, "finney")
    bp = this.web3.utils.toWei(bp, "finney")

    this.coin.methods.setPrices(sp, bp).send({from:this.account}).on(
        'transactionHash', (hash) =>{
            console.warn("hash", hash)
        }
    ).on(
        'confirmation', (confirmationNumber, receipt) =>{
          console.warn("confirmation", confirmationNumber, receipt)
        }
    ).on('receipt', (receipt) =>{
      console.warn("receipt", receipt)
      this.loadTokenPrice()
    })
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