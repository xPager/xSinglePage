xSinglePage
===========
Easy Singlepage script
[Singlepage - Webseite]

## Installation

Download and include `xSinglePage.js` and `xSinglePage.css`  in your document after including jQuery, Bootstrap and Fontawesome.

```html
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js"></script>
<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
<script type="text/javascript" src="xSinglePage.js"></script>

<link type="text/css" rel="stylesheet" media="screen" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css" />
<link type="text/css" rel="stylesheet" media="screen" href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" />
<link type="text/css" rel="stylesheet" media="screen" href="xSinglePage.css" />
```

## Usage Javascript

```javascript
var s;
$(document).ready(function(){
  s = new xSinglePage();
});

$(window).load(function(){
  s.start();
});
```

## Usage Navigation
``` html
<!-- Loader -->
<div id="loader">
    <i class="fa fa-cog fa-spin"></i>
</div>

<!-- Navi -->
<div class="button_left singlenav">
  <i class="fa fa-angle-left"></i>
</div>
<div class="button_right singlenav">
  <i class="fa fa-angle-right"></i>
</div>

<header class="navigation">
  <div class="container">
      <div class="row">            
          <div class="col-xs-12">
              <ul>
                  <li class="hauptnav">
                      <a href="#home" data-id="0"  class="item-link hauptnav">
                          Home
                      </a>
                  </li>
                  <li class="hauptnav">
                      <a href="#test1" data-id="1"  class="item-link hauptnav">
                          Test 1
                      </a>
                      <ul>
                          <li>
                              <a href="#test1_1" data-id="11"  class="item-link">
                                  Test 1.1
                              </a>
                          </li>
                      </ul>
                  </li>   
              </ul>
          </div>
      </div>
  </div>
</header>
```
## Usage Pages
``` html
<!-- Page -->
<section id="#home" data-pos="0">
    <article class="main" data-id="0" data-titel="home" data-meta-titel="Home">
        Home <br />
        test
    </article>
</section>
<section id="#test1" data-pos="1">
    <div class="slider_content">
        <article class="main" data-id="1" data-titel="test1"  data-meta-titel="Test 1">
            Test 1
        </article>
        <article data-id="11" data-titel="test1_1"  data-meta-titel="Test 1.1">
            Test 1.1
        </article>
    </div>
</section>
```
## Options

Options can be passed in via data attributes of JavaScript.

``` js
var s;
$(document).ready(function(){
  s = new xSinglePage({
    touchControl:false,
    fullHeight:false
  });
});
```

<table class="table table-bordered table-striped">
	<thead>
		<tr>
			<th style="width: 100px;">Name</th>
			<th style="width: 100px;">type</th>
			<th style="width: 50px;">default</th>
			<th>description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>navLinks</td>
			<td>object(jquery)</td>
			<td>$('.navigation ul li a,#mobnav ul li a, .singlepageLink')</td>
			<td>Links for controlling</td>
		</tr>
		<tr>
			<td>activeArticle</td>
			<td>object(jquery)</td>
			<td>false</td>
			<td>First Arcticle at start</td>
		</tr>
		<tr>
			<td>keyControl</td>
			<td>boolen</td>
			<td>true</td>
			<td>Key Control</td>
		</tr>
		<tr>
			<td>touchControl</td>
			<td>boolen</td>
			<td>true</td>
      			<td>Touch Control</td>
		</tr>
		<tr>
			<td>scrollbar</td>
			<td>boolen</td>
			<td>true</td>
			<td>Scrollbar Show</td>
		</tr>
		<tr>
			<td>fullHeight</td>
			<td>boolen</td>
			<td>true</td>
      			<td>Article min-height = monitor height</td>
		</tr>
		<tr>
			<td>noteScrollNavigation</td>
			<td>boolen</td>
			<td>true</td>
      			<td>Note Navigation by article Scroll</td>
		</tr>
		<tr>
			<td>easing</td>
			<td>string</td>
			<td>easeInOutExpo</td>
			<td>Animation Type (Jquery UI Easing)</td>
		</tr>
		<tr>
			<td>speed</td>
			<td>nummber</td>
			<td>500</td>
			<td>Animation Speed</td>
		</tr>
		<tr>
			<td>googleTrackingID</td>
			<td>string</td>
			<td>false</td>
			<td>Google Analytics ID</td>
		</tr>
	</tbody>
</table>

## Functions
Alle Funktionen können direkt verwendet werden.
``` js
var s;
$(document).ready(function(){
  s = new xSinglePage();
  
  $("#nextButton").click(function(){
  	s.next();
  });
  
  $("#topButton").click(function(){
  	s.scrollTop();
  });
  ...
});

[Singlepage - Webseite]:http://xpager.ch/entwicklung/singlepage/
