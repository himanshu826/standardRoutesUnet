const Config = require('../Config');
const Service = require('../Services').queries;
const TokenManager = require('../Lib/TokenManager');
const Modal = require('../Models');
const UniversalFunctions = require('../Utils/UniversalFunctions');

//Login Admin
async function adminLogin(payloadData) {

    let f1 = login(payloadData);
    let f2 = tokenUpdate(await f1);
    return await f2;
}

async function login(payloadData) {
    return new Promise((resolve, reject) => {
        let tokenData = {};
        let getCriteria = {
            email: payloadData.email,
        };
        Service.getData(Modal.Admins, getCriteria, {}, { lean: true }, function (err, data) {
            if (err) {
                reject(err);
            } else {
                if (!data || data.length <= 0) {
                    reject(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL);
                }
                else {
                    if (data && data[0].password !== UniversalFunctions.CryptData(payloadData.password)) {
                        reject(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_PASSWORD);
                    } else {
                        tokenData = data[0];
                        tokenData.type = UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_TYPE.ADMIN;
                        resolve(tokenData);
                    }
                }
            }
        });
    });
}

function tokenUpdate(tokenData) {
    return new Promise((resolve, reject) => {
        TokenManager.setToken({ _id: tokenData._id, type: tokenData.type }, function (err, output) {
            if (err) {
                reject(err)
            } else {
                tokenData.accessToken = output.accessToken;
                resolve(tokenData);
            }
        });
    });
}

//CRUD of Users
async function getUsers(payloadData) {
    return new Promise(async (resolve, reject) => {
        let option = { lean: true }
        let getCriteria = {
            isDeleted: false,
        };

        if(payloadData.status == 1){
            getCriteria.accountConnectionStatus = 0
        }else if(payloadData.status == 2){
            getCriteria.accountConnectionStatus = 1
        }else if(payloadData.status == 3){
            getCriteria.accountConnectionStatus = 2 
        }

        if (payloadData.userId) getCriteria._id = payloadData.userId;
        if (payloadData.skip) option.skip = payloadData.skip
        if (payloadData.limit) option.limit = payloadData.limit

        let project = {
            location: 1,
            _id: 1,
            name: 1,
            image: 1,
            countryCode: 1,
            phoneNumber: 1,
            email: 1,
            amount: 1,
            amountDueDate: 1,
            accountConnectionStatus: 1,
        }

        let [users, count] = await Promise.all([getRequired(Modal.Users, getCriteria, project, option), getCount(Modal.Users, getCriteria)]);

        payloadData.userId ? resolve(users[0]) : resolve({ list: users, count: count })
    });
}

//approve user account 
async function approveUserAccount(payloadData) {
    return new Promise(async (resolve, reject) => {
        await updateData(Modal.Users, { _id: payloadData.userId }, { accountConnectionStatus: 2 }, { new: true });
        resolve(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.ACC_LINKED)
    })
}

//CRUD of Channels
async function addChannel(payloadData) {
    return new Promise(async (resolve, reject) => {
        console.log("payloadDatapayloadData", payloadData)
        let dataToSave = {
            name: payloadData.name,
        };
        let date = new Date().getTime()
        dataToSave.createdAt = date
        dataToSave.updatedAt = date
        console.log("dataToSavedataToSave", dataToSave)
        if (payloadData.image) dataToSave.image = payloadData.image;

        let channel = await createData(Modal.Channels, dataToSave)
        resolve(channel)
    });
}

async function getChannels(payloadData) {
    return new Promise(async (resolve, reject) => {
        let option = { lean: true }
        let getCriteria = {
            isDeleted: false,
        };

        if (payloadData.channelId) getCriteria._id = payloadData.channelId;
        if (payloadData.skip) option.skip = payloadData.skip
        if (payloadData.limit) option.limit = payloadData.limit

        let [channels, count] = await Promise.all([getRequired(Modal.Channels, getCriteria, {}, option), getCount(Modal.Channels, getCriteria)]);

        payloadData.channelId ? resolve(channels[0]) : resolve({ list: channels, count: count })
    });
}

async function updateChannel(payloadData) {
    return new Promise(async (resolve, reject) => {
        let updateCriteria = {
            _id: payloadData.channelId
        }
        let dataToSet = {
            name: payloadData.name,
            isBlocked: payloadData.isBlocked
        };

        let date = new Date().getTime()
        dataToSet.updatedAt = date

        console.log("dataToSet", dataToSet)
        // if (payloadData.image) dataToSet.image = payloadData.image;

        await updateData(Modal.Channels, updateCriteria, dataToSet, { new: true });
        resolve(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED)
    });
}

async function deleteChannel(payloadData) {
    return new Promise(async (resolve, reject) => {
        let updateCriteria = {
            _id: payloadData.channelId
        }

        await updateData(Modal.Channels, updateCriteria, { isDeleted: true }, { new: true });
        resolve(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DELETED)
    });
}


//CRUD of Channel Genres
// async function addChannelGenres(payloadData) {
//     return new Promise(async (resolve, reject) => {
//         let dataToSave = {
//             name: payloadData.name
//         };
//         let date = new Date().getTime()
//         dataToSave.createdAt = date
//         dataToSave.updatedAt = date

//         let ChannelGenres = await createData(Modal.ChannelGenres, dataToSave)
//         resolve(ChannelGenres)
//     });
// }

// async function deleteChannelGenres(payloadData) {
//     return new Promise(async (resolve, reject) => {
//         let updateCriteria = {
//             _id: payloadData.channelGenreId
//         }

//         await updateData(Modal.ChannelGenres, updateCriteria, { isDeleted: true }, { new: true });
//         resolve(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DELETED)
//     });
// }

// async function getChannelGenres(payloadData) {
//     return new Promise(async (resolve, reject) => {
//         let option = { lean: true }
//         let getCriteria = {
//             isDeleted: false,
//         };

//         if (payloadData.channelGenreId) getCriteria._id = payloadData.channelGenreId;
//         if (payloadData.skip) option.skip = payloadData.skip
//         if (payloadData.limit) option.limit = payloadData.limit

//         let ChannelGenres = await getRequired(Modal.ChannelGenres, getCriteria, {}, option);

//         payloadData.channelGenreId ? resolve(ChannelGenres[0]) : resolve(ChannelGenres)
//     });
// }

// async function updateChannelGenres(payloadData) {
//     return new Promise(async (resolve, reject) => {
//         let updateCriteria = {
//             _id: payloadData.channelGenreId
//         }

//         let dataToSet = {
//             name: payloadData.name,
//         };

//         let date = new Date().getTime()
//         dataToSet.updatedAt = date

//         await updateData(Modal.ChannelGenres, updateCriteria, dataToSet, { new: true });
//         resolve(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED)
//     });
// }


//CRUD of Genres & Types
async function addGenresAndTypes(payloadData) {
    return new Promise(async (resolve, reject) => {
        let dataToSave = {
            name: payloadData.name,
            type: payloadData.type
        };
        let date = new Date().getTime()
        dataToSave.createdAt = date
        dataToSave.updatedAt = date

        let GenreAndTypes = await createData(Modal.GenresAndTypes, dataToSave)
        resolve(GenreAndTypes)
    });
}

async function deleteGenresAndTypes(payloadData) {
    return new Promise(async (resolve, reject) => {
        let updateCriteria = {
            _id: payloadData.genresAndTypeId
        }

        await updateData(Modal.GenresAndTypes, updateCriteria, { isDeleted: true }, { new: true });
        resolve(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DELETED)
    });
}

async function getGenresAndTypes(payloadData) {
    return new Promise(async (resolve, reject) => {
        let option = { lean: true }
        let getCriteria = {
            isDeleted: false,
            type: payloadData.type
        };

        if (payloadData.genresAndTypeId) getCriteria._id = payloadData.genresAndTypeId;
        if (payloadData.skip) option.skip = payloadData.skip
        if (payloadData.limit) option.limit = payloadData.limit

        let [GenreAndTypes, count] = await Promise.all([getRequired(Modal.GenresAndTypes, getCriteria, {}, option), getCount(Modal.GenresAndTypes, getCriteria)]);

        payloadData.genresAndTypeId ? resolve(GenreAndTypes[0]) : resolve({ list: GenreAndTypes, count: count })
    });
}

async function updateGenresAndTypes(payloadData) {
    return new Promise(async (resolve, reject) => {
        let updateCriteria = {
            _id: payloadData.genresAndTypeId
        }

        let dataToSet = {
            name: payloadData.name,
            type: payloadData.type,
            isBlocked: payloadData.isBlocked
        };

        let date = new Date().getTime()
        dataToSet.updatedAt = date

        await updateData(Modal.GenresAndTypes, updateCriteria, dataToSet, { new: true });
        resolve(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED)
    });
}

// CRUD of Directories
async function addDirectories(payloadData) {
    return new Promise(async (resolve, reject) => {
        let dataToSave = {};
        if (payloadData.name) dataToSave.name = payloadData.name
        if (payloadData.description) dataToSave.description = payloadData.description
        if (payloadData.country) dataToSave.country = payloadData.country
        if (payloadData.city) dataToSave.city = payloadData.city
        if (payloadData.address) dataToSave.address = payloadData.address
        if (payloadData.postalCode) dataToSave.postalCode = payloadData.postalCode
        if (payloadData.state) dataToSave.state = payloadData.state
        if (payloadData.localityName) dataToSave.localityName = payloadData.localityName
        if (payloadData.landmark) dataToSave.landmark = payloadData.landmark
        if (payloadData.image) dataToSave.image = payloadData.image

        let date = new Date().getTime()
        dataToSave.createdAt = date
        dataToSave.updatedAt = date

        if (payloadData.lat && payloadData.lng) {
            dataToSave.location = [payloadData.lat, payloadData.lng]
        }
        payloadData.priority ? dataToSave.priority = payloadData.priority : dataToSave.priority = 0
        dataToSave.directoryTypeId = payloadData.directoryTypeId

        let Directories = await createData(Modal.Directories, dataToSave)
        resolve(Directories)
    });
}

async function getDirectories(payloadData) {
    return new Promise(async (resolve, reject) => {
        let option = { lean: true }
        let getCriteria = {
            isDeleted: false,
        };

        if (payloadData.directoryId) getCriteria._id = payloadData.directoryId;
        if (payloadData.skip) option.skip = payloadData.skip
        if (payloadData.limit) option.limit = payloadData.limit

        // let Directories = await getRequired(Modal.Directories, getCriteria, {}, option);
        let [Directories, count] = await Promise.all([getRequired(Modal.Directories, getCriteria, {}, option), getCount(Modal.Directories, getCriteria)]);
        payloadData.directoryId ? resolve(Directories[0]) : resolve({ list: Directories, count: count })
    });
}

async function updateDirectory(payloadData) {
    return new Promise(async (resolve, reject) => {
        let updateCriteria = {
            _id: payloadData.directoryId
        }
        let dataToSet = {};

        if (payloadData.name) dataToSet.name = payloadData.name
        if (payloadData.description) dataToSet.description = payloadData.description
        if (payloadData.country) dataToSet.country = payloadData.country
        if (payloadData.city) dataToSet.city = payloadData.city
        if (payloadData.address) dataToSet.address = payloadData.address
        if (payloadData.postalCode) dataToSet.postalCode = payloadData.postalCode
        if (payloadData.state) dataToSet.state = payloadData.state
        if (payloadData.localityName) dataToSet.localityName = payloadData.localityName
        if (payloadData.landmark) dataToSet.landmark = payloadData.landmark
        if (payloadData.image) dataToSave.image = payloadData.image
        dataToSave.isBlocked = payloadData.isBlocked

        let date = new Date().getTime()
        dataToSet.updatedAt = date

        if (payloadData.lat && payloadData.lng) {
            dataToSet.location = [payloadData.lng, payloadData.lat]
        }
        payloadData.priority ? dataToSet.priority = payloadData.priority : dataToSet.priority = 0
        dataToSet.directoryTypeId = payloadData.directoryTypeId

        await updateData(Modal.Directories, updateCriteria, dataToSet, { new: true });
        resolve(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED)
    });
}

async function deleteDirectory(payloadData) {
    return new Promise(async (resolve, reject) => {
        let updateCriteria = {
            _id: payloadData.directoryId
        }

        await updateData(Modal.Directories, updateCriteria, { isDeleted: true }, { new: true });
        resolve(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DELETED)
    });
}


//CRUD of Directory Types
// async function addDirectoryTypes(payloadData) {
//     return new Promise(async (resolve, reject) => {
//         let dataToSave = {
//             name: payloadData.name
//         };
//         let date = new Date().getTime()
//         dataToSave.createdAt = date
//         dataToSave.updatedAt = date

//         let DirectoryTypes = await createData(Modal.DirectoryTypes, dataToSave)
//         resolve(DirectoryTypes)
//     });
// }

// async function deleteDirectoryTypes(payloadData) {
//     return new Promise(async (resolve, reject) => {
//         let updateCriteria = {
//             _id: payloadData.directoryTypeId
//         }

//         await updateData(Modal.DirectoryTypes, updateCriteria, { isDeleted: true }, { new: true });
//         resolve(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DELETED)
//     });
// }

// async function getDirectoryTypes(payloadData) {
//     return new Promise(async (resolve, reject) => {
//         let option = { lean: true }
//         let getCriteria = {
//             isDeleted: false,
//         };

//         if (payloadData.directoryTypeId) getCriteria._id = payloadData.directoryTypeId;
//         if (payloadData.skip) option.skip = payloadData.skip
//         if (payloadData.limit) option.limit = payloadData.limit

//         let DirectoryTypes = await getRequired(Modal.DirectoryTypes, getCriteria, {}, option);

//         payloadData.directoryTypeId ? resolve(DirectoryTypes[0]) : resolve(DirectoryTypes)
//     });
// }

// async function updateDirectoryTypes(payloadData) {
//     return new Promise(async (resolve, reject) => {
//         let updateCriteria = {
//             _id: payloadData.directoryTypeId
//         }
//         let dataToSet = {
//             name: payloadData.name,
//         };

//         let date = new Date().getTime()
//         dataToSet.updatedAt = date


//         await updateData(Modal.DirectoryTypes, updateCriteria, dataToSet, { new: true });
//         resolve(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED)
//     });
// }

//CRUD of Home Slider Images
async function addHomeSliderImages(payloadData) {
    return new Promise(async (resolve, reject) => {
        let dataToSave = {
            image: payloadData.image
        };
        let date = new Date().getTime()
        dataToSave.createdAt = date
        dataToSave.updatedAt = date


        let HomeSliderImages = await createData(Modal.HomeSlider, dataToSave)
        resolve(HomeSliderImages)
    });
}

async function deleteHomeSliderImages(payloadData) {
    return new Promise(async (resolve, reject) => {
        let updateCriteria = {
            _id: payloadData.sliderImageId
        }

        await updateData(Modal.HomeSlider, updateCriteria, { isDeleted: true }, { new: true });
        resolve(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DELETED)
    });
}

async function getHomeSliderImages(payloadData) {
    return new Promise(async (resolve, reject) => {
        let option = { lean: true }
        let getCriteria = {
            isDeleted: false,
        };

        if (payloadData.sliderImageId) getCriteria._id = payloadData.sliderImageId;
        if (payloadData.skip) option.skip = payloadData.skip
        if (payloadData.limit) option.limit = payloadData.limit

        console.log("getCriteria", getCriteria)
        let [HomeSliderImages, count] = await Promise.all([getRequired(Modal.HomeSlider, getCriteria, {}, option), getCount(Modal.HomeSlider, getCriteria)]);
        payloadData.sliderImageId ? resolve(HomeSliderImages[0]) : resolve({ list: HomeSliderImages, count: count })
    });
}

async function updateHomeSliderImages(payloadData) {
    return new Promise(async (resolve, reject) => {
        let updateCriteria = {
            _id: payloadData.sliderImageId
        }

        let dataToSet = {
            image: payloadData.image,
            isBlocked: payloadData.isBlocked
        };

        let date = new Date().getTime()
        dataToSet.updatedAt = date


        await updateData(Modal.DirectoryTypes, updateCriteria, { image: payloadData.image }, { new: true });
        resolve(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED)
    });
}

// CRUD of Events
async function addEvents(payloadData) {
    return new Promise(async (resolve, reject) => {
        let dataToSave = {};
        let date = new Date().getTime()
        if (payloadData.name) dataToSave.name = payloadData.name
        if (payloadData.description) dataToSave.description = payloadData.description
        if (payloadData.image) dataToSave.image = payloadData.image
        if (payloadData.country) dataToSave.country = payloadData.country
        if (payloadData.city) dataToSave.city = payloadData.city
        if (payloadData.address) dataToSave.address = payloadData.address
        if (payloadData.postalCode) dataToSave.postalCode = payloadData.postalCode
        if (payloadData.state) dataToSave.state = payloadData.state
        if (payloadData.localityName) dataToSave.localityName = payloadData.localityName
        if (payloadData.landmark) dataToSave.landmark = payloadData.landmark
        if (payloadData.startDate) dataToSave.startDate = payloadData.startDate
        if (payloadData.endDate) dataToSave.endDate = payloadData.endDate

        dataToSave.createdAt = date
        dataToSave.updatedAt = date

        if (payloadData.lat && payloadData.lng) {
            dataToSave.location = [payloadData.lng, payloadData.lat]
        }

        let Event = await createData(Modal.Events, dataToSave)
        resolve(Event)
    });
}

async function getEvents(payloadData) {
    return new Promise(async (resolve, reject) => {
        let option = { lean: true }
        let getCriteria = {
            isDeleted: false,
        };

        if (payloadData.eventId) getCriteria._id = payloadData.eventId;
        if (payloadData.skip) option.skip = payloadData.skip
        if (payloadData.limit) option.limit = payloadData.limit

        let [Events, count] = await Promise.all([getRequired(Modal.Events, getCriteria, {}, option), getCount(Modal.Events, getCriteria)]);
        payloadData.eventId ? resolve(Events[0]) : resolve({ list: Events, count: count })
    });
}

async function updateEvents(payloadData) {
    return new Promise(async (resolve, reject) => {
        let updateCriteria = {
            _id: payloadData.eventId
        }
        let dataToSet = {};
        let date = new Date().getTime()
        if (payloadData.name) dataToSet.name = payloadData.name
        if (payloadData.description) dataToSet.description = payloadData.description
        if (payloadData.image) dataToSet.image = payloadData.image
        if (payloadData.country) dataToSet.country = payloadData.country
        if (payloadData.city) dataToSet.city = payloadData.city
        if (payloadData.address) dataToSet.address = payloadData.address
        if (payloadData.postalCode) dataToSet.postalCode = payloadData.postalCode
        if (payloadData.state) dataToSet.state = payloadData.state
        if (payloadData.localityName) dataToSet.localityName = payloadData.localityName
        if (payloadData.landmark) dataToSet.landmark = payloadData.landmark
        if (payloadData.startDate) dataToSet.startDate = payloadData.startDate
        if (payloadData.endDate) dataToSet.endDate = payloadData.endDate

        dataToSet.isBlocked = payloadData.isBlocked
        dataToSet.updatedAt = date

        if (payloadData.lat && payloadData.lng) {
            dataToSet.location = [payloadData.lat, payloadData.lng]
        }
        let channel = await updateData(Modal.Events, updateCriteria, dataToSet, { new: true });
        resolve(channel)
    });
}

async function deleteEvents(payloadData) {
    return new Promise(async (resolve, reject) => {
        let updateCriteria = {
            _id: payloadData.eventId
        }

        await updateData(Modal.Events, updateCriteria, { isDeleted: true }, { new: true });
        resolve(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DELETED)
    });
}

// block data 
async function blockData(payloadData) {
    return new Promise(async (resolve, reject) => {
        let updateCriteria = {
            _id: payloadData.dataId
        }
        let Model
        if (payloadData.type == Config.APP_CONSTANTS.CATEGORY_TYPES.DIRECTORY_TYPE || payloadData.type == Config.APP_CONSTANTS.CATEGORY_TYPES.CHANNEL_GENRES) {
            Model = Modal.GenresAndTypes
        } else if (payloadData.type == Config.APP_CONSTANTS.CATEGORY_TYPES.CHANNEL) {
            Model = Modal.Channels
        } else if (payloadData.type == Config.APP_CONSTANTS.CATEGORY_TYPES.DIRECTORY) {
            Model = Modal.Directories
        } else if (payloadData.type == Config.APP_CONSTANTS.CATEGORY_TYPES.EVENT) {
            Model = Modal.Events
        }

        await updateData(Model, updateCriteria, { isBlocked: payloadData.isBlocked }, { new: true });
        resolve(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.BLOCKED)
    });
}

//local image upload
async function localImageUpload(payloadData) {
    let fileUpload = await UniversalFunctions.imageUploadLocal(payloadData)
    if (fileUpload) {
        return fileUpload.urls
    } else {
        return {}
    }

}

//update Service Links
async function updateServiceLinks(payloadData) {
    return new Promise(async (resolve, reject) => {
        let dataToUpdate = {
            ott_link: payloadData.ott_link,
            radio_link: payloadData.radio_link,
            church_link: payloadData.church_link,
        }

        let data = await updateData(Modal.Services, { "name": "services" }, dataToUpdate, { new: true });
        resolve(data)
    });
}

async function getServiceLinks() {
    return new Promise(async (resolve, reject) => {
        resolve(await Modal.Services.findOne({ "name": "services" }, { ott_link: 1, radio_link: 1, church_link: 1 }, { new: true }));
    });
}

//Common Query calling APIs
function createData(collection, dataToSave) {
    return new Promise((resolve, reject) => {
        Service.saveData(collection, dataToSave, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result)
            }
        });
    });
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

function updateData(collection, criteria, dataToUpdate, option) {
    return new Promise((resolve, reject) => {
        Service.findAndUpdate(collection, criteria, dataToUpdate, option, (err, result) => {
            if (err) {
                reject(err);
            } else {
                console.log("resultresultresult", result)
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
    adminLogin: adminLogin,

    //users
    // addEvents: addEvents,
    getUsers: getUsers,
    // updateEvents: updateEvents,
    // deleteEvents: deleteEvents,

    //User Account Approval
    approveUserAccount: approveUserAccount,

    //channels
    addChannel: addChannel,
    getChannels: getChannels,
    updateChannel: updateChannel,
    deleteChannel: deleteChannel,

    //directories
    addDirectories: addDirectories,
    getDirectories: getDirectories,
    updateDirectory: updateDirectory,
    deleteDirectory: deleteDirectory,

    //home slider images
    addHomeSliderImages: addHomeSliderImages,
    deleteHomeSliderImages: deleteHomeSliderImages,
    getHomeSliderImages: getHomeSliderImages,
    updateHomeSliderImages: updateHomeSliderImages,

    //events
    addEvents: addEvents,
    getEvents: getEvents,
    updateEvents: updateEvents,
    deleteEvents: deleteEvents,

    //category genres & directory types
    updateGenresAndTypes: updateGenresAndTypes,
    addGenresAndTypes: addGenresAndTypes,
    deleteGenresAndTypes: deleteGenresAndTypes,
    getGenresAndTypes: getGenresAndTypes,

    //service links
    updateServiceLinks: updateServiceLinks,
    getServiceLinks: getServiceLinks,

    //image upload
    localImageUpload: localImageUpload,
    blockData: blockData
}