pragma solidity 0.5.2;

contract InterTest {

    int  public y = -1024;
    function shiftNegative() public {
        y = y >> 1;
    }
        int8 public z = -2**7;
        int8 public x = -z;
}
