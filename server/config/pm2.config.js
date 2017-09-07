module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    "apps": [
        {
            "name": "unstable",
            "script": "./server/index.js",
            "env": {
                "NODE_ENV": "unstable"
            },
            //    "exec_mode": "cluster",
            //  "instances": "max"
        },
        {
            "name": "production",
            "script": "./server/index.js",
            "env": {
                "NODE_ENV": "production"
            },
            //  "exec_mode": "cluster",
            //"instances": "max"
        }
    ]
}
