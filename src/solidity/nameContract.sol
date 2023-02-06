pragma solidity >=0.4.24;

contract NameContract {

    string private name = "Ire";

    function getName() public view returns (string)
    {
        return name;
    }

    function setName(string newName) public
    {
        name = newName;
    }

}