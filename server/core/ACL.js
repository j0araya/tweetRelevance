module.exports = function (app) {
    var Role = app.models.Role;
    Role.registerResolver('member', function (role, context, cb) {
        function reject() {
            process.nextTick(function () {
                cb(null, false);
            });
        }
        // do not allow anonymous users
        var userId = context.accessToken.userId;
        if (!userId) {
            return reject();
        }
        // check if userId is in team table for the given project id
        context.model.findById(context.modelId, function (err, team) {
            if (err || !team)
                return reject();
            team.members.count({
                userId: userId
            }, function (err, count) {
                if (err) {
                    console.log(err);
                    return cb(null, false);
                }

                cb(null, count > 0); // true = is a team member
            });
        });
    });
    Role.registerResolver('memberOwner', function (role, context, cb) {
        function reject() {
            process.nextTick(function () {
                cb(null, false);
            });
        }
        // do not allow anonymous users
        var userId = context.accessToken.userId;
        if (!userId) {
            return reject();
        }
        // check if userId is in team table for the given project id
        context.model.findById(context.modelId, function (err, team) {
            if (err || !team)
                return reject();

            team.members.count({
                role: 'owner',
                userId: userId
            }, function (err, count) {
                if (err) {
                    console.log(err);
                    return cb(null, false);
                }

                cb(null, count > 0); // true = is a team member
            });
        });
    });
    Role.registerResolver('memberWrite', function (role, context, cb) {
        function reject() {
            process.nextTick(function () {
                cb(null, false);
            });
        }
        // do not allow anonymous users
        var userId = context.accessToken.userId;
        if (!userId) {
            return reject();
        }
        // check if userId is in team table for the given project id
        context.model.findById(context.modelId, function (err, team) {
            if (err || !team)
                return reject();

            team.members.count({
                userId: userId,
                or: [{
                    role: 'owner'
                }, {
                    role: 'admin'
                }]
            }, function (err, count) {
                if (err) {
                    console.log(err);
                    return cb(null, false);
                }

                cb(null, count > 0); // true = is a team member
            });
        });
    });
};
