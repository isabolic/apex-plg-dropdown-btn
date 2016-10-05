Oracle apex plugins for dropDownButton
- install:
- compile packages AX_PLG_DROP_DOWN in you apex parsing schema
- run install sql scripts for apex dynamic_action_plugin_drop_down_button.sql
- then in shared components plugins upload js&css files (or on apache host folder) don't forget the handlebars.js (libs dir.)
- remove in plugins file url calls 
   (etc.. http://playground/ws/....) 
    this is development environment 

- example => https://apex.oracle.com/pls/apex/f?p=101959:3
   

