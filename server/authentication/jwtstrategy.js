const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const UserModel = require("../models/UserModel");

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secret";

module.exports = new JwtStrategy(opts, function (jwt_payload, done) { 
    const { id } = jwt_payload
    UserModel.findById(id, {username:1,room:1,socket_id:1}).then(user => {
        done(null,user)
    }).catch((err) => {
        done(err,false)
    })
})