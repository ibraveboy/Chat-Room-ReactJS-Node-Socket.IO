const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const UserModel = require("../models/UserModel");

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken;
opts.secretOrKey = "secret";

module.exports = new JwtStrategy(opts, function (req, jwt_payload, done) { 
    const { id } = jwt_payload
    UserModel.findById({ _id: id }).then(user => {
        done(null,user)
    }).catch((err) => {
        done(err,false)
    })
})