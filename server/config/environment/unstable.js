'use strict';

// Development specific configuration
// ==================================
module.exports = {
    // MongoDB connection options
    mongo: {
        uri: 'mongodb://localhost/keyslide-unstable'
    },
    seedDB: true,
    amazonS3: {
        bucket: 'ksd-repository-unstables',
    },
    algolia: {
        applicationID: 'OTM53YLN1P',
        APIKEY: '268758f13b8c862d809d3e83613248c6',
    },
    stripe: {
        key: 'sk_test_8Hwu05Gqd724UYFbNp6YS4Dz',
    },
    mail: {
        user: 'dev.keyslide@gmail.com',
        service: 'gmail',
        password: 'LEsn*LH5Ib2tgc@',
        from: 'dev.keyslide@gmail.com'

    },
    url: {
        client: "https://unstable.keysli.de"
    }

};
