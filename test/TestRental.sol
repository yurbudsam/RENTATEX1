pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Rental.sol";

contract TestRental {
  // The address of the rental contract to be tested
  Rental rental = Rental(DeployedAddresses.Rental());

  // Testing the Rent() function
    function testUserCanRentBook() public {
     uint returnedId = rental.Rent(expectedBookId);

    Assert.equal(returnedId, expectedBookId, "Rental of the expected book should match what is returned.");
    }

    // Testing retrieval of a single books owner
    function testGetRenterAddressByBookId() public {
    address renter = rental.renters(expectedBookId);

     Assert.equal(renter, expectedRenter, "Owner of the expected book should be this contract");
    }

    // Testing retrieval of all book owners
    function testGetRenterAddressByBookIdInArray() public {
    // Store renters in memory rather than contract's storage
    address[16] memory renters = rental.getRenters();

    Assert.equal(renters[expectedBookId], expectedRenter, "Owner of the expected book should be this contract");
    }




  // The id of the book that will be used for testing
  uint expectedBookId = 8;

  //The expected owner of rented text is this contract
  address expectedRenter = address(this);

}
