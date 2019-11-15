const Joi = require('@hapi/joi');
const UniversalFunctions = require('../Utils/UniversalFunctions');
const Controller = require('../Controllers');
const Config = require('../Config');

module.exports = [
    {
        method: 'POST',
        path: '/user/userRegisteration',
        config: {
            handler: async function (request, h) {
                try {
                    const register = await Controller.UserController.userRegisteration(request.payload)
                    return (UniversalFunctions.sendSuccess(null, register))
                } catch (err) {
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'user register ',
            notes: 'sign up api',
            tags: ['api', 'user'],
            validate: {
                payload: {
                    name: Joi.string().optional(),
                    countryCode: Joi.string().optional(),
                    phoneNumber: Joi.number().optional(),
                    password: Joi.string().required(),
                    email: Joi.string().required(),
                    deviceToken: Joi.string().optional(),
                },
                // failAction: UniversalFunctions.failActionFunction
                failAction: 'log'
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responses: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/user/login',
        config: {
            handler: async function (request, h) {
                try {
                    console.log("payload data", request.payload)
                    const loginUser = await Controller.UserController.login(request.payload)
                    return (UniversalFunctions.sendSuccess(null, loginUser))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Login',
            notes: 'sign up api',
            tags: ['api', 'user'],
            validate: {
                payload: {
                    email: Joi.string().max(140).lowercase().required(),
                    password: Joi.string().max(140).required(),
                    deviceToken: Joi.string().max(300).optional(),
                    location: Joi.object().optional(),
                    // location: Joi.object().keys({
                    //     adminArea: Joi.string().max(500).optional(),
                    //     country: Joi.string().max(500).optional(),
                    //     countryCode: Joi.string().max(500).optional(),
                    //     feature: Joi.string().max(500).optional(),
                    //     formattedAddress: Joi.string().max(500).optional(),
                    //     locality: Joi.string().max(500).optional(),
                    //     postalCode: Joi.string().max(500).optional(),
                    //     streetName: Joi.string().max(500).optional(),
                    //     streetNumber: Joi.string().max(500).optional(),
                    //     subAdminArea: Joi.string().max(500).optional(),
                    //     subLocality: Joi.string().max(500).optional(),
                    //     position: Joi.object().keys({
                    //         lng: Joi.number().max(500).optional(),
                    //         lat: Joi.number().max(500).optional(),
                    //     }),

                    // })
                },
                // failAction: UniversalFunctions.failActionFunction
                failAction: 'log'
            },
            plugins: {
                'hapi-swagger': {
                    responses: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/user/logout',
        config: {
            handler: async function (request, h) {
                try {
                    let userData = request.auth && request.auth.credentials && request.auth.credentials[0];
                    const logoutUser = await Controller.UserController.logout(userData)
                    return (UniversalFunctions.sendSuccess(null, logoutUser))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Logout',
            notes: 'logout api',
            tags: ['api', 'user'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.user,
            validate: {
                headers: UniversalFunctions.authorizationHeaderObj,
                // failAction: UniversalFunctions.failActionFunction
                failAction: 'log'
            },
            plugins: {
                'hapi-swagger': {
                    responses: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/user/userChannel',
        config: {
            handler: async function (request, h) {
                try {
                    const channels = await Controller.UserController.getChannels(request.query)
                    return (UniversalFunctions.sendSuccess(null, channels))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'User Channels List',
            notes: 'Channels List api',
            tags: ['api', 'user'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.user,
            validate: {
                query: {
                    channelId: Joi.string().optional(),
                    skip: Joi.number().default(0).optional(),
                    limit: Joi.number().default(20).optional(),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                // failAction: UniversalFunctions.failActionFunction
                failAction: 'log'
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responses: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/user/guestChannel',
        config: {
            handler: async function (request, h) {
                try {
                    const channels = await Controller.UserController.getChannels(request.query)
                    return (UniversalFunctions.sendSuccess(null, channels))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Guest Channels List',
            notes: 'Channels List api',
            tags: ['api', 'user'],
            validate: {
                query: {
                    channelId: Joi.string().optional(),
                    skip: Joi.number().default(0).optional(),
                    limit: Joi.number().default(20).optional(),
                },
                // failAction: UniversalFunctions.failActionFunction
                failAction: 'log'
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responses: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/user/guestDirectories',
        config: {
            handler: async function (request, h) {
                try {
                    const directories = await Controller.UserController.getDirectories(request.query,{})
                    return (UniversalFunctions.sendSuccess(null, directories))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Directories List',
            notes: 'Directories List api',
            tags: ['api', 'user'],
            validate: {
                query: {
                    directoryTypeId: Joi.string().required(),
                    directoryId: Joi.string().optional(),
                    lat: Joi.number().optional(),
                    lng: Joi.number().optional(),
                    skip: Joi.number().default(0).optional(),
                    limit: Joi.number().default(20).optional(),
                },
                // failAction: UniversalFunctions.failActionFunction
                failAction: 'log'
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responses: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/user/userDirectories',
        config: {
            handler: async function (request, h) {
                try {
                    let userData = request.auth && request.auth.credentials && request.auth.credentials[0];
                    const directories = await Controller.UserController.getDirectories(request.query,userData)
                    return (UniversalFunctions.sendSuccess(null, directories))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Directories List',
            notes: 'Directories List api',
            tags: ['api', 'user'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.user,
            validate: {
                query: {
                    directoryTypeId: Joi.string().required(),
                    directoryId: Joi.string().optional(),
                    skip: Joi.number().default(0).optional(),
                    limit: Joi.number().default(20).optional(),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                // failAction: UniversalFunctions.failActionFunction
                failAction: 'log'
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responses: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/user/guestEvents',
        config: {
            handler: async function (request, h) {
                try {
                    const directories = await Controller.UserController.getEvents(request.query)
                    return (UniversalFunctions.sendSuccess(null, directories))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Events List',
            notes: 'Events List api',
            tags: ['api', 'user'],
            validate: {
                query: {
                    eventId: Joi.string().optional(),
                    skip: Joi.number().default(0).optional(),
                    limit: Joi.number().default(20).optional(),
                },
                // failAction: UniversalFunctions.failActionFunction
                failAction: 'log'
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responses: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/user/userEvents',
        config: {
            handler: async function (request, h) {
                try {
                    const directories = await Controller.UserController.getEvents(request.query)
                    return (UniversalFunctions.sendSuccess(null, directories))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Events List',
            notes: 'Events List api',
            tags: ['api', 'user'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.user,
            validate: {
                query: {
                    eventId: Joi.string().optional(),
                    skip: Joi.number().default(0).optional(),
                    limit: Joi.number().default(20).optional(),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: 'log'
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responses: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/user/updateLocation',
        config: {
            handler: async function (request, h) {
                try {
                    let userData = request.auth && request.auth.credentials && request.auth.credentials[0];
                    const updateLocation = await Controller.UserController.updateLocation(request.payload, userData)
                    return (UniversalFunctions.sendSuccess(null, updateLocation))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'updateLocation',
            notes: 'sign up api',
            tags: ['api', 'user'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.user,
            validate: {
                payload: {
                    location: Joi.object().keys({
                        adminArea: Joi.string().min(1).max(200).optional(),
                        country: Joi.string().min(1).max(200).optional(),
                        countryCode: Joi.string().min(1).max(200).optional(),
                        feature: Joi.string().min(1).max(200).optional(),
                        formattedAddress: Joi.string().min(1).max(200).optional(),
                        locality: Joi.string().min(1).max(200).optional(),
                        postalCode: Joi.string().min(1).max(200).optional(),
                        streetName: Joi.string().min(1).max(200).optional(),
                        streetNumber: Joi.string().min(1).max(200).optional(),
                        subAdminArea: Joi.string().min(1).max(200).optional(),
                        subLocality: Joi.string().min(1).max(200).optional(),
                        position: Joi.object().keys({
                            lng: Joi.number().max(500).optional(),
                            lat: Joi.number().max(500).optional(),
                        }),
                    })
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                // failAction: UniversalFunctions.failActionFunction
                failAction: 'log'
            },
            plugins: {
                'hapi-swagger': {
                    // payloadType : 'form',
                    responses: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/user/guestHomeData',
        config: {
            handler: async function (request, h) {
                try {
                    let userData = request.auth && request.auth.credentials && request.auth.credentials[0];
                    const updateLocation = await Controller.UserController.homeData(request.payload, userData)
                    return (UniversalFunctions.sendSuccess(null, updateLocation))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Guest Home Data',
            notes: 'sign up api',
            tags: ['api', 'user'],
            validate: {
                payload: {
                    location: Joi.object().keys(),
                    skip: Joi.number().default(0).optional(),
                    limit: Joi.number().default(20).optional(),
                },
                // failAction: UniversalFunctions.failActionFunction
                failAction: 'log'
            },
            plugins: {
                'hapi-swagger': {
                    responses: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/user/userHomeData',
        config: {
            handler: async function (request, h) {
                try {
                    let userData = request.auth && request.auth.credentials && request.auth.credentials[0];
                    const updateLocation = await Controller.UserController.homeData(request.payload, userData)
                    return (UniversalFunctions.sendSuccess(null, updateLocation))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'User Home Data',
            notes: 'sign up api',
            tags: ['api', 'user'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.user,
            validate: {
                payload: {
                    location: Joi.object().keys(),
                    skip: Joi.number().default(0).optional(),
                    limit: Joi.number().default(20).optional(),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                // failAction: UniversalFunctions.failActionFunction
                failAction: 'log'
            },
            plugins: {
                'hapi-swagger': {
                    responses: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/user/getDirectoryTypes',
        config: {
            handler: async function (request, h) {
                try {
                    const directories = await Controller.UserController.getDirectoryTypes(request.query)
                    return (UniversalFunctions.sendSuccess(null, directories))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Directories List',
            notes: 'Directories List api',
            tags: ['api', 'user'],
            validate: {
                query: {
                },
                // failAction: UniversalFunctions.failActionFunction
                failAction: 'log'
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responses: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/user/getChannelGenres',
        config: {
            handler: async function (request, h) {
                try {
                    const directories = await Controller.UserController.getChannelGenres(request.query)
                    return (UniversalFunctions.sendSuccess(null, directories))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Channel Genres List',
            notes: 'Channel Genres List api',
            tags: ['api', 'user'],
            validate: {
                query: {
                },
                // failAction: UniversalFunctions.failActionFunction
                failAction: 'log'
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responses: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/user/accountLinkingRequest',
        config: {
            handler: async function (request, h) {
                try {
                    let userData = request.auth && request.auth.credentials && request.auth.credentials[0];
                    const linkRequest = await Controller.UserController.accountLinkingRequest(userData)
                    return (UniversalFunctions.sendSuccess(linkRequest,null))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Account Linking Request',
            notes: 'Account Linking Request api',
            tags: ['api', 'user'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.user,
            validate: {
                query: {
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                // failAction: UniversalFunctions.failActionFunction
                failAction: 'log'
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responses: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },


]