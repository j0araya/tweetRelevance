'use strict';

// Production specific configuration
// =================================
module.exports = {
    // Server IP
    ip: process.env.OPENSHIFT_NODEJS_IP ||
    process.env.IP ||
    undefined,
    instances: 8,
    // Server port
    port: process.env.OPENSHIFT_NODEJS_PORT ||
    process.env.PORT || 8080,


    // MongoDB connection options
    mongo: {
        uri: process.env.MONGOLAB_URI ||
        process.env.MONGOHQ_URL ||
        process.env.OPENSHIFT_MONGODB_DB_URL +
        process.env.OPENSHIFT_APP_NAME ||
        'mongodb://localhost/keyslide'
    },
    seedDB: true,
    amazonS3: {
        bucket: 'ksd-repository-prod',
    },
    algolia: {
        applicationID: 'DFTKG9WVES',
        APIKEY: '08f4ff373822d9d092fd8537edd483d8',
    },
    stripe: {
        key: 'sk_live_zE8zz76LtopmcnsfZGWe9FdE',
    },
    mail: {
        user: 'dev.keyslide@gmail.com',
        service: 'gmail',
        password: 'LEsn*LH5Ib2tgc@',
        from: 'dev.keyslide@gmail.com'
    },
    url: {
        client: "https://beta.keysli.de"
    }
};
