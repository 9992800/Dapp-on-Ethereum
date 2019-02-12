pragma solidity >=0.4.21 <0.6.0;

import "./Owned.sol";

interface token {
    function transfer(address receiver, uint amount) external returns(bool);
    function transferFrom(address from, address to, uint amount) external returns(bool);
    function balanceOf(address account) external view returns (uint);
}

contract LotteryShop is owned{

    token public tokenReward;
    bool public closed;

    struct BetItem{
        address bettor;
        bytes3  betStr;
        uint256 betNo;
    }
    BetItem[] private currentBets;
    mapping(address=>BetItem[]) betForUser;
    address[] public allWinners;
    address public currentWinner;

    event GetWinner(address winner, uint pahse, uint fee, uint rewards);
    event Bet(address bettor, bytes3 betStr, uint256 betNo);

    constructor(address addressOfTokenUsedAsReward) public{
        tokenReward = token(addressOfTokenUsedAsReward);
        closed = false;
    }

    function bet(bytes3 betStr, uint256 sum) public {
        require(closed == false);

        BetItem memory item  = BetItem({
            bettor:msg.sender,
            betStr:betStr,
            betNo:sum
        });

        currentBets.push(item);

        betForUser[msg.sender].push(item);

        tokenReward.transfer(address(this), sum);

        emit Bet(msg.sender, betStr, sum);
    }

    function allMyBets()public view returns (bytes3[] memory, uint256[] memory, bool, address){
        BetItem[] memory myBets = betForUser[msg.sender];

        uint length = myBets.length;
        bytes3[] memory strs = new bytes3[](length);
        uint256[] memory nos = new uint256[](length);

        for(uint i = 0; i <length; i++){
            BetItem memory item = myBets[i];
            strs[i]=(item.betStr);
            nos[i] = (item.betNo);
        }

        return (strs, nos, closed, currentWinner);
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

    function closeAndFindWinner() public onlyOwner{
        require(closed == false);
        require(currentBets.length > 4);
        closed = true;

        currentWinner = random();

        allWinners.push(currentWinner);


        uint fee = tokenReward.balanceOf(address(this)) / 10;

        tokenReward.transferFrom(address(this), owner, fee);

        uint rewards =  tokenReward.balanceOf(address(this));

        tokenReward.transferFrom(address(this), currentWinner, fee);

        emit GetWinner(currentWinner, allWinners.length, fee, rewards);
    }

    function random() private view returns (address){
        uint randIdx = (block.number^block.timestamp) % currentBets.length;
        BetItem memory item = currentBets[randIdx] ;
        return item.bettor;
    }

    function reOpen() public onlyOwner{
        require(closed == true);
        closed = false;
        for (uint i = 0; i < currentBets.length; i++){
            delete betForUser[currentBets[i].bettor];
        }
        delete currentBets;
        delete currentWinner;
    }
}