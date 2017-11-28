import Joi from 'joi-browser';
import { LAYER_TILED, LAYER_CARTO } from './layerTypes';

const validateConfig = config => {
    const tiledLayerSchema = Joi.object().keys({
        type: Joi.any().valid(LAYER_TILED).required(),
        options: Joi.object().keys({
            urlTemplate: Joi.string().required(),
            minZoom: Joi.number().min(0).required(),
            maxZoom: Joi.number().min(0).required(),
            attribution: Joi.string().required(),
        })
    }).required();

    const cartoLayerSchema = Joi.object().keys({
        type: Joi.any().valid(LAYER_CARTO).required(),
        options: Joi.object().keys({
            sql: Joi.string().required(),
            cartocss: Joi.string().required(),
            cartocss_version: Joi.string().required()
        })
    }).required();

    const schema = Joi.object().keys({
        center: Joi.string().required(),
        zoom: Joi.number().min(0).required(),
        maps_api_config: Joi.object().keys({
            user_name: Joi.string().required(),
            maps_api_template: Joi.string().required()
        }).required(),
        layers: Joi.array().ordered(
            tiledLayerSchema,
            cartoLayerSchema,
            tiledLayerSchema
        ).required()
    });

    const result = Joi.validate(config, schema, { abortEarly: false, allowUnknown: true });
    if (result.error) {
        throw new Error('Invalid config: ' + result.error);
    }
};

export default validateConfig;