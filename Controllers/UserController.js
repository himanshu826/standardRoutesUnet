const Config = require('../Config');
const Service = require('../Services').queries;
const TokenManager = require('../Lib/TokenManager');
const Modal = require('../Models');
const UniversalFunctions = require('../Utils/UniversalFunctions');
let mongoose = require('mongoose');

async function userRegisteration(payloadData) {
    let query = {
        email: payloadData.email,
        isDeleted: false
    };
    let check1 = await getRequired(Modal.Users, query, {}, {});
    if (check1.length)
        return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.ALREADY_EXIST)

    let register = await registerUser(payloadData);
    return await tokenUpdate(register);

}

async function registerUser(payloadData) {
    return new Promise((resolve, reject) => {

        let dataToSave = {
            email: payloadData.email,
        };

        if (payloadData.password) dataToSave.password = UniversalFunctions.CryptData(payloadData.password);

        if (payloadData.name) dataToSave.name = payloadData.name;
        if (payloadData.deviceToken) dataToSave.deviceToken = payloadData.deviceToken;
        if (payloadData.countryCode) dataToSave.countryCode = payloadData.countryCode;
        if (payloadData.phoneNumber) dataToSave.phoneNumber = payloadData.phoneNumber;

        Service.saveData(Modal.Users, dataToSave, (err, result) => {
            console.log("err")
            if (err) reject(err);
            else {
                resolve(result)
            }
        })
    });
}

async function login(payloadData) {
    let f1 = await verifyUser(payloadData);
    if (!f1)
        return f1;
    else {
        let f2 = await tokenUpdate(f1);

        let dataToSet = {};
        if (payloadData.deviceToken) dataToSet.deviceToken = payloadData.deviceToken;
        dataToSet.location = {}
        dataToSet.location.position = {}

        payloadData.location.adminArea ? dataToSet.location.adminArea = payloadData.location.adminArea : dataToSet.location.adminArea = "";
        payloadData.location.country ? dataToSet.location.country = payloadData.location.country : dataToSet.location.country = "";
        payloadData.location.countryCode ? dataToSet.location.countryCode = payloadData.location.countryCode : dataToSet.location.countryCode = "";
        payloadData.location.feature ? dataToSet.location.feature = payloadData.location.feature : dataToSet.location.feature = "";
        payloadData.location.formattedAddress ? dataToSet.location.formattedAddress = payloadData.location.formattedAddress : dataToSet.location.formattedAddress = "";
        payloadData.location.locality ? dataToSet.location.locality = payloadData.location.locality : dataToSet.location.locality = "";
        payloadData.location.locale ? dataToSet.location.locale = payloadData.location.locale : dataToSet.location.locale = "";
        payloadData.location.postalCode ? dataToSet.location.postalCode = payloadData.location.postalCode : dataToSet.location.postalCode = "";
        payloadData.location.streetName ? dataToSet.location.streetName = payloadData.location.streetName : dataToSet.location.streetName = "";
        payloadData.location.streetNumber ? dataToSet.location.streetNumber = payloadData.location.streetNumber : dataToSet.location.streetNumber = "";
        payloadData.location.subAdminArea ? dataToSet.location.subAdminArea = payloadData.location.subAdminArea : dataToSet.location.subAdminArea = "";
        payloadData.location.subLocality ? dataToSet.location.subLocality = payloadData.location.subLocality : dataToSet.location.subLocality = "";

        payloadData.location.position.lng ? dataToSet.location.position.lng = payloadData.location.position.lng : dataToSet.location.position.lng = "";
        payloadData.location.position.lat ? dataToSet.location.position.lat = payloadData.location.position.lat : dataToSet.location.position.lat = "";

        let data = await updateData(Modal.Users, { email: payloadData.email }, dataToSet, { new: true });
        return data
    }
}
function verifyUser(payloadData) {

    return new Promise((resolve, reject) => {
        let getCriteria = {};

        getCriteria.email = payloadData.email;
        let project = {
            deviceToken: 0
        };
        Service.getData(Modal.Users, getCriteria, project, { lean: true }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result && result.length) {
                    if (result[0].password !== UniversalFunctions.CryptData(payloadData.password))
                        reject(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_PASSWORD);
                    else if (result[0].isBlocked)
                        reject(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.BLOCKED);
                    else {
                        result[0].type = UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_TYPE.USER;
                        resolve(result[0])
                    }
                } else {
                    reject(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.NOT_REGISTERED);
                }
            }
        });
    });
}

function tokenUpdate(data) {
    let tokenData = {
        _id: data._id,
        type: Config.APP_CONSTANTS.DATABASE.USER_TYPE.USER,
        tokenTime: new Date().getTime()
    };
    return new Promise((resolve, reject) => {
        TokenManager.setToken(tokenData, function (err, output) {
            if (err) {
                reject(err);
            } else {
                resolve(output)
            }
        });
    });
}

async function logout(userData) {
    return new Promise(async (resolve, reject) => {
        let criteria = {
            _id: userData._id
        };
        let dataToSet = {
            $unset: {
                deviceToken: 1,
                accessToken: 1,
            }
        }
        let option = {
            new: true
        };
        let data = await updateData(Modal.Users, criteria, dataToSet, option);
        resolve({})
    })
}

async function updateLocation(payloadData, userData) {
    return new Promise(async (resolve, reject) => {
        if (payloadData.location) dataToSet.location = payloadData.location;

        let data = await updateData(Modal.Users, { _id: userData._id }, dataToSet, { new: true });
        resolve(data)
    });
}

async function getChannels(payloadData) {
    return new Promise(async (resolve, reject) => {
        let option = { lean: true }
        let getCriteria = {
            isDeleted: false,
            isBlocked: false,
        };

        if (payloadData.channelId) getCriteria._id = payloadData.channelId;
        if (payloadData.skip) option.skip = payloadData.skip
        if (payloadData.limit) option.limit = payloadData.limit

        // let channels = await getRequired(Modal.Channels, getCriteria, {}, option);

        // payloadData.channelId ? resolve(channels[0]) : resolve(channels)
        let [channels, count] = await Promise.all([getRequired(Modal.Channels, getCriteria, {}, option), getCount(Modal.Channels, getCriteria)]);
        console.log("channelschannels", channels)
        payloadData.channelId ? resolve(channels[0]) : resolve({ list: channels, count: count })
    });
}

async function getDirectories(payloadData,userData) {
    return new Promise(async (resolve, reject) => {
        let option = { lean: true }
        let getCriteria = {
            directoryTypeId: mongoose.Types.ObjectId(payloadData.directoryTypeId),
            isDeleted: false,
            isBlocked: false,
        };
        if (payloadData.directoryId) getCriteria._id = payloadData.directoryId;
        // if (payloadData.skip) option.skip = payloadData.skip
        // if (payloadData.limit) option.limit = payloadData.limit

        let directoryName = await Modal.GenresAndTypes.findOne({ _id: payloadData.directoryTypeId }, {}, option);

        let location
        if(userData.location){
            if(userData.location.position){
                location = [userData.location.position.lng, userData.location.position.lat]
            }
        }else{
            location = [payloadData.lng, payloadData.lat]
        }

        let pipe  =[
            {
                $geoNear: {
                    near: { type: "Point", coordinates: location },
                    distanceField: "distance",
                    query: getCriteria,
                    spherical: true
                }
            },
            
        ]
        
        let count = await aggregate(Modal.Directories, pipe)
        if(payloadData.skip)pipe.push({$skip:payloadData.skip})
        if(payloadData.limit)pipe.push({$limit:payloadData.limit})

        let totalDirectories = 0
        if(count) totalDirectories = count.length

        console.log()
        let [directories] = await Promise.all([await aggregate(Modal.Directories, pipe)]);
        payloadData.directoryId ? resolve(directories[0]) : resolve({ list: directories, count: totalDirectories, type: directoryName.name.toLowerCase() })
    });
}

async function getEvents(payloadData) {
    return new Promise(async (resolve, reject) => {
        let getCriteria = {
            isDeleted: false,
            isBlocked: false,
        };
        if (payloadData.eventId) getCriteria._id = payloadData.eventId;

        let pipe = [
            { $match: getCriteria },
        ]

        let eventsCount = await aggregate(Modal.Events, pipe);
        console.log("eventsCount", eventsCount)
        if (payloadData.skip) pipe.push({ $skip: payloadData.skip })
        if (payloadData.limit) pipe.push({ $limit: payloadData.limit })

        let events = await aggregate(Modal.Events, pipe);
        payloadData.eventId ? resolve(events[0]) : resolve({ list: events, count: eventsCount.length })
    });
}

async function getDirectoryTypes(payloadData) {
    return new Promise(async (resolve, reject) => {
        let option = { lean: true }
        let getCriteria = {
            type: Config.APP_CONSTANTS.CATEGORY_TYPES.DIRECTORY_TYPE,
            isDeleted: false,
            isBlocked: false,
        };

        let pipe = [
            { $match: getCriteria },
            {
                $addFields: { selected: false }
            },
            {
                $project: {
                    _id: 1,
                    priority: 1,
                    name: 1,
                    type: 1,
                    selected: 1
                }
            },
            {
                $sort: { priority: 1 }
            }
        ]

        let [directoryTypesList, count] = await Promise.all([await aggregate(Modal.GenresAndTypes, pipe), getCount(Modal.GenresAndTypes, getCriteria)]);
        directoryTypesList.map(function (value, index) {
            if (index == 0) {
                directoryTypesList[index].selected = true
            }
        })
        resolve({ list: directoryTypesList, count: count })
    });
}

async function getChannelGenres(payloadData) {
    return new Promise(async (resolve, reject) => {
        let option = { lean: true }
        let getCriteria = {
            type: Config.APP_CONSTANTS.CATEGORY_TYPES.CHANNEL_GENRES,
            isDeleted: false,
            isBlocked: false,
        };

        // let channelGenresList = await getRequired(Modal.GenresAndTypes, getCriteria, { name: 1, _id: 1 }, option);
        let [channelGenresList, count] = await Promise.all([getRequired(Modal.GenresAndTypes, getCriteria, { name: 1, _id: 1 }, option), getCount(Modal.GenresAndTypes, getCriteria)]);
        resolve({ list: channelGenresList, count: count })
    });
}

async function homeData(payloadData, userData) {
    return new Promise(async (resolve, reject) => {
        let option = { lean: true, skip: 0, limit: 20 }
        let data = {}

        //channels
        data.channels = await getRequired(Modal.Channels, { isDeleted: false, isBlocked: false }, {}, option);

        //services
        data.services = await Modal.Services.findOne({ isDeleted: false, isBlocked: false }, { name: 1, ott_link: 1, radio_link: 1, church_link: 1 }, option);

        //slider images
        let pipeForSlider = [
            { $match: { isDeleted: false, isBlocked: false } },
            {
                $project: {
                    _id: 1,
                    priority: 1,
                    url: "$image.original"
                }
            }
        ]
        data.sliderImages = await aggregate(Modal.HomeSlider, pipeForSlider);

        //events
        let pipeForEvents = [
            { $match: { isDeleted: false, isBlocked: false } },
        ]
        data.events = await aggregate(Modal.Events, pipeForEvents);
        resolve(data)
    })
}

async function accountLinkingRequest(userData){
    console.log("userDatauserData",userData)
    return new Promise(async(resolve, reject) => {
        await updateData(Modal.Users, {_id:userData._id}, {accountConnectionStatus:1}, { new: true });
        resolve(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.ACC_LINK_REQUEST)
    })
}

function getRequired(collection, criteria, project, option) {
    return new Promise((resolve, reject) => {
        Service.getData(collection, criteria, project, option, (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length)
                    resolve(result);
                else resolve([])
            }
        });
    });
}

function aggregate(collection, pipline) {

    return new Promise((resolve, reject) => {
        Service.aggregateData(collection, pipline, (err, result) => {
            resolve(result)
        })
    });
}

function updateData(collection, criteria, dataToUpdate, option) {
    return new Promise((resolve, reject) => {
        Service.findAndUpdate(collection, criteria, dataToUpdate, option, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result)
            }
        });
    });
}

function getCount(collection, criteria) {
    return new Promise((resolve, reject) => {
        Service.count(collection, criteria, (err, result) => {
            resolve(result);
        });
    });
}

module.exports = {
    userRegisteration: userRegisteration,
    login: login,
    logout: logout,
    updateLocation: updateLocation,
    getChannels: getChannels,
    getDirectories: getDirectories,
    homeData: homeData,
    getDirectoryTypes: getDirectoryTypes,
    getEvents: getEvents,
    getChannelGenres: getChannelGenres,
    accountLinkingRequest:accountLinkingRequest
}