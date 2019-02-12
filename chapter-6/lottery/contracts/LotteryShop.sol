pragma solidity >=0.4.21 <0.6.0;

import "./Owned.sol";

interface token {
    function transfer(address receiver, uint amount) external;
}

contract LotteryShop is owned{

    token public tokenReward;

    event Rolled(address sender, uint rand1, uint rand2, uint rand3);

    event FundTransfer(address backer, uint amount);

    constructor(address addressOfTokenUsedAsReward) public{
        tokenReward = token(addressOfTokenUsedAsReward);
    }

    // function drawWinner() payable public{
    //
    //     uint rand1 = randomGen(msg.value);
    //     uint rand2 = randomGen(msg.value + 10);
    //     uint rand3 = randomGen(msg.value + 20);
    //
    //     uint result = calculatePrize(rand1, rand2, rand3);
    //
    //     emit  Rolled(msg.sender, rand1, rand2, rand3);
    // }
    //
    // function calculatePrize(uint rand1, uint rand2, uint rand3) private returns (uint) {
    //     return 1;
    // }
    //
    // function randomGen(uint seed) private returns (uint randomNumber) {
    //     bytes32 h = blockhash(block.number - 1);
    //     return (uint(keccak256(abi.encodePacked(h))) % 6) + 1;
    // }

// function random() private view returns (uint8) {
//         uint8 randomNumber = numbers[0];
//         for (uint8 i = 1; i < numbers.length; ++i) {
//             randomNumber ^= numbers[i];
//         }
//         return randomNumber;
//     }
}