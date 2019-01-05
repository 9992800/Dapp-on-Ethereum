pragma solidity 0.5.2;

contract wheel{
    uint myRadius = 6;

    function twist(uint x, function(uint) external showFinish) public{
        for (uint i=1; i < x; i++){
            showFinish(myRadius);
        }
    }
}
contract car {
    wheel constant w = wheel(0x1234567);
    event Fixed(uint);

    function done(uint r) public {
        emit Fixed(r);
    }

        function assemble(uint x)public{
            w.twist(x, this.done);
        }
}