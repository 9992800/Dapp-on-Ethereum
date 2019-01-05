pragma solidity 0.5.2;

library utils{
    function callA(uint result, function (uint) pure returns (uint) FA)
internal
pure
    returns (uint){
        uint squre = FA(result);
        return squre;
    }
}
contract funcTest {

    using utils for *;
                    function A(uint r) internal pure returns (uint sqr){
        return r * r;
    }
    function caller(uint x)public pure returns (uint){
        return utils.callA(x, A);
    }
}
