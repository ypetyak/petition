// Here we use our boilerplate for redis to establish connection:
//
var redis = require("redis");
var client = redis.createClient({
    host: "localhost",
    port: 6379
});

client.on("error", function(err) {
    console.log(err);
});

// GET is redis

// remeber how we need to write GET /name/ to get information from redis?
// We do same here, create function to extract data :)

module.exports.get = key => {
    return new Promise((resolve, reject) => {
        client.get(key, (err, data) => {
            if (err) {
                reject("error in redis GET: ", err);
            } else {
                resolve(data);
            }
        });
    });
};

//// SET in Redis

module.exports.set = (key, val) => {
    return new Promise((reject, resolve) => {
        client.set([key, val], (err, data) => {
            if (err) {
                reject("error in SET: ", err);
            } else {
                resolve(data);
            }
        });
    });
};

// SETEX in redis

// remeber how we need to write SETEX /time/ /key/ /name/ to get information and set selfdestruct time from redis?
// We do same here, create function to do setex :)

module.exports.setex = (key, expiry, val) => {
    return new Promise((reject, resolve) => {
        client.setex(key, expiry, val, (err, data) => {
            if (err) {
                reject("error in SETEX: ", err);
            } else {
                resolve(data);
            }
        });
    });
};

// DEL in redis. Similar to the aboce, just delete is simpler, as we need only delete stuff.

module.exports.del = key => {
    console.log("deleting");
    client.del(key);
};
