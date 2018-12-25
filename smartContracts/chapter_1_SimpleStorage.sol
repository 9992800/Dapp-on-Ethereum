pragma solidity >=0.4.0 <0.6.0;				//-------1

contract SimpleStorage {					//-------2
    uint storedData;						//-------3

    function set(uint x) public {				//-------4
        storedData = x; 					//-------5
    }

        function get() public view returns (uint) {	//-------6
            return storedData; 				//-------7
        }
}
