const express = require('express');
const router = express.Router();

const ServicesRouter = (Services) => {
    Services = Services || require('./services.service');

    /**
     * List all services
     */
    router.get('/', async (req, res, next) => {

        const parameters = {
            "marketID": req.query.marketID, //Retrieves existing services by market-id
            "locationId": req.query.locationId, //Retrieves existing services by location-id
            "status": req.query.status, //Filters existing services by service status. The possible values are "critical", "warning" and "stable".
        };

        try{
            const result = await Services.getServices(parameters);
            if(result.error)next(result.error);
            res.status(200).json({services: result.services});
        }
        catch (e){
            next(e);
        }
    });

    /**
     * To retrieve a representation of a service
     */
    router.get('/:SERVICE_ID', async (req, res, next) => {

        const parameters = {
            "SERVICE_ID": req.params.SERVICE_ID, //The service that needs to be fetched.
            "marketID": req.query.marketID, //Retrieves existing services by market-id
            "locationId": req.query.locationId, //Retrieves existing services by location-id
            "status": req.query.status, //Filters existing services by service status. The possible values are "critical", "warning" and "stable".
        };

        try{
            const result = await Services.getService(parameters);
            if(result.error)next(result.error);
            res.status(200).json({services: result.services});
        }
        catch (e){
            next(e);
        }
    });

    /**
     * To create a new service
     */
    router.post('/:SERVICE_ID', async (req, res, next) => {

        const parameters = {
            "SERVICE_ID": req.params.SERVICE_ID, //The service that needs to be fetched.
        };

        try{
            const result = await Services.createService(parameters);
            if(result.error)next(result.error);
            res.status(200).json({});
        }
        catch (e){
            next(e);
        }
    });

    /**
     * To update an existing service
     */
    router.put('/:SERVICE_ID', async (req, res, next) => {

        const parameters = {
            "SERVICE_ID": req.params.SERVICE_ID, //The service that needs to be fetched.
        };

        try{
            const result = await Services.modifyService(parameters);
            if(result.error)next(result.error);
            res.status(200).json({});
        }
        catch (e){
            next(e);
        }
    });

    /**
     * 
     */
    router.delete('/:SERVICE_ID', async (req, res, next) => {

        const parameters = {
            "SERVICE_ID": req.params.SERVICE_ID, //The service that needs to be fetched.
        };

        try{
            const result = await Services.deleteService(parameters);
            if(result.error)next(result.error);
            res.status(200).json({});
        }
        catch (e){
            next(e);
        }
    });

    /**
     * To update an existing service. It only updates the fields that were supplied, leaving the others alone.
     */
    router.patch('/:SERVICE_ID', async (req, res, next) => {

        const parameters = {
            "SERVICE_ID": req.params.SERVICE_ID, //The service that needs to be fetched.
        };

        try{
            const result = await Services.updateService(parameters);
            if(result.error)next(result.error);
            res.status(200).json({});
        }
        catch (e){
            next(e);
        }
    });

    return router;
};
module.exports = ServicesRouter;
