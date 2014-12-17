/*
Single Page
@ Manuel Kleinert
Version 1.2.4
*/

var singlePage = function(options,fx){

    this.options = $.extend({
		topStart:0,
		top:$(window).scrollTop(),
		activeArticle:false,
        keyControl:true,
        touchControl:true, // Touch Control
		loader:$("#iMLoader"),
		navLinks:$('.iMNavigation ul li a,#mobnav ul li a,.singlepagelink'),
        buttonLeft:$(".imsinglepage .button_left"),
        buttonRight:$(".imsinglepage .button_right"),
		navHeight:$(".iMNavigation").height(),
        section:$(".imsinglepage section"),
		article:$(".imsinglepage section article"),
		body:$("html, body"),
        window:$(window),
		easing:"easeInOutExpo",
		speed:500,
        googleTrackingID:false,
        startHash:window.location.hash
	}, options);
    
    for(var name in this.options){eval("this."+name+"=this.options."+name);}
    
    this.activeArticle = this.article.first();
    
    this.init();
}

singlePage.prototype = {
    init:function(){
        var self = this;
        
        this.setSize();
        this.initGoogleAnalytics();
        
        this.activeArticle = this.getArtikelbyId(this.article.first().attr("data-id"));
        
        this.window.resize(function(){
            self.setSize();
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
				if(self.touchStart == false){
					self.touchStart = e.originalEvent.touches[0].pageX;
				}
				self.touchEnd = e.originalEvent.touches[0].pageX;
			});
			$(this.body).bind('touchend MSPointerUp pointerup',function(e){
				var res = self.touchEnd-self.touchStart;
				if(res < 0 && res < -50){self.next();}
				if(res > 0 && res > 50){self.prev();}
				self.touchStart = false;
				self.touchEnd = 0;
			});
		}
        
        this.window.scroll(function(){
            self.top = $(this).scrollTop();
            self.setActiveSection();
            self.setStatus();
        });
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
            this.body.stop().animate({scrollTop:pos.top-this.navHeight},this.speed,this.easing,function(){
                var content = $(obj).parent(".slider_content");
                var marginleft = parseInt(content.css("marginLeft"));
                if(marginleft != "NaN"){
                    var left = marginleft - pos.left;
                    $(obj).parent(".slider_content").stop().animate({marginLeft:left},self.speed,self.easing,function(){
                        obj.parents("section").attr("data-pos",obj.attr("data-id"));
                        self.setActiveSection();
                        self.setStatus();
                        if(fx){fx();}
                    });
                }
            });
        }
    },
    
    next:function(){
        if(this.activeArticle.next().length){
            this.activeArticle = this.activeArticle.next();
            this.scrollTo();
        }
    },
    
    prev:function(){
        if(this.activeArticle.prev().length){
            this.activeArticle = this.activeArticle.prev();
            this.scrollTo();
        }
    },
    
    up:function(){
         var up = this.activeArticle.parents("section").prev("section");
         if(up.length){
            this.activeArticle = this.getArtikelbyId(up.attr("data-pos"));
            this.scrollTo();
         }
    },
    
    down:function(){
        var down = this.activeArticle.parents("section").next("section");
         if(down.length){
            this.activeArticle = this.getArtikelbyId(down.attr("data-pos"));
            this.scrollTo();
         }
    },
    
    setSize:function(fx){
        this.article.width(this.body.width());
        this.scrollTo(fx);
    },
    
    getArtikelbyId:function(id){
        return $(".imsinglepage section article[data-id='"+id+"']");
    },
    
    getArtikelbyTitel:function(titel){
        return $(".imsinglepage section article[data-titel='"+titel+"']");
    },
    
    setActiveSection:function(){
        var self = this;
        this.section.each(function(i,obj){
            var pos = $(obj).position();
            
            if($(window).scrollTop()+ $(window).height() < $(document).height()-200){
                if(pos.top < self.top+250 && (pos.top+$(obj).height()) > self.top+250){
                    self.activeArticle = self.getArtikelbyId($(this).attr("data-pos"));
                    var titel = self.activeArticle.attr("data-titel");
                    self.setGoogleAnalyticsTrack(titel);
                    self.setHash(titel);
                }
            }else{
                //Letzter Artikel Aktiv falls zu klein
                self.activeArticle = self.getArtikelbyId($(self.section).last().attr("data-pos"));
                var titel = self.activeArticle.attr("data-titel");
                self.setGoogleAnalyticsTrack(titel);
                self.setHash(titel);
            }
        });
    },
    
    setStatus:function(){
        this.navLinks.removeClass("active");
        
        // Nav (aktiv)
        var id = this.activeArticle.parents("section").attr("data-pos");
        $(".iMNavigation ul li a[data-id='"+id+"'],#mobnav ul li a[data-id='"+id+"']").addClass("active");
        
        // Nav Parent (aktiv)
        if(this.activeArticle.parents("section").attr("data-haschild")){
            var id = this.activeArticle.attr("data-parent-id");
            $(".iMNavigation ul li a[data-id='"+id+"'],#mobnav ul li a[data-id='"+id+"']").addClass("active");
        }
        
        
        // Navigation left right
        if(this.activeArticle.offset()){
            var aktPos = this.top-this.activeArticle.position().top;
            var hasChild = this.activeArticle.parents("section").attr("data-haschild");
            if(aktPos < 300 && aktPos > -300 && hasChild){
                
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