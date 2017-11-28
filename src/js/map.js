const L = require('leaflet');
const validateConfig = require('./configValidator').default;
const { getGroupId } = require('./carto');
const { LAYER_TILED, LAYER_CARTO } = require('./layerTypes');

const createMap = async(id, config) => {
    validateConfig(config);

    const layers = await Promise.all(
        config.layers.map(layer => {
            if (layer.type === LAYER_TILED) {
                return createBasicLayer(layer.options);
            } else {
                return createCartoLayer(config)
            }
        })
    );

    const coordinates = JSON.parse(config.center);
    const zoom = config.zoom;
    const map = L.map(id);
    map.setView(coordinates, zoom);

    let layerGroups = [];
    layers.forEach((layer, index) => {
        const layerGroup = L.layerGroup().addLayer(layer).setZIndex(index);
        layerGroups.push(layerGroup);
        layerGroup.addTo(map);
    });

    const hideLayer = i => {
        layerGroups[i].clearLayers();
    };

    const showLayer = i => {
        if (!layerGroups[i].hasLayer(layers[i])) {
            layerGroups[i].addLayer(layers[i]);
        }
    };

    const setSQL = async(i, sql) => {
        if (config.layers[i].type === LAYER_CARTO) {
            config.layers[i].options.sql = sql;
            const newLayer = await createCartoLayer(config);
            layers[i] = newLayer;
            if (layerGroups[i].getLayers().length > 0) {
                layerGroups[i].clearLayers();
                layerGroups[i].addLayer(layers[i]);
            }
        }
    };

    // TODO Optimize to not create objects every single time
    const getLayers = () =>
        layers.map((leafletLayer, i) => {
            const layer = {
                hide: () => hideLayer(i),
                show: () => showLayer(i)
            };
            if (config.layers[i].type === LAYER_CARTO) {
                layer.setSQL = sql => setSQL(i, sql)
            }
            return layer;
        });

    // TODO Validate index
    const getLayer = i => getLayers()[i];

    return {
        getLayers,
        getLayer
    };
};

const createBasicLayer = options => {
    return createTileLayer(options.urlTemplate, {
        minZoom: options.minZoom,
        maxZoom: options.maxZoom,
        attribution: options.attribution
    });
};

const createCartoLayer = async config => {
    const layerGroupId = await getGroupId(config);
    const mapsApiConfig = config.maps_api_config;
    const urlTemplate = `http://ashbu.cartocdn.com/${mapsApiConfig.user_name}/api/v1/map/${layerGroupId}/1/{z}/{x}/{y}.png`
    return createTileLayer(urlTemplate);
};

const createTileLayer = (urlTemplate, options = {}) => L.tileLayer(urlTemplate, options);

module.exports = createMap;
