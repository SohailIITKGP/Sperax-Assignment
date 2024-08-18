require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/IR2QEzdCrr6wXLrtIbZrWU9Jaz41s5fh',
      accounts: ['84fad32ebd9b87a7487a6ebe0ab8bca83546e1999043453aa0bafc373697f3fa'],
    },
  },
};