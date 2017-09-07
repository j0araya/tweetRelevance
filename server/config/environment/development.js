'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/keyslide-dev'
  },

  // Seed database on startup
  seedDB: true,
  amazonS3: {
    bucket: 'ksd-repository-dev',
  },
  stripe: {
    key: 'sk_test_8Hwu05Gqd724UYFbNp6YS4Dz',
  },
  facebook: {
    clientID: '1164624593623521',
    clientSecret: 'c17cea21daa98590e0073623c5467c03',
    callbackURL: (process.env.DOMAIN || '') + '/api/v1/auth/facebook/callback'
  },
  url: {
    client: "http://localhost:3000"
  },
  algolia: {
    applicationID: 'QF1OQ6A0WX',
    APIKEY: '6b8c50c920d312d2cc923c9a4717c752',
  },
  mail: {
    user: 'dev.keyslide@gmail.com',
    service: 'gmail',
    password: 'LEsn*LH5Ib2tgc@',
    from: 'dev.keyslide@gmail.com'

  }

};
