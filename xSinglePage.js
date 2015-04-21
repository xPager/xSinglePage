/*#####################################################################################################################
                                                                                                              
                    PPPPPPPPPPPPPPPPP                                                                              
                    P::::::::::::::::P                                                                             
                    P::::::PPPPPP:::::P                                                                            
                    PP:::::P     P:::::P                                                                           
xxxxxxx      xxxxxxx  P::::P     P:::::Paaaaaaaaaaaaa     ggggggggg   ggggg    eeeeeeeeeeee    rrrrr   rrrrrrrrr   
 x:::::x    x:::::x   P::::P     P:::::Pa::::::::::::a   g:::::::::ggg::::g  ee::::::::::::ee  r::::rrr:::::::::r  
  x:::::x  x:::::x    P::::PPPPPP:::::P aaaaaaaaa:::::a g:::::::::::::::::g e::::::eeeee:::::eer:::::::::::::::::r 
   x:::::xx:::::x     P:::::::::::::PP           a::::ag::::::ggggg::::::gge::::::e     e:::::err::::::rrrrr::::::r
    x::::::::::x      P::::PPPPPPPPP      aaaaaaa:::::ag:::::g     g:::::g e:::::::eeeee::::::e r:::::r     r:::::r
     x::::::::x       P::::P            aa::::::::::::ag:::::g     g:::::g e:::::::::::::::::e  r:::::r     rrrrrrr
     x::::::::x       P::::P           a::::aaaa::::::ag:::::g     g:::::g e::::::eeeeeeeeeee   r:::::r            
    x::::::::::x      P::::P          a::::a    a:::::ag::::::g    g:::::g e:::::::e            r:::::r            
   x:::::xx:::::x   PP::::::PP        a::::a    a:::::ag:::::::ggggg:::::g e::::::::e           r:::::r            
  x:::::x  x:::::x  P::::::::P        a:::::aaaa::::::a g::::::::::::::::g  e::::::::eeeeeeee   r:::::r            
 x:::::x    x:::::x P::::::::P         a::::::::::aa:::a gg::::::::::::::g   ee:::::::::::::e   r:::::r            
xxxxxxx      xxxxxxxPPPPPPPPPP          aaaaaaaaaa  aaaa   gggggggg::::::g     eeeeeeeeeeeeee   rrrrrrr            
                                                                   g:::::g                                         
                                                       gggggg      g:::::g                                         
                                                       g:::::gg   gg:::::g                                         
                                                        g::::::ggg:::::::g                                         
                                                         gg:::::::::::::g                                          
                                                           ggg::::::ggg                                            
                                                              gggggg
															  
© xPager - xSinglePage - Manuel Kleinert - www.xpager.ch - info(at)xpager.ch - v 1.3.4 - 21.04.2015
#####################################################################################################################*/

var xSinglePage = function(options,fx){

    this.options = $.extend({
		topStart:0,
		top:$(window).scrollTop(),
		activeArticle:false,                                                    // Start mit Artikel
        keyControl:true,                                                        // Key Control
        touchControl:true,                                                      // Touch Control
        scrollbar:true,                                                         // Scrollbar Show
		loader:$("#loader"),
		navLinks:$('.navigation ul li a,#mobnav ul li a, .singlepageLink'),
        buttonLeft:$(".xSinglePage .button_left"),
        buttonRight:$(".xSinglePage .button_right"),
        buttonDown:$(".xSinglePage .button_down"),
		navHeightObj:$("header"),
        section:$(".xSinglePage section"),
		article:$(".xSinglePage section article"),
		body:$("html, body"),
        window:$(window),
		fullHeight:true,                                                        // Article min-Height = Monitor Height
        noteScrollNavigation:true,                                              // Beim Scrollen Navigationshöhe beachten
		easing:"easeInOutExpo",                                                 // Animation Type (Jquery UI Easing)
		speed:500,                                                              // Animation Speed
        googleTrackingID:false,                                                 // Google Analytics
        startHash:window.location.hash                                          // First hash Name
	}, options);
    
    for(var name in this.options){eval("this."+name+"=this.options."+name);}
    
    this.activeArticle = this.article.first();
    this.activeSection = this.section.first();
	this.metaTitel = $("title").html();
    
    this.init();
}

xSinglePage.prototype = {
    init:function(){
        var self = this;
        
        this.setSize();
        this.initGoogleAnalytics();
        
        this.activeArticle = this.getArtikelbyId(this.article.first().attr("data-id"));
        this.activeSection = this.getSectionByArtikel(this.activeArticle);
        
        if(this.navHeightObj && this.noteScrollNavigation){
            this.section.first().css("marginTop",this.navHeightObj.height());
        }
        
        this.window.resize(function(){
            self.setSize();
			self.setSectionSize();
        });
        
        this.navLinks.click(function(e){
            e.preventDefault();
            if($(this).attr("data-id") != "undefined"){
                self.activeArticle = self.getArtikelbyId($(this).attr("data-id"));
                self.scrollTo();
            }
        });
        
        this.buttonRight.click(function(){
            self.next();
        });
        
        this.buttonLeft.click(function(){
            self.prev();
        });
        
        this.buttonDown.click(function(){
            self.down(); 
        });
        
        if(this.keyControl){
			$(document).keydown(function(e){
                if (e.keyCode == 38){e.preventDefault(); self.up();}
				if (e.keyCode == 37){e.preventDefault(); self.prev();}
				if (e.keyCode == 39){e.preventDefault(); self.next();}
                if (e.keyCode == 40){e.preventDefault(); self.down();}
			});	
		}
        
       	if(this.touchControl){
			this.touchStart = false;
			this.touchEnd= false;
			$(this.body).bind('touchstart MSPointerDown pointerdown',function(e){
				self.touchStart = false;
				self.touchEnd = 0;
			});
			$(this.body).bind('touchmove MSPointerMove pointermove',function(e){
				if(self.touchStart == false && e.originalEvent.touches){
					self.touchStart = e.originalEvent.touches[0].pageX;
				}
                if(e.originalEvent.touches){
                    self.touchEnd = e.originalEvent.touches[0].pageX;
                }
			});
			$(this.body).bind('touchend MSPointerUp pointerup',function(e){
				var res = self.touchEnd-self.touchStart;
				if(res < 0 && res < -50){self.next();}
				if(res > 0 && res > 50){self.prev();}
				self.touchStart = false;
				self.touchEnd = 0;
			});
		}
        
        
        if(!this.scrollbar){
            this.body.addClass("overflow");
        }
        
        
        this.window.scroll(function(){
            self.top = $(this).scrollTop();
            self.setActiveSection();
            self.setStatus();
			self.setSectionSize();
        });
        
        this.setStatus();
    },
    
    start:function(){
        var self = this;
        setTimeout(function(){
            self.body.stop().scrollTop(0);
            self.loader.fadeOut(500,function(){
                // go to Page (hash)
                if(self.startHash){
                    if(obj=self.getArtikelbyTitel(self.startHash.replace('#', ''))){
                        self.activeArticle = obj;
                        self.scrollTo();
                    }
                }
            });
        },200);
        
    },
    
    scrollTo:function(fx){
        var self = this;
        var obj = this.activeArticle;
        var pos = $(obj).position();
        if(pos){
            var scrollPos = pos.top;
            if(this.noteScrollNavigation){
                scrollPos -= this.navHeightObj.height();
            }
            this.body.stop().animate({scrollTop:scrollPos},this.speed,this.easing,function(){
                var content = $(obj).parent(".slider_content");
                var marginleft = parseInt(content.css("marginLeft"));
                if(marginleft != "NaN"){
                    var left = marginleft - pos.left;
                    if($(obj).parent(".slider_content").length){
                        $(obj).parent(".slider_content").stop().animate({marginLeft:left},self.speed,self.easing,function(){
                            obj.parents("section").attr("data-pos",obj.attr("data-id"));
                            self.setActiveSection();
                            self.setStatus();
    						self.setSectionSize();
                            if(fx){fx();}
                        }); 
                    }else{
                        self.setStatus();
  						self.setSectionSize();
                        if(fx){fx();}
                    }
                }else{
                    if(fx){fx();}
                }
            });
        }
    },
    
    next:function(fx){
        if(this.activeArticle.next().length){
            this.activeArticle = this.activeArticle.next();
            this.scrollTo(fx);
        }
    },
    
    prev:function(fx){
        if(this.activeArticle.prev().length){
            this.activeArticle = this.activeArticle.prev();
            this.scrollTo(fx);
        }
    },
    
    up:function(fx){
         var up = this.activeArticle.parents("section").prev("section");
         if(up.length){
            this.activeArticle = this.getArtikelbyId(up.attr("data-pos"));
            this.scrollTo(fx);
         }
    },
    
    down:function(fx){
        var down = this.activeArticle.parents("section").next("section");
        if(down.length){
            this.activeArticle = this.getArtikelbyId(down.attr("data-pos"));
            this.scrollTo(fx);
        }else{
            this.scrollTop();
        }
    },
    
    scrollTop:function(){
        this.activeArticle = this.article.first();
        this.scrollTo();
    },
    
    setSize:function(fx){
		if(this.fullHeight){
            this.article.css('min-height',this.window.height());
        }
        this.article.width(this.body.width());
        if(!this.detectmob()){
            this.scrollTo(fx);
        }
    },
	
	setSectionSize:function(){
        this.activeSection.css('height',this.activeArticle.height());
    },
    
    getArtikelbyId:function(id){
        return this.section.find("article[data-id='"+id+"']");
    },
    
    getArtikelbyTitel:function(titel){
        return this.section.find("article[data-titel='"+titel+"']");
    },
    
    getSectionByArtikel:function(obj){
        return obj.parents("section");
    },
    
    hasChild:function(){
        if(this.activeSection.find("article").length >1){
            return true;
        }else{
            return false;
        }
    },

    setActiveSection:function(){
        var self = this;
        this.section.each(function(i,obj){
            var pos = $(obj).position();
            
            if($(window).scrollTop()+ $(window).height() < $(document).height()-200){
                if(pos.top < self.top+250 && (pos.top+$(obj).height()) > self.top+250){
                    
                    self.activeArticle = self.getArtikelbyId($(this).attr("data-pos"));
                    self.activeSection = self.getSectionByArtikel(self.activeArticle);
                    
                    var titel = self.activeArticle.attr("data-titel");
                    self.setGoogleAnalyticsTrack(titel);
                    self.setHash(titel);
                }
            }else{
                //Letzter Artikel Aktiv falls zu klein
                self.activeArticle = self.getArtikelbyId($(self.section).last().attr("data-pos"));
                self.activeSection = self.getSectionByArtikel(self.activeArticle);
                
                var titel = self.activeArticle.attr("data-titel");
                self.setGoogleAnalyticsTrack(titel);
                self.setHash(titel);
            }
        });
    },

    setStatus:function(){
        this.navLinks.removeClass("active");
        
        // Nav (aktiv)
        var sectionId = this.activeSection.attr("data-pos");
        
        this.navLinks.parents("li").find("a[data-id='"+sectionId+"']").addClass("active").focus();
        
        var child = this.hasChild();
        
        // Nav Parent (aktiv)
        if(child){
            var articleId = this.activeSection.find("article").first().attr("data-id");
            this.navLinks.parents("li").find("a[data-id='"+articleId+"']").addClass("active").focus();
        }
		
		// Set Meta Title
        if(this.activeArticle.data("meta-titel")){
            $("title").html(this.activeArticle.data("meta-titel"));
        }else{
            $("title").html(this.metaTitel);
        }
        
        // Navigation left right
        if(this.activeArticle.offset()){
            var aktPos = this.top-this.activeArticle.position().top;
            if(aktPos < 300 && aktPos > -300 && child){
                
                if(this.activeArticle.prev().length){
                    this.buttonLeft.stop().fadeIn(500);
                }else{
                    this.buttonLeft.stop().fadeOut(500);
                }
                
                if(this.activeArticle.next().length){
                    this.buttonRight.stop().fadeIn(500);
                }else{
                    this.buttonRight.stop().fadeOut(500);
                }
                
            }else{
                this.buttonLeft.stop().fadeOut(500);
                this.buttonRight.stop().fadeOut(500);
            }
        }
        
        // Navigation down
        if(this.buttonDown.length){
            if(sectionId == this.section.last().attr("data-pos")){
                this.buttonDown.addClass("up");
                this.buttonDown.removeClass("down");
            }else{
                this.buttonDown.removeClass("up");
                this.buttonDown.addClass("down");
            }
        }
    },
    
    initGoogleAnalytics:function(){
        if(this.googleTrackingID){
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
            ga('create',this.googleTrackingID, 'auto');
        }
    },
    
    setGoogleAnalyticsTrack:function(page){
        if(this.googleTrackingID){
            ga('send', 'pageview',page);
        }
    },
    
    setHash:function(t){
        if(typeof(history.pushState) == 'function'){
            if(window.location.hash != "#"+t){
                history.pushState(null, null,"#"+t);
            }
        }
    },

    detectmob:function() { 
        if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
        ){
            return true;
        }else{
            return false;
        }
    },
    
   	// Console (iPad,Mobile,.....)
	message:function(txt){
		if($("#cis_error_message").length){
			var html = "<div class='cis_error_message' style='font-size:10px; text-align:left; line-height: 25px; border-bottom:solid 1px #ddd; padding-left:5px;'><div>";
			$("#cis_error_message_titel").after(html);
			$(".cis_error_message").first().text("- "+txt);
		}else{
			var html = "<div id='cis_error_message' style='position:fixed; top:10px; left:10px; z-index:100000; height:100px; width:250px; border:solid 2px #000; display:none;background-color:#fff; overflow: auto;'>";
			html += "<h3 id='cis_error_message_titel' style='display:block; text-align:center; background-color:#666; color:#fff; font-size:12px; line-height: 25px!important; margin:0px;'>ERROR</h3>";
			html += "<div class='cis_error_message' style='font-size:10px; text-align:left; line-height: 25px; border-bottom:solid 1px #ddd; padding-left:5px;'><div>";
			html += "</div>";			
			$(".imsinglepage").append(html);
			$(".cis_error_message").text("- "+txt);
			$("#cis_error_message").fadeIn(500);
		}
	}
}