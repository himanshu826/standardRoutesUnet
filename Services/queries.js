
'use strict';

let saveData = function (model, data, callback) {
    new model(data).save((err, result) => {
        if (err) return callback(err);
        callback(null, result);

    })
};

let getData = function (model, query, projection, options, callback) {

    model.find(query, projection, options, (err, data) => {
        if (err) return callback(err);
        else return callback(null, data);
    });
};

let getUniqueData = function (model, query, projection, options, keyName, callback) {

    model.find(query, projection, options).distinct(keyName, (err, data) => {
        if (err) return callback(err);
        else return callback(null, data);
    });
};

let findOne = function (model, query, projection, options, callback) {
    model.findOne(query, projection, options, function (err, data) {
        if (err) return callback(err);
        return callback(null, data);
    });
};

let findAndUpdate = function (model, conditions, update, options, callback) {
    model.findOneAndUpdate(conditions, update, options, function (error, result) {
        if (error) {
            return callback(error);
        }
        return callback(null, result);
    })
};

let aggregateData = function (model, group, callback) {
    model.aggregate(group, function (err, data) {

        if (err) return callback(err);
        return callback(null, data);
    });
};

let count = function (model, condition, callback) {
    model.count(condition, function (error, count) {
        if (error) return callback(error);
        return callback(null, count);
    })
};

module.exports = {
    saveData: saveData,
    getData: getData,
    getUniqueData: getUniqueData,
    findOne: findOne,
    findAndUpdate: findAndUpdate,
    aggregateData:aggregateData,
    count:count
}