pragma solidity 0.5.2;

contract InterTest {

    int  public y = -1024;
    function shiftNegative() public {
        y = y >> 1;
    }

        function getY() public view returns (int xx){
            return y;
        }
}
