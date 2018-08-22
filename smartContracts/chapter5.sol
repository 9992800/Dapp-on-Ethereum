pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

contract Chapter5 {

    function simpleStatic (uint32 x, bool y) public pure returns (bool r) {
        r = x > 32 || y;
    }

    function staticArray(bytes3[2] memory b) public view {
        require (msg. sender != address(this));
    }

    function simpleDynamic (bytes memory b1, bool b2, uint[] memory u1) public pure {
    }

    function dynamicTuple (uint u1, uint32[] u2, bytes10 b1, bytes b2) public payable {
        require (msg. sender != address(this));
    }

    function complexDynamic(uint[][] u1, string[] s1) public pure {
    }
}
