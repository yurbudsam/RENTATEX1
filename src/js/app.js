App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets -> books
    $.getJSON('../books.json', function(data) {
      var booksRow = $('#booksRow');
      var bookTemplate = $('#bookTemplate');

      for (i = 0; i < data.length; i ++) {
        bookTemplate.find('.panel-title').text(data[i].title);
        bookTemplate.find('img').attr('src', data[i].picture);
        bookTemplate.find('.author').text(data[i].author);
        bookTemplate.find('.price').text(data[i].price);
        bookTemplate.find('.subject').text(data[i].subject);
        bookTemplate.find('.btn-rent').attr('data-id', data[i].id);

        booksRow.append(bookTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
if (window.ethereum) {
  App.web3Provider = window.ethereum;
  try {
    // Request account access
    await window.ethereum.enable();
  } catch (error) {
    // User denied account access...
    console.error("User denied account access")
  }
}
// Legacy dapp browsers...
else if (window.web3) {
  App.web3Provider = window.web3.currentProvider;
}
// If no injected web3 instance is detected, fall back to Ganache
else {
  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
}
web3 = new Web3(App.web3Provider);


    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Rental.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var RentalArtifact = data;
      App.contracts.Rental = TruffleContract(RentalArtifact);
    
      // Set the provider for our contract
      App.contracts.Rental.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the rented books
      return App.markRented();
    });
    

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-rent', App.handleRent);
  },

  markRented: function() {
    var rentalInstance;

App.contracts.Rental.deployed().then(function(instance) {
  rentalInstance = instance;

  return rentalInstance.getRenters.call();
}).then(function(renters) {
  for (i = 0; i < renters.length; i++) {
    if (renters[i] !== '0x0000000000000000000000000000000000000000') {
      $('.panel-book').eq(i).find('button').text('Success').attr('disabled', true);
    }
  }
}).catch(function(err) {
  console.log(err.message);
});

  },

  handleRent: function(event) {
    event.preventDefault();

    var bookId = parseInt($(event.target).data('id'));

    var rentalInstance;

web3.eth.getAccounts(function(error, accounts) {
  if (error) {
    console.log(error);
  }

  var account = accounts[0];

  App.contracts.Rental.deployed().then(function(instance) {
    rentalInstance = instance;

    // Execute rent as a transaction by sending account
    return rentalInstance.Rent(bookId, {from: account});
  }).then(function(result) {
    return App.markRented();
  }).catch(function(err) {
    console.log(err.message);
  });
});

  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
