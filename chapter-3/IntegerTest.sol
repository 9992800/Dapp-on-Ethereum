pragma solidity >=0.4.0 <0.6.0;

// file name has to end with '_test.sol'
contract InterTest {

    int  public y = -1024;
    function shiftNegative() public {
        y = y >> 1;
    }

    function getY() public view returns (int xx){
        return y;
    }
}