# carto-challenge-mini-lib

Carto coding challenge - Mini Carto library as described in <https://gist.github.com/jimartincorral/d936859eaa09db025b9b7e89176a8ffb>

Find an example web using this library in:
<https://github.com/hugo-cardenas/carto-challenge-mini-web>

## Install 
```console
$ npm install https://git@github.com/hugo-cardenas/carto-challenge-mini-lib.git
```
## Usage

Define your map container element in HTML:

```html
<div id="map"></div>
```

Create the map:

```javascript
const createMap = require('mini-carto-lib');

const config = {
    // Config object
};

createMap('map', config);
```

It returns a Promise which resolves with a map object, which you can use to modify the rendered map:

```javascript
createMap('map', config)
.then(map => {
    const layers = map.getLayers();
    layers[0].hide();
    layers[0].show();
    layers[1].setSQL('SELECT * FROM foo LIMIT 10');
});
```

## API

### createMap(id, config)

Render the map specified by `config` into the DOM element identified by `id`.

The config spec is found [here](https://gist.github.com/jimartincorral/d936859eaa09db025b9b7e89176a8ffb#goal-1---render-the-map).

Returns a Promise which resolves with a `map` object.

### map.getLayers()

Return an array of map layer objects.

### layer.hide()

Hide this layer in the map.

### layer.show()

Show this layer in the map.

### layer.setSQL(sql)

Update the SQL code for this specific layer.

Note: only Carto layers will contain this method.
