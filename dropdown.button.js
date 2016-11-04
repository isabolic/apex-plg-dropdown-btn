/**
 * [created by isabolic sabolic.ivan@gmail.com]
 */

// workspace
(function(){
   if(window.apex.plugins === undefined){
      window.apex.plugins = {};
   }
}());


(function($, x) {
    var options = {
        $eleBtn          : null,
        eleBtnSelector   : null,
        config           : null,
        menuAlgn         : "LEFT",
        menuWidthAsBtn   : "Y",
        closeMenuBlur    : "Y",
        slideUpDown      : 200,
        htmlTemplate     : {
            buttonWrapper : "<div class='btn-group'>",
            devider       : "<li role='separator' class='divider'></li>",
            List          :  "<ul class='dropdown-menu'>" +
                                "{{#each list}}" +
                                " <li class='dropdown-menu-item' title='{{text}}'><a href='{{value}}'>{{text}}</a></li>" +
                                "{{/each}}" +
                            "</ul>",
            icon           : "<span class='t-Icon fa {{btnIcon}}' aria-hidden='true'></span>"
        }
    };

    /**
     * [xDebug - PRIVATE function for debug]
     * @param  string   functionName  caller function
     * @param  array    params        caller arguments
     */
    var xDebug = function(functionName, params){
        x.debug(this.jsName || " - " || functionName, params, this);
    };

    /**
     * [triggerEvent     - PRIVATE handler fn - trigger apex events]
     * @param String evt - apex event name to trigger
     */
    var triggerEvent = function(evt, evtData) {
        xDebug.call(this, arguments.callee.name, arguments);
        this.container.trigger(evt, [evtData]);
        $(this).trigger(evt + "." + this.apexname, [evtData]);
    };

    /**
     * [replaceLink - PRIVATE fn -  replace invalid link value with javascript:void(0)]
     */
    var replaceLink = function(){
        this.options.config.list =
        $.map(this.options.config.list, function(item){
            if (!item.value){
                item.value = "javascript:void(0)";
            }
            return item;
        })
    };

    /**
     * [itemClick - PRIVATE fn handler - trigger event "dropdownbutton-menu-item-click" when <li> is clicked]
     */
    var itemClick = function(evt, $el){
        triggerEvent.apply(this, [evt,  $el]);

        if (this.options.closeMenuBlur === "Y"){
            this.showHide.call(this, "hide");
        }

    };

    var applyBtnStyle = function (){
        if (this.options.$eleBtn.hasClass("t-Button--primary")){
            this.options.$listEl.addClass("t-Button--primary");
        }else if(this.options.$eleBtn.hasClass("t-Button--warning")){
            this.options.$listEl.addClass("t-Button--warning");
        }else if(this.options.$eleBtn.hasClass("t-Button--danger")){
            this.options.$listEl.addClass("t-Button--danger");
        }else if(this.options.$eleBtn.hasClass("t-Button--success")){
            this.options.$listEl.addClass("t-Button--success");
        }else{
            this.options.$listEl.addClass("normal");
        }

    };

    apex.plugins.dropDownButton = function(opts) {
        this.apexname = "DROP_DOWN_BUTTON";
        this.jsName = "apex.plugins.dropDownButton";
        this.container = null;
        this.options = {};
        this.events = ["dropdownbutton-menu-show",
                       "dropdownbutton-menu-hide",
                       "dropdownbutton-menu-item-click"];
        this.init = function() {

            xDebug.call(this, arguments.callee.name, arguments);

            var listTemplate, iconTemplate;

            if (window.Handlebars === undefined){
                throw this.jsName || ": requires handlebars.js (http://handlebarsjs.com/)";
            }

            if ($.isPlainObject(opts)) {
                this.options = $.extend(true, {}, this.options, options, opts);
            } else {
                throw this.jsName || ": Invalid options passed.";
            }

            this.options.$eleBtn = $(this.options.eleBtnSelector);

            if (this.options.$eleBtn === null) {
                throw this.jsName || ": Element button is required.";
            }

            // compile tempate
            this.options.config = $.parseJSON(this.options.config);
            replaceLink.call(this);

            listTemplate = Handlebars.compile(this.options.htmlTemplate.List);
            listTemplate = listTemplate(this.options.config);

            iconTemplate = Handlebars.compile(this.options.htmlTemplate.icon);
            iconTemplate = iconTemplate(this.options.config);

            if(this.options.$eleBtn.find(".t-Button-label").length > 0){
                this.options.$eleBtn.find(".t-Button-label").before(iconTemplate);
            }else{
                this.options.$eleBtn.append(iconTemplate);
            }

            this.container = this.options.$eleBtn.wrap(this.options.htmlTemplate.buttonWrapper).parent();
            this.container.append(listTemplate);
            this.options.$eleBtn.addClass("dropdown-menu-btn");
            this.options.$listEl = this.container.find("ul.dropdown-menu");

            if(this.options.menuAlgn === "RIGHT"){
                this.options.$listEl.addClass("right");
            }

            if(this.options.menuWidthAsBtn === "Y"){
                this.options.$listEl.addClass("w100pc");
            }

            applyBtnStyle.apply(this);

            this.options.$eleBtn.on("click", this.showHide.bind(this));

            this.options
                .$listEl
                .on("click", ".dropdown-menu-item", itemClick.bind(this, this.events[2]));

            if (this.options.closeMenuBlur === "Y"){
                this.options.$eleBtn.on("blur", this.showHide.bind(this, "hide"));
            }

            return this;
        }

        return this.init();
    };

    apex.plugins.dropDownButton.prototype = {
        showHide:function showHide(action, evt){
            //xDebug.call(this, arguments.callee.name, arguments);
            // if element in the list is clicked (button losses focus)
            if ($.isPlainObject(evt) &&
                $(evt.relatedTarget).parent().hasClass("dropdown-menu-item")){
                return;
            }

            if($.type(action) !== "string"){
                action = this.options.$listEl.is(":visible") ? "hide" : "show";
            }

            if(action === "show"){
                this.options.$listEl.slideDown(this.options.slideUpDown);
                triggerEvent.apply(this, [this.events[0], this]);
            }else if(action === "hide"){
                this.options.$listEl.slideUp(this.options.slideUpDown);
                triggerEvent.apply(this, [this.events[1], this]);
            }
        }
    };

})(apex.jQuery, apex);