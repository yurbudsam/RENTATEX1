const Rental = artifacts.require("Rental");

contract("Rental", (accounts) => {
  let rental;
  let expectedBookId;

  before(async () => {
      rental = await Rental.deployed();
  });

  describe("renting a book and retrieving account addresses", async () => {
    before("rent a book using accounts[0]", async () => {
      await rental.Rent(8, { from: accounts[0] });
      expectedRenter = accounts[0];
    });

    it("can fetch the address of an owner by book id", async () => {
        const renter = await rental.renters(8);
        assert.equal(renter, expectedRenter, "The owner of the rented book should be the first account.");
  });

  it("can fetch the collection of all book owners' addresses", async () => {
    const renters = await rental.getRenters();
    assert.equal(renters[8], expectedRenter, "The owner of the rented bookshould be in the collection.");
  });
  
});

});
