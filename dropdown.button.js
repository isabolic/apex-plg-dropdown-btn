/**
 * [created by isabolic sabolic.ivan@gmail.com]
 */

// namespace
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
        offsetItemWidth  : 5,
        htmlTemplate     : {
            buttonWrapper : "<div class='btn-dropdown-menu' tabindex='-1'>",
            devider       : "<li role='separator' class='divider'></li>",
            List          :  "<ul class='dropdown-menu'>" +
                                "{{#each list}}" +
                                  "<li class='dropdown-menu-item' title='{{text}}'>" +
                                       "<span class='menu-icon'>" +
                                         "{{#if icon}}" +
                                         "<i class='fa  fa-fw {{icon}}' aria-hidden='true'></i>" +
                                         "{{/if}}" +
                                       "</span>" +
                                    "<span class='menu-item'><a href='{{value}}'>{{text}}</a></span>" +
                                  "</li>" +
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
        this.options.$eleBtn.trigger(evt, [evtData]);
        $(this).trigger(evt + "." + this.apexname, [evtData]);
    };

    /**
     * [replaceLink - PRIVATE fn -  replace invalid link value with javascript:void(0)]
     */
    var replaceLink = function(){
        xDebug.call(this, arguments.callee.name, arguments);

        this.options.config.list =
        $.map(this.options.config.list, function(item){
            if (!item.value){
                item.value = "javascript:void(0)";
            }
            return item;
        })
    };

    /**
     * [calculatePosition Private set position of container for dropdown after the element is visible]
     */
    var calculatePosition = function(){
      var ele   = this.options.$eleBtn,
          left  = ele.offset().left,
          right = $(document).width() - (ele.offset().left + ele.outerWidth()),
          top   = ele.offset().top + ele.outerHeight(true),
          width = ele.outerWidth(),
          style = {"top": top};

      xDebug.call(this, arguments.callee.name, arguments);

      if (ele.is(":visible") === true) {


        if (this.options.menuAlgn === "RIGHT"){
            style = $.extend(style, {"right": right});
        }else{
            style = $.extend(style, {"left": left});
        }

        if(this.options.menuWidthAsBtn === "Y"){
            style = $.extend(style,{"width": width});
        }

        this.container.css(style);
        this.isRendered = true;
      }
    }

    /**
     * [itemClick - PRIVATE fn handler - trigger event "dropdownbutton-menu-item-click" when <li> is clicked]
     */
    var itemClick = function(evt, $el){
        xDebug.call(this, arguments.callee.name, arguments);

        triggerEvent.apply(this, [evt,  $el]);

        if ($($el.target).prop("tagName") !== "A" && $($el.currentTarget).find("a").length > 0){
            window.location.href = $($el.currentTarget).find("a").attr("href");
        }
    };

    /**
     * [intervalFlag call passed function repeatedly "fnIntervat", stop only when flagForClear is set to true ]
     * @param  {[type]} fnIntervat   [function for repeatedly call]
     * @param  {[type]} flagForClear [key prop. on this scope]
     * @param  {[type]} timer        [timer, def. 200]
     */
    var intervalFlag = function (fnIntervat, flagForClear, timer){
      var interval;

      xDebug.call(this, arguments.callee.name, arguments);

      interval = setInterval(function(){
                    fnIntervat.call(this);

                    if (this[flagForClear]){
                      clearInterval(interval);
                    }
                  }.bind(this), (timer || 200));
    }

    /**
     * [applyBtnStyle PRIVATE apply button universal theme class on menu]
     */
    var applyBtnStyle = function (){
        var bgColor;
        xDebug.call(this, arguments.callee.name, arguments);

        if (this.options.$eleBtn.hasClass("t-Button--primary")){
            this.container.addClass("t-Button--primary");
            bgColor = this.container.css("background-color");
        }else if(this.options.$eleBtn.hasClass("t-Button--warning")){
            this.container.addClass("t-Button--warning");
            bgColor = this.container.css("background-color");
        }else if(this.options.$eleBtn.hasClass("t-Button--danger")){
            this.container.addClass("t-Button--danger");
            bgColor = this.container.css("background-color");
        }else if(this.options.$eleBtn.hasClass("t-Button--success")){
            this.container.addClass("t-Button--success");
            bgColor = this.container.css("background-color");
        }else{
            this.container.addClass("normal");
        }

        if (bgColor !== undefined){

          this.container.css("background-color",bgColor);

          this.container.hover(function() {
            this.container.css("background-color",bgColor);
            this.container.css("box-shadow", "none");
          }.bind(this));
        }
    };

    var menuItemWidth = function(){
        xDebug.call(this, arguments.callee.name, arguments);

        var buttonW = this.options.$eleBtn.outerWidth();

        $.map(this.container.find(".dropdown-menu-item"), function(el){
          if( $(el).find(".menu-icon").length > 0 ){
            var mWidth =  buttonW - $(el).find(".menu-icon").outerWidth() -
                          (  $(el).find(".menu-item").outerWidth() -
                             $(el).find(".menu-item").width()
                          ) - this.options.offsetItemWidth;

            $(el).find(".menu-item").width(mWidth);
          }
        }.bind(this));
        this.container.css("color","");
        this.isSetMenuItemWidth = true;
    };

    apex.plugins.dropDownButton = function(opts) {
        this.apexname = "DROP_DOWN_BUTTON";
        this.jsName = "apex.plugins.dropDownButton";
        this.container = null;
        this.options = {};
        this.isRendered = false;
        this.isSetMenuItemWidth = false;
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

            if (this.options.$eleBtn.length === 0) {
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

            this.container =  $(this.options.htmlTemplate.buttonWrapper);
            $("body").append(this.container);
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
                .on("mousedown", ".dropdown-menu-item", itemClick.bind(this, this.events[2]));

            if (this.options.closeMenuBlur === "Y"){
                  this
                    .container
                    .on("blur", this.showHide.bind(this, "hide"));
            }

            intervalFlag.call(
              this, calculatePosition, "isRendered"
            );

            // reg. resize event
            $(window).resize(function(){

              this.isRendered = false;
              this.isSetMenuItemWidth = false;

              intervalFlag.call(
                  this, calculatePosition, "isRendered", 500
              );

            }.bind(this));

            this.options.$eleBtn.data("dropDownButton", this);

            return this;
        }

        return this.init();
    };

    apex.plugins.dropDownButton.prototype = {
        showHide:function showHide(action, evt){
            xDebug.call(this, arguments.callee.name, arguments);
            // if element in the list is clicked (button losses focus)
            if ($.isPlainObject(evt) &&
                $(evt.relatedTarget).parent().hasClass("dropdown-menu-item")){
                return;
            }

            if($.type(action) !== "string"){
                action = this.options.$listEl.is(":visible") ? "hide" : "show";
            }

            calculatePosition.call(this);

            if(action === "show" && this.container.is(':visible') === false){
                this.isRendered = false;
                intervalFlag.call(
                    this, calculatePosition, "isRendered", 500
                );

                if(this.options.menuWidthAsBtn === "Y" && this.isSetMenuItemWidth === false){
                  this.container.css("cssText","color:transparent !important;");
                }

                this.container.slideDown(this.options.slideUpDown);
                this.container.focus();

                if(this.options.menuWidthAsBtn === "Y" && this.isSetMenuItemWidth === false){
                  intervalFlag.call(
                    this, menuItemWidth, "isSetMenuItemWidth", 500
                  );
                }
                triggerEvent.apply(this, [this.events[0], this]);
            }else if(action === "hide" && this.container.is(':visible') === true){
                this.container.slideUp(this.options.slideUpDown);
                triggerEvent.apply(this, [this.events[1], this]);
            }
        },

        offsetItemWidth: function(width, triggerRecalc){
          xDebug.call(this, arguments.callee.name, arguments);

          if(width !== undefined){
            this.options.offsetItemWidth = width;
          }

          if (triggerRecalc === true){
              this.isSetMenuItemWidth = false;

              intervalFlag.call(
                  this, menuItemWidth, "isSetMenuItemWidth", 500
              );
          }

          return this.options.offsetItemWidth;
        }
    };

})(apex.jQuery, apex);