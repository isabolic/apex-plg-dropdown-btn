Oracle apex plugins for dropDownButton
- install:
- compile packages AX_PLG_DROP_DOWN
- run install sql scripts for apex dynamic_action_plugin_drop_down_button.sql
- then in shared components plugins upload js&css files (or on apache host folder)
- on your desired page set mapboxRegion (don't forget to set mapbox region template..)
- remove in plugins file url calls 
   (etc.. http://playground/ws/mapbox.map.css and http://playground/ws/mapbox.map.js) 
    this is development environment 

- example => https://apex.oracle.com/pls/apex/f?p=101959:2
   

