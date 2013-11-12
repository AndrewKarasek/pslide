// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "pSlide",
				defaults = {
				type: "fixed",
				fixedNav: true,
				duration: 1000,
				nav: true,
				animation: "shift",
				delay: 4000,
				auto: true,
		};

		// The actual plugin constructor
		function Plugin ( element, options ) {
				//console.log(this);
				//console.log(element);
				
	
				
				elements = this;
				elements.initimg = [];
				elements.amount = 1;
				elements.main = element;
				elements.offset = 0;
				elements.offsetter = 0;
				elements.shifted = 0;
				elements.nav = [];
				elements.navlinks = [];
				elements.initslide = [];
				this.shifted = 0;
				this.element = element;				
				this.settings = $.extend( {}, defaults, options );
				elements.settings = this.settings;
					this._name = pluginName;this._defaults = defaults;
			
				this.init();

				elements.casing = $(elements.main).find(".pslide-casing");
				elements.spyglass = $(elements.main).find(".pslide-spyglass");
				elements.slides = $(elements.main).find(".pslide-slide");

				if(this.settings.nav){
					this.addnav();
				}

				this.sizeup();



				//$(window).resize(this.sizeup);
				//this.pshift();
				//$(elements.navlinks).click({ para: "stuff" },this.panimate);
		}



		Plugin.prototype = {
				init: function () {
						elements.initimg = $(this.element).find(">:first-child");											
						elements.initimg.wrap("<div class='pslide-casing'>");
						elements.initimg.wrap("<div class='pslide-slide'>");
						elements.initslide = elements.initimg.parent();
						var casing = $(this.element).find(">:first-child");
						casing.wrap("<div id='pslide-spyglass' class='pslide-spyglass' style='position: relative;'>");
						casing.css("position", "absolute").css("top", "0").css("left", "0");
						var slides = elements.initimg.data("slide").split(" ");

						elements.amount += slides.length;
						for(var i = 0; i < slides.length; i++){
							casing.append('<div class="pslide-slide"><img src="'+ slides[i] +'" /></div>');		
						}
						$(".pslide-slide").css("float", "left");		

						$(this.element).find(">:first-child").css("overflow", "hidden");

						var myslides = casing.find(".pslide-slide");

						
				},

				addnav: function () {
					elements.spyglass.prepend("<div class='pslide-nav'></div>");
					elements.nav = $(elements.main).find(".pslide-nav");
					elements.nav.append("<a href='#prev' class='pslide-link pslide-link-prev'>Prev</a>");
					elements.nav.append("<a href='#next' class='pslide-link pslide-link-next'>Next</a>");
					elements.nav.css("position", "absolute").css("z-index", "1000000").css("width", "100%");
					elements.navlinks = elements.nav.find("a");
					//console.log(elements.navlinks);
				},


				sizeup: function () {
					var slider = $(this.element);
					var settings = this.settings;
					
					var indexlink = [];
					var casing = slider.find(".pslide-casing");
					var slides = casing.find(".pslide-slide");
					var ob = [];
					ob.amount = 0;
					ob.offset = 0;
					ob.offsetter = 0;
					//console.log(settings);
					ob.pos = 0;
					ob.timeout = [];

					if(this.settings.animation === "fade"){
							var x = 100; //replace with no of slides
							slides.each(function(i){
								x--;
								$(this).css("position", "absolute").css("top", "0").css("left", "0").css("z-index", x);
							});			
					}


					function indexNav(){
						var nav = slider.find(".pslide-nav");
						nav.append("<div class='pslide-indexnav'></div>");
						var indexNav = nav.find(".pslide-indexnav");

						//console.log("pre");
						//console.log(ob.amount);
						for(var i=1; i<ob.amount+1; i++){
							
							indexNav.append("<a href='#"+i+"' class='pslide-indexlink'>"+i+"</a>");
						}
						//console.log("post");
						indexlink = indexNav.find(".pslide-indexlink");
					}

	

					function size(){
						var spyglass = slider.find(".pslide-spyglass");
						var slides = slider.find(".pslide-slide");
						
						ob.offsetter = slider.width();
						ob.amount = slides.length;
						

						//console.log(slider);

						casing.css("width", ob.offsetter*ob.amount);
						if(settings.animation === "shift"){
							casing.css("width", ob.offsetter*ob.amount);
						} else if(settings.animation === "slide"){
							casing.css("width", ob.offsetter*2);
						} else if(settings.animation === "fade"){
							casing.css("width", ob.offsetter);
						}
						
						slides.each(function(){
							$(this).css("width", ob.offsetter);
						});

						var height = casing.find(">:first-child").height();
						spyglass.css("height", height);


						if(settings.animation === "shift"){ //keep shifter in place
							ob.offset = ob.offsetter * ob.pos;							
							casing.css("left", -ob.offset);
						} else if(settings.animation === "slide"){ //keep slider in place
							var temp = (ob.amount - ob.pos) -1;

							//console.log(temp);  
							for(var i=ob.pos+1; i<ob.amount; i++){
								casing.children().eq(i).css("left", ob.offsetter);
							}
						}
					}

					size();

					if(settings.fixedNav && settings.nav){
						indexNav();
					}

					var click = slider.find("a");

					//slide setup
					if(this.settings.animation === "slide"){
						//console.log("its slide");
							slides.each(function(i){
								//console.log(ob.offsetter);
								$(this).css("position", "absolute").css("left", ob.offsetter);
							});		
							casing.find(">:first-child").css("left", "0");
					}



					function pshift(href, casing){
						
						var shref = href.replace("#", "");
					
							if(shref === "next"){
								ob.pos++;
							} else if(shref === "prev"){	
								ob.pos--;
							} else if(shref == parseInt(shref)){
								shref = shref-1;
								ob.pos = parseInt(shref);
							}

						ob.offset = ob.offsetter * ob.pos;
						casing.animate({left: -ob.offset}, settings.duration, function(){
							slider.trigger("userSlideComplete");
						});
					
					}

					function complex(href, casing){
						var shref = href.replace("#", "");
						var sa = settings.animation;
 						var slides = casing.children();
 						var dt = 150;

 						function pSlideIn(ind){
 							slides.eq(ind).animate({ left: 0}, settings.duration, function(){
 								slider.trigger("userSlideComplete");
 							});
 						}
 						function pSlideOut(ind){
 							slides.eq(ind).animate({ left: ob.offsetter}, settings.duration, function(){
 								slider.trigger("userSlideComplete");
 							});
 						}
 						function pFadeIn(ind){
 							slides.eq(ind).animate({ opacity: 1}, settings.duration, function(){
 								slider.trigger("userSlideComplete");
 							});
 						}
 						function pFadeOut(ind){
 							slides.eq(ind).animate({ opacity: 0}, settings.duration, function(){
 								slider.trigger("userSlideComplete");
 							});
 						}

						if(shref === "next"){
							if(sa === "slide"){ //SLIDE
								
								pSlideIn(ob.pos+1);
							}
							else if(sa === "fade"){ //FADE
						
								pFadeOut(ob.pos);
							}
							ob.pos++;
						} 

						else if(shref === "prev"){
							if(sa === "slide"){ //SLIDE
								pSlideOut(ob.pos);
							}
							else if(sa === "fade"){ //FADE
								pFadeIn(ob.pos-1);
							}
							ob.pos--;
						} 


						else if(shref == parseInt(shref)){

							//console.log(shref);
							shref = parseInt(shref)-1; //adjust href to give actual indx rather then apparant
							//console.log("pos: " + ob.pos + "  ref: " + shref);

							if(ob.pos < shref){  //if pos is pre nav to
								//console.log("lesser" + ob.pos + "  ref: " + shref);
								for(var i=ob.pos; i<shref; i++){
									setTimeout((function(loc_i){
										return function(){
											if(sa === "slide"){ //SLIDE	
												pSlideIn(loc_i+1);
											}
											else if(sa === "fade"){ //FADE
												pFadeOut(loc_i);
											}	
										};
									})(i), i*dt);
								}
							} 
							else if(ob.pos > shref){ //if pos is post nav to
								
								var x = -1;
								for(var i=ob.pos; i>shref; i--){
									x++;
									console.log(i);
									setTimeout((function(loc_i){
										
										return function(){
											if(sa === "slide"){
												pSlideOut(loc_i);
											}
											else if(sa ==="fade"){
												pFadeIn(loc_i-1);
											}
										};
									})(i), x*dt);
								}
								
							}
							ob.pos = parseInt(shref);
						} //close int picker
					}

					
					click.click(function(e){
						
						var href = $(this).attr("href");
						if(href === "#prev" && ob.pos === 0){console.log("first"); return false; }
						if(href === "#next" && ob.pos+1 === ob.amount){console.log("last"); return false; }

						slider.trigger("beforeSlide");
						switch(settings.animation){
							case "shift":
							pshift(href, casing);	
							break;

							case "slide":
							complex(href, casing);
							break;

							case "fade":
							complex(href, casing);
							break;
						}
						
						slider.trigger('afterSlide');
						console.log("APPARANT INDEX IS NOW: " + (ob.pos+1) +"\nREAL INDEX IS: "+ob.pos);
						
						e.preventDefault();
						return false;
					});

					slider.on('afterSlide', function(){
						console.log("after");
						activeCheck();
					});

					slider.on('beforeSlide', function(){
						pclearTimeout();
						console.log("before");
					});

					slider.on('userSlideComplete', function(){
						console.log("slidecomplete");


						autoTrig();
					});

					$(window).resize(size);

					function activeCheck(){
						var active = slider.find(".pslide-activelink");
						active.removeClass("pslide-activelink");
						var indexnav = slider.find(".pslide-indexnav");
						indexnav.children().eq(ob.pos).addClass("pslide-activelink");
					}
					activeCheck();

					function endCheck(href){
						
					}

					function autoTrig(){
						if(settings.auto){
							ob.timeout = setTimeout(function(){
								slider.find(".pslide-link-next").trigger("click");
							}, settings.delay);
						}
					}

					autoTrig();
					function pclearTimeout(){
						if(settings.auto){
							clearTimeout(ob.timeout);
							console.log("timoeout cleared");
						}
					}

					
		
				},

				

		};


		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});
		};

})( jQuery, window, document );
