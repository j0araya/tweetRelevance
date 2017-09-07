const planJson = require("./seed/plans");
const async = require('async');

module.exports = function (app) {
  var dataSource = app.dataSources['wenteract-db'];
  // FIXED: Error https://github.com/strongloop/loopback-connector/issues/98
  dataSource.setMaxListeners(0);
  dataSource.autoupdate(function (err) {
    if (err) {
      console.error('Database could not be autoupdated', err);
      return;
    }
    console.log('Database autoupdated');
  });

  var User = app.models.user;
  var Plan = app.models.Plan;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
  let userAdmin = {};
  let planDefault = {};
  async.series([
    function (callback) {
      for (let i = 0; i < planJson.length; i++) {
        Plan.findOrCreate({
          where: {
            codeName: planJson[i].codeName
          }
        }, planJson[i], (err, res) => {
          if (planJson.length - 1 === i) {
            callback();
          }
        })
      }
    },
    function (callback) {
      Plan.findOne({
          where: {
            codeName: "ksd-gold-year"
          }
        })
        .then(plan => {
          planDefault = plan;
          callback();
          return;
        })
    },
    function (callback) {
      User.findOne({
        where: {
          email: "admin@example.com"
        }
      }, function (err, user) {
        if (!user) {
          User.create({
            email: 'admin@example.com',
            password: 'admin123',
            username: 'admin@example.com',
            emailVerified: true,
            admin: true,
            name: "Kye",
            plan: planDefault,
            status: "active",
            beta: true,
            bypassStripe: true
          }, function (err, user) {
            if (err) console.log(err);
            userAdmin = user;
            Role.create({
              name: 'admin'
            }, function (err, role) {
              if (err) console.log(err);
              role.principals.create({
                principalType: RoleMapping.USER,
                principalId: user.id
              }, function (err, principal) {
                if (err) console.log(err);
              });
            });
            callback();
          });
          Role.create({
            name: 'userActivated'
          }, function (err, role) {
            if (err) console.log(err);
          });
          Role.create({
            name: 'userNotActivated'
          }, function (err, role) {
            if (err) console.log(err);
          });

        } else {
          userAdmin = user;
          callback();
        }
      })
    },
    function (callback) {
      callback();
    }
  ]);

  /* var Client = app.models.clients;
   console.log(Client);
   Client.create({ id: "keyslideapp", clientSecret: "bU-fNC+beT^jz+g|^H24" }, function (err, client) {
     if (err) console.log(err);
   })*/
}
