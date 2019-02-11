pragma solidity >=0.4.21 <0.6.0;

contract Words {

    struct Item {
        string what;
        address who;
        uint when ;
    }

    Item[] private allWords;

    function save(string memory s, uint t) public {
        allWords.push(Item({
            what: s,
            who: msg.sender,
            when: t
        }));
    }

    function getSize() public view returns (uint){
        return allWords.length;
    }

    function getRandom(uint random) public view returns (string memory, address, uint) {
        if(allWords.length==0){
            return ("", msg.sender, 0);
        }else{
            Item storage result = allWords[random];
            return (result.what, result.who, result.when);
        }
    }
}