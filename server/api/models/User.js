module.exports = {

    attributes: {
        // Both fields are set to required
        name: {
            type: 'string',
        },
        message: {
            type: 'string',
        }

    },
    afterCreate: (value, next) => {
        // User.publishCreate(value);
        // // next();
        // User.message('message', value);
        // sails.log('hila');
        next();
    }
};