var path = require('path');

module.exports = {
    "loopback-component-explorer": {
        "mountPath": "/explorer",
        "uiDirs": "explorer",
        "apiInfo": {
            "title": "Loopback API Explorer",
            "description": "keyslide API Explorer",
            "version": require('../package.json').version
        },
        "host": "localhost:8110",
        "schemes": [
            "http",
            "https"
        ],
        "consumes": [
            "application/json"
        ],
        "produces": [
            "application/json"
        ],
        "securityDefinitions": {
            "OauthPassword": {
                "type": "oauth2",
                "flow": "password",
                "description": "OAuth2 Password authentication",
                "authorizationUrl": path.join("/oauth/authorize"),
                "tokenUrl": path.join("/api/auth/oauth/token"),
                "scopes": {
                    "DEFAULT": "offline_access API methods",
                }
            }
        },
        "security": [
            {
                "OauthPassword": ["DEFAULT"]
            }
        ]
    }
};