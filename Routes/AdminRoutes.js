const Joi = require('@hapi/joi');
const UniversalFunctions = require('../Utils/UniversalFunctions');
const Controller = require('../Controllers');
const Config = require('../Config');

module.exports = [
    {
        method: 'POST',
        path: '/admin/login',
        config: {
            handler: async function (request, h) {
                try {
                    const loginAdmin = await Controller.AdminController.adminLogin(request.payload)
                    console.log("loginAdminloginAdmin", loginAdmin)
                    return (UniversalFunctions.sendSuccess(null, loginAdmin))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'admin login api',
            notes: 'admin login api',
            tags: ['api', 'admin'],
            validate: {
                payload: {
                    email: Joi.string().lowercase().required(),
                    password: Joi.string().required(),
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
    //Users Route
    {
        method: 'GET',
        path: '/admin/users',
        config: {
            handler: async function (request, h) {
                try {
                    const users = await Controller.AdminController.getUsers(request.query)
                    return (UniversalFunctions.sendSuccess(null, users))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Users List',
            notes: 'Users List api',
            tags: ['api', 'user'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                query: {
                    userId: Joi.string().optional(),
                    skip: Joi.number().default(0).optional(),
                    limit: Joi.number().default(20).optional(),
                    status:Joi.number().valid([0,1,2,3]).optional().default(0).description("0:all, 1:New Comings, 2:Link Request, 3: Linked Users ")
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
    //Channels Route
    {
        method: 'POST',
        path: '/admin/channels',
        config: {
            handler: async function (request, h) {
                try {
                    const addChannel = await Controller.AdminController.addChannel(request.payload)
                    return (UniversalFunctions.sendSuccess(null, addChannel))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Create Channels',
            notes: 'admin channel add api',
            tags: ['api', 'admin'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                payload: {
                    name: Joi.string().required(),
                    image: Joi.object().optional(),
                    description: Joi.string().optional(),
                    channelGenreId: Joi.string().required(),
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
        path: '/admin/channels',
        config: {
            handler: async function (request, h) {
                try {
                    const channels = await Controller.AdminController.getChannels(request.query)
                    return (UniversalFunctions.sendSuccess(null, channels))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Channels List',
            notes: 'Channels List api',
            tags: ['api', 'user'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
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
        method: 'PUT',
        path: '/admin/channels',
        config: {
            handler: async function (request, h) {
                try {
                    console.log("request.payloadrequest.payload", request.payload)
                    const updateChannel = await Controller.AdminController.updateChannel(request.payload)
                    console.log("addChannelsaddChannels", updateChannel)
                    return (UniversalFunctions.sendSuccess(updateChannel))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Update Channels',
            notes: 'admin channel update api',
            tags: ['api', 'admin'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                payload: {
                    channelId: Joi.string().required(),
                    name: Joi.string().required(),
                    image: Joi.object().optional(),
                    description: Joi.string().optional(),
                    channelGenreId: Joi.string().required(),
                    isBlocked : Joi.boolean().optional().valid([false, true]).default(false)
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
        method: 'DELETE',
        path: '/admin/channels',
        config: {
            handler: async function (request, h) {
                try {
                    const channels = await Controller.AdminController.deleteChannel(request.query)
                    return (UniversalFunctions.sendSuccess(channels))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Delete Channels',
            notes: 'Delete Channel api',
            tags: ['api', 'user'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                query: {
                    channelId: Joi.string().optional(),
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
    //Channel Genres & Directory Types
    {
        method: 'POST',
        path: '/admin/channelGenresAndDirectoryTypes',
        config: {
            handler: async function (request, h) {
                try {
                    const addDirectoryTypes = await Controller.AdminController.addGenresAndTypes(request.payload)
                    return (UniversalFunctions.sendSuccess(null, addDirectoryTypes))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Create Channel Genre & Directory Types',
            notes: 'create Channel Genre & Directory Types api',
            tags: ['api', 'admin'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                payload: {
                    name: Joi.string().required(),
                    type: Joi.string().valid([Config.APP_CONSTANTS.CATEGORY_TYPES.DIRECTORY_TYPE, Config.APP_CONSTANTS.CATEGORY_TYPES.CHANNEL_GENRES]).required(),
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
        path: '/admin/channelGenresAndDirectoryTypes',
        config: {
            handler: async function (request, h) {
                try {
                    const directoryTypes = await Controller.AdminController.getGenresAndTypes(request.query)
                    return (UniversalFunctions.sendSuccess(null, directoryTypes))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Channel Genre & Directory Types List',
            notes: 'Channel Genre & Directory Types List api',
            tags: ['api', 'user'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                query: {
                    genresAndTypeId: Joi.string().optional(),
                    type: Joi.string().valid([Config.APP_CONSTANTS.CATEGORY_TYPES.DIRECTORY_TYPE, Config.APP_CONSTANTS.CATEGORY_TYPES.CHANNEL_GENRES]).required(),
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
        method: 'DELETE',
        path: '/admin/channelGenresAndDirectoryTypes',
        config: {
            handler: async function (request, h) {
                try {
                    const directory = await Controller.AdminController.deleteGenresAndTypes(request.query)
                    return (UniversalFunctions.sendSuccess(directory))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Delete Channel Genre & Directory Types',
            notes: 'Delete Channel Genre & Directory Types api',
            tags: ['api', 'user'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                query: {
                    genresAndTypeId: Joi.string().required(),
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
        method: 'PUT',
        path: '/admin/channelGenresAndDirectoryTypes',
        config: {
            handler: async function (request, h) {
                try {
                    const updateDirectoryTypes = await Controller.AdminController.updateGenresAndTypes(request.payload)
                    return (UniversalFunctions.sendSuccess(updateDirectoryTypes))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Update Channel Genre & Directory Types',
            notes: 'Update Channel Genre & Directory Types api',
            tags: ['api', 'admin'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                payload: {
                    genresAndTypeId: Joi.string().required(),
                    name: Joi.string().required(),
                    type: Joi.string().valid([Config.APP_CONSTANTS.CATEGORY_TYPES.DIRECTORY_TYPE, Config.APP_CONSTANTS.CATEGORY_TYPES.CHANNEL_GENRES]).required(),
                    isBlocked : Joi.boolean().optional().valid([false, true]).default(false)
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
    //Directories Route
    {
        method: 'POST',
        path: '/admin/directories',
        config: {
            handler: async function (request, h) {
                try {
                    const addDirectory = await Controller.AdminController.addDirectories(request.payload)
                    return (UniversalFunctions.sendSuccess(null, addDirectory))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Create Directories',
            notes: 'admin directory add api',
            tags: ['api', 'admin'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                payload: {
                    name: Joi.string().optional(),
                    description: Joi.string().optional(),
                    lat: Joi.string().optional(),
                    lng: Joi.string().optional(),
                    country: Joi.string().optional(),
                    city: Joi.string().optional(),
                    address: Joi.string().optional(),
                    postalCode: Joi.string().optional(),
                    state: Joi.string().optional(),
                    localityName: Joi.string().optional(),
                    landmark: Joi.string().optional(),
                    priority: Joi.number().optional(),
                    image: Joi.object().optional(),
                    directoryTypeId: Joi.string().required(),
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
        path: '/admin/directories',
        config: {
            handler: async function (request, h) {
                try {
                    const channels = await Controller.AdminController.getDirectories(request.query)
                    return (UniversalFunctions.sendSuccess(null, channels))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Directories List',
            notes: 'Directories List api',
            tags: ['api', 'user'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                query: {
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
        method: 'PUT',
        path: '/admin/directories',
        config: {
            handler: async function (request, h) {
                try {
                    const updateDirectory = await Controller.AdminController.updateDirectory(request.payload)
                    return (UniversalFunctions.sendSuccess(updateDirectory))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Update Directories',
            notes: 'Update Directories api',
            tags: ['api', 'admin'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                payload: {
                    directoryId: Joi.string().required(),
                    name: Joi.string().optional(),
                    description: Joi.string().optional(),
                    lat: Joi.string().optional(),
                    lng: Joi.string().optional(),
                    country: Joi.string().optional(),
                    city: Joi.string().optional(),
                    address: Joi.string().optional(),
                    postalCode: Joi.string().optional(),
                    state: Joi.string().optional(),
                    localityName: Joi.string().optional(),
                    landmark: Joi.string().optional(),
                    priority: Joi.number().optional(),
                    image: Joi.object().optional(),
                    directoryTypeId: Joi.string().required(),
                    isBlocked : Joi.boolean().optional().valid([false, true]).default(false)
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
        method: 'DELETE',
        path: '/admin/directories',
        config: {
            handler: async function (request, h) {
                try {
                    const directory = await Controller.AdminController.deleteDirectory(request.query)
                    return (UniversalFunctions.sendSuccess(directory))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Delete Directories',
            notes: 'Delete Directories api',
            tags: ['api', 'user'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                query: {
                    directoryId: Joi.string().required(),
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
    //Home Slider Images Route
    {
        method: 'POST',
        path: '/admin/homeSliderImages',
        config: {
            handler: async function (request, h) {
                try {
                    const addHomeSliderImages = await Controller.AdminController.addHomeSliderImages(request.payload)
                    return (UniversalFunctions.sendSuccess(null, addHomeSliderImages))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Create Home Slider',
            notes: 'create home slider image api',
            tags: ['api', 'admin'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                payload: {
                    image: Joi.object().required(),
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
        path: '/admin/homeSliderImages',
        config: {
            handler: async function (request, h) {
                try {
                    const getHomeSliderImages = await Controller.AdminController.getHomeSliderImages(request.query)
                    return (UniversalFunctions.sendSuccess(null, getHomeSliderImages))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Home Slider List',
            notes: 'Home Slider Images List api',
            tags: ['api', 'user'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                query: {
                    sliderImageId: Joi.string().optional(),
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
        method: 'DELETE',
        path: '/admin/homeSliderImages',
        config: {
            handler: async function (request, h) {
                try {
                    const homeSliderImage = await Controller.AdminController.deleteHomeSliderImages(request.query)
                    return (UniversalFunctions.sendSuccess(homeSliderImage))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Delete Home Slider',
            notes: 'Delete Home Slider Image api',
            tags: ['api', 'user'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                query: {
                    directoryTypeId: Joi.string().required(),
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
        method: 'PUT',
        path: '/admin/homeSliderImages',
        config: {
            handler: async function (request, h) {
                try {
                    const updateHomeSliderImages = await Controller.AdminController.updateHomeSliderImages(request.payload)
                    return (UniversalFunctions.sendSuccess(updateHomeSliderImages))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Update Home Slider',
            notes: 'Update home slider image api',
            tags: ['api', 'admin'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                payload: {
                    directoryTypeId: Joi.string().required(),
                    image: Joi.object().required(),
                    isBlocked : Joi.boolean().optional().valid([false, true]).default(false)
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
    //Event Route
    {
        method: 'POST',
        path: '/admin/events',
        config: {
            handler: async function (request, h) {
                try {
                    const addDirectory = await Controller.AdminController.addEvents(request.payload)
                    return (UniversalFunctions.sendSuccess(null, addDirectory))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Create Events',
            notes: 'admin events add api',
            tags: ['api', 'admin'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                payload: {
                    name: Joi.string().optional(),
                    description: Joi.string().optional(),
                    image: Joi.object().optional(),
                    country: Joi.string().optional(),
                    city: Joi.string().optional(),
                    address: Joi.string().optional(),
                    postalCode: Joi.string().optional(),
                    state: Joi.string().optional(),
                    localityName: Joi.string().optional(),
                    landmark: Joi.string().optional(),
                    startDate: Joi.number().optional(),
                    endDate: Joi.number().optional(),
                    lat: Joi.number().optional(),
                    lng: Joi.number().optional(),
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
        path: '/admin/events',
        config: {
            handler: async function (request, h) {
                try {
                    const events = await Controller.AdminController.getEvents(request.query)
                    return (UniversalFunctions.sendSuccess(null, events))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Events List',
            notes: 'Event List api',
            tags: ['api', 'user'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                query: {
                    eventId: Joi.string().optional(),
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
        method: 'PUT',
        path: '/admin/events',
        config: {
            handler: async function (request, h) {
                try {
                    const updateEvents = await Controller.AdminController.updateEvents(request.payload)
                    return (UniversalFunctions.sendSuccess(updateEvents))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Update Events',
            notes: 'Update Event api',
            tags: ['api', 'admin'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                payload: {
                    eventId: Joi.string().required(),
                    name: Joi.string().optional(),
                    description: Joi.string().optional(),
                    image: Joi.object().optional(),
                    country: Joi.string().optional(),
                    city: Joi.string().optional(),
                    address: Joi.string().optional(),
                    postalCode: Joi.string().optional(),
                    state: Joi.string().optional(),
                    localityName: Joi.string().optional(),
                    landmark: Joi.string().optional(),
                    startDate: Joi.number().optional(),
                    endDate: Joi.number().optional(),
                    lat: Joi.number().optional(),
                    lng: Joi.number().optional(),
                    isBlocked : Joi.boolean().optional().valid([false, true]).default(false)
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
        method: 'DELETE',
        path: '/admin/events',
        config: {
            handler: async function (request, h) {
                try {
                    const event = await Controller.AdminController.deleteEvents(request.query)
                    return (UniversalFunctions.sendSuccess(event))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Delete Events',
            notes: 'Delete Event api',
            tags: ['api', 'user'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                query: {
                    eventId: Joi.string().required(),
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
    //Upload Local Media Route
    {
        method: 'POST',
        path: '/admin/imageUpload',
        config: {
            handler: async function (request, h) {
                try {
                    const localImageUpload = await Controller.AdminController.localImageUpload(request.payload)
                    return (UniversalFunctions.sendSuccess(null, localImageUpload))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Upload Image',
            notes: 'upload image api',
            tags: ['api', 'admin'],
            payload: {
                maxBytes: 200000000,
                parse: true,
                output: 'stream',
                timeout: false
            },
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                payload: {
                    image: Joi.any().meta({ swaggerType: 'file' }),
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
    //Blocke API
    {
        method: 'POST',
        path: '/admin/blockData',
        config: {
            handler: async function (request, h) {
                try {
                    const blockData = await Controller.AdminController.blockData(request.payload)
                    return (UniversalFunctions.sendSuccess(blockData))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Block Data',
            notes: 'Block API',
            tags: ['api', 'admin'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                payload: {
                    dataId: Joi.string().required(),
                    type: Joi.string().valid([
                        Config.APP_CONSTANTS.CATEGORY_TYPES.DIRECTORY_TYPE, Config.APP_CONSTANTS.CATEGORY_TYPES.CHANNEL_GENRES,
                        Config.APP_CONSTANTS.CATEGORY_TYPES.CHANNEL,
                        Config.APP_CONSTANTS.CATEGORY_TYPES.DIRECTORY,
                        Config.APP_CONSTANTS.CATEGORY_TYPES.EVENT,
                    ]).required(),
                    isBlocked : Joi.boolean().optional().valid([false, true]).default(false)
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
    //Service Links API
    {
        method: 'POST',
        path: '/admin/updateServiceLinks',
        config: {
            handler: async function (request, h) {
                try {
                    const updateServiceLinks = await Controller.AdminController.updateServiceLinks(request.payload)
                    return (UniversalFunctions.sendSuccess(null,updateServiceLinks))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Service Links',
            notes: 'Service Links API',
            tags: ['api', 'admin'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                payload: {
                    ott_link: Joi.string().optional(),
                    radio_link: Joi.string().optional(),
                    church_link: Joi.string().optional(),
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
        method: 'GET',
        path: '/admin/updateServiceLinks',
        config: {
            handler: async function (request, h) {
                try {
                    const getServiceLinks = await Controller.AdminController.getServiceLinks()
                    return (UniversalFunctions.sendSuccess(null,getServiceLinks))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Service Links',
            notes: 'Service Links API',
            tags: ['api', 'admin'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                query: {
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
    //User Account API
    {
        method: 'POST',
        path: '/admin/userAccount',
        config: {
            handler: async function (request, h) {
                try {
                    const accountLinking = await Controller.AdminController.approveUserAccount(request.payload)
                    return (UniversalFunctions.sendSuccess(accountLinking,null))
                } catch (err) {
                    console.log("errerr", err)
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Approve User Account',
            notes: 'Approve User Account API',
            tags: ['api', 'admin'],
            auth: UniversalFunctions.CONFIG.APP_CONSTANTS.AUTH.admin,
            validate: {
                payload: {
                    userId: Joi.string().required(),
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
]