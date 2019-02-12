import Web3 from "web3";
import coin_artifacts from '../../build/contracts/LotteryCoin.json'
import shop_artifacts from '../../build/contracts/LotteryShop.json'

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
    const {balanceOf} = this.coin.methods

    const tokenBEl = $("#account-token")[0]
    const tokenB = await balanceOf(this.account).call()
    tokenBEl.innerText = (tokenB / 100) + " LTC"
  },

  loadCurrentBets:async function(){
    const {allMyBets} = this.shop.methods
    const tBody = $("#bets-rows")
    tBody.empty()
    allMyBets().call({from:this.account}).then(
        (result)=>{
          console.warn("result:->",result)
          const strs = result[0]
          const nos = result[1]
          for (let i = 0; i < strs.length; i++) {
            tBody.append("<tr><td>" + this.web3.utils.hexToString(strs[i]) + "</td><td>" + nos[i] + "</td></tr>")
          }
          if ( result[2] == true){
            $("#this-phase-msg")[0].innerText = "当前投注已经停止，中奖者地址:" + result[3]
          }else{
            $("#this-phase-msg")[0].innerText = ""
          }
        }
    )
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
    this.loadCurrentBets()
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
    const bidStr = $("#bidSerial").val()
    if (bidStr.length != 3){
      alert("请输入3位彩票序列")
      return
    }

    const sum = $("#bidSum").val()
    if (sum <= 0){
      alert("请输入合适的投注数")
      return
    }

    const {bet} = this.shop.methods

    bet(this.web3.utils.utf8ToHex(bidStr), sum).send({from:this.account}).on(
        'transactionHash', (hash) =>{
          console.warn("hash", hash)
        }
    ).on(
        'confirmation', (confirmationNumber, receipt) =>{
          console.warn("confirmation", confirmationNumber, receipt)
        }
    ).on('receipt', (receipt) =>{
      console.warn("receipt", receipt)
      this.loadEthBalance()
      this.loadTokenBalance()
      this.loadCurrentBets()
    })
  },

  findWinner: async function (){
    const {closeAndFindWinner} = this.shop.methods;
    closeAndFindWinner().send({from: this.account}).on(
        'transactionHash', (hash) =>{
          console.warn("hash", hash)
        }
    ).on(
        'confirmation', (confirmationNumber, receipt) =>{
          console.warn("confirmation", confirmationNumber, receipt)
        }
    ).on('receipt', (receipt) =>{
      console.warn("receipt", receipt)
      this.loadCurrentBets()
    })
  },

  reOpen: async function(){
    const {reOpen} = this.shop.methods;
    reOpen().send({from: this.account}).on(
        'transactionHash', (hash) =>{
          console.warn("hash", hash)
        }
    ).on(
        'confirmation', (confirmationNumber, receipt) =>{
          console.warn("confirmation", confirmationNumber, receipt)
        }
    ).on('receipt', (receipt) =>{
      console.warn("receipt", receipt)
      this.loadCurrentBets()
    })
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
    window.ethereum.enable();
    console.warn("用 metamask 的账号")
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