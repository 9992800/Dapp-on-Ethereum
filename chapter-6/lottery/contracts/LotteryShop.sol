pragma solidity >=0.4.21 <0.6.0;

import "./Owned.sol";


interface token {
    function transfer(address receiver, uint amount) external;
}

contract LotteryShop is owned{

    token public tokenReward;

    struct BetItem{
        address bettor;
        bytes3  betStr;
        uint256 betNo;
    }
    uint256 historyPhaseNo;
    BetItem[] private currentBets;
    mapping(address=>BetItem[]) betForUser;


    event Rolled(address sender, uint rand1, uint rand2, uint rand3);
    event FundTransfer(address backer, uint amount);
    event Bet(address bettor, bytes3 betStr, uint256 betNo);

    constructor(address addressOfTokenUsedAsReward) public{
        tokenReward = token(addressOfTokenUsedAsReward);
    }

    function bet(bytes3 betStr, uint256 sum) public {
        BetItem memory item  = BetItem({
            bettor:msg.sender,
            betStr:betStr,
            betNo:sum
        });

        currentBets.push(item);

        betForUser[msg.sender].push(item);

        // tokenReward.transfer(address(this), sum);

        emit Bet(msg.sender, betStr, sum);
    }

    function allMyBets()public view returns (bytes3[] memory, uint256[] memory){
        BetItem[] memory myBets = betForUser[msg.sender];

        uint length = myBets.length;
        bytes3[] memory strs = new bytes3[](length);
        uint256[] memory nos = new uint256[](length);

        for(uint i = 0; i <length; i++){
            BetItem memory item = myBets[i];
            strs[i]=(item.betStr);
            nos[i] = (item.betNo);
        }

        return (strs, nos);
    }

    function myCurrentBetTimes() public view returns (uint){
        return betForUser[msg.sender].length;
    }

    function myBets(uint itemNo) public view returns(bytes3, uint256){
        BetItem[] storage items = betForUser[msg.sender];

        if (items.length < itemNo){
            return ("", 0);
        }

        BetItem memory item = items[itemNo];
        return (item.betStr, item.betNo);
    }
}