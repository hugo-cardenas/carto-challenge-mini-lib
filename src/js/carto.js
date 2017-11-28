import validateConfig from './configValidator';
import { LAYER_TILED, LAYER_CARTO } from './layerTypes';

// TODO Memoize function to cache results per config object

export const getGroupId = async config => {
    validateConfig(config);

    const payload = buildPayload(config.layers);
    const mapsApiConfig = config.maps_api_config;
    const url = mapsApiConfig.maps_api_template.replace('{user}', mapsApiConfig.user_name) + '/api/v1/map';

    const response = await fetch(url, {
        body: JSON.stringify(payload),
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        method: 'POST'
    });

    if (!response.ok) {
        let errorMessage = response.statusText;
        try {
            const body = await response.json();
            if (Array.isArray(body.errors)) {
                errorMessage += ': ' + body.errors.join(', ');
            }
        } catch (error) {}
        
        throw new Error(errorMessage);
    }

    const body = await response.json();
    if (!body.layergroupid) {
        throw new Error('Response object missing layergroupid');
    }
    
    return body.layergroupid;
};

const buildPayload = layers => {
    const foo = [layers[0], layers[1]];

    return {
        layers: foo.map(layer => {
            const options = layer.options;
            if (layer.type === LAYER_TILED) {
                return {
                    type: 'http',
                    options: {
                        urlTemplate: options.urlTemplate
                    }
                };
            } else {
                return {
                    type: 'mapnik',
                    options: {
                        cartocss: options.cartocss,
                        cartocss_version: options.cartocss_version,
                        sql: options.sql,
                        interactivity: ['cartodb_id']
                    }
                };
            }
        })
    };
};
