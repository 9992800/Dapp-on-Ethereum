pragma solidity >0.4.99 <0.6.0;

contract Coin {
    address public minter;								//-------1
    mapping (address => uint) public balances;				//-------2

    event Sent(address from, address to, uint amount);			//-------3

    constructor() public {									//-------4
        minter = msg.sender;								//-------5
    }

        function mint(address receiver, uint amount) public {			//-------6
            require(msg.sender == minter);
            require(amount < 1e60);
            balances[receiver] += amount;
        }

            function send(address receiver, uint amount) public {			//-------7
                require(amount <= balances[msg.sender], "Insufficient balance.");
                balances[msg.sender] -= amount;
                balances[receiver] += amount;
                emit Sent(msg.sender, receiver, amount);				//-------8
            }
}
