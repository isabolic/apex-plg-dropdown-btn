Oracle apex plugins for dropDownButton
- install:
- compile packages AX_PLG_DROP_DOWN
- run install sql scripts for apex dynamic_action_plugin_drop_down_button.sql
- then in shared components plugins upload js&css files (or on apache host folder)
- on your desired page set mapboxRegion (don't forget to set mapbox region template..)
- remove in plugins file url calls 
   (etc.. http://playground/ws/mapbox.map.css and http://playground/ws/mapbox.map.js) 
    this is development environment 

DOCS:
mapBoxIncludeAPI:
   - "API key"    : mapbox API key 

mapboxRegion (Region plugin)
   -requires: mapBoxIncludeAPI
   - access in js console: apex.plugins.mapbox.map
   - Attributes:
     - "Map name"   : name of mapbox map
     - "Width"      : map width   (px, auto.. css value)
     - "Height"     : map height  (px, auto.. css value)
     - "initalView" : json object for inital position - {x:45.793533,y:16.004514,zoomLevel:9}
   - Events:
     - mapBoxMap change zoomLevel [mapBoxRegion] - after current zoom level chnage
     - mapBoxMap change bbox [mapBoxRegion]      - after current bbox change 
     - mapBoxMap maximize region [mapBoxRegion]  - after region (map) maximize/ return to previous height/width
   - api method:
     - zoomTo     - zoom to spec. postion on map (params: x,y,zoomlevel)
     - setBounds  - zoom to spec. bounds (bbox, zoomLevel)
     - setGeoJSON - load geojson geometry and properties to mapBoxRegion (geoJson, zoomTo)
   - example => https://apex.oracle.com/pls/apex/f?p=101959:2

MapBoxZoomToAdapter (Dynamic action plugin)
   - requires: mapboxRegion
   - Attributes:
     - "map region static ID" : static ID of the region
     - "ZoomLevel apex item"  :  apex item which then is set value of current zoomLevel
   - example => https://apex.oracle.com/pls/apex/f?p=101959:4


MapBoxLoadGeometryAdapter (Dynamic action plugin)
   - requires: mapboxRegion, ORA2GEOJSON.pks, ORA2GEOJSON.pkb
   - Attributes:
     - "map region static ID"          :  static ID of the region
     - "apex item with GEOJSON value"  :  apex item which is stored geoJson value
     - "Geometry style JSON object:"   :  json config how geometry is visualized on map... example (
                                            {
                                            "fill"           : "#B10001",
                                             "fill-opacity"  : 0.2,
                                             "stroke"        : "#4c89e4",
                                             "stroke-opacity": 1,
                                             "stroke-width"  : 2}) see mapbox docs for more info.
     - "Zoom to geometry"              : when geometry is loaded in mapBoxRegion should user zoom to geometry
   - example => https://apex.oracle.com/pls/apex/f?p=101959:6


CL:
- mapboxRegion:
   - supported maximize region - template option
   - event "mapBoxMap maximize region [mapBoxRegion]
   - new methods: setBounds, setGeoJSON

   

