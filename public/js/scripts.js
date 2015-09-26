$(document).ready(function() {
    'use strict';
    /*-----------------------------------------------------------------------------------*/
    /*	SCROLL NAVIGATION HIGHLIGHT
    /*-----------------------------------------------------------------------------------*/
    var headerWrapper = parseInt($('.navbar').height(), 10);
    var header_height = $('.navbar').height();
    var shrinked_header_height = 76;
    var firstStyle=
    {
        'padding-top':''+shrinked_header_height+'px',
        'margin-top':'-'+shrinked_header_height+'px'
    };
    $('.onepage section').css(firstStyle);
    var secondStyle=
    {
      'padding-top':''+header_height+'px',
      'margin-top':'-'+header_height+'px'
    };
    $('.onepage section:first-of-type').css(secondStyle);
    var offsetTolerance = -(header_height);
    //Detecting user's scroll
    $(window).scroll(function() {
        //Check scroll position
        var scrollPosition = parseInt($(this).scrollTop(), 10);
        //Move trough each menu and check its position with scroll position then add current class
        $('.onepage .navbar ul.navbar-nav a').each(function() {
            var thisHref = $(this).attr('href');
            var thisTruePosition = parseInt($(thisHref).offset().top, 10);
            var thisPosition = thisTruePosition - headerWrapper - offsetTolerance;
            if (scrollPosition >= thisPosition) {
                $('.current').removeClass('current');
                $('.navbar ul.navbar-nav a[href=' + thisHref + ']').parent('li').addClass('current');
            }
        });
        //If we're at the bottom of the page, move pointer to the last section
        var bottomPage = parseInt($(document).height(), 10) - parseInt($(window).height(), 10);
        if (scrollPosition == bottomPage || scrollPosition >= bottomPage) {
            $('.current').removeClass('current');
            $('.onepage .navbar ul.navbar-nav a:last').parent('li').addClass('current');
        }
    });

    /*-----------------------------------------------------------------------------------*/
    /*	OWL CAROUSEL
	/*-----------------------------------------------------------------------------------*/
    $('.carousel-boxed').owlCarousel({
        loop: false,
        margin: 30,
        nav: true,
        navText: ['', ''],
        dots: false,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });
    $('.basic-slider').owlCarousel({
        items: 1,
        nav: true,
        navText: ['', ''],
        dots: true,
        autoHeight: false,
        loop: true,
        margin: 0
    });
    $('.clients').owlCarousel({
        autoplay: true,
        autoplayTimeout: 3000,
        loop: true,
        margin: 50,
        nav: false,
        dots: false,
        responsive: {
            0: {
                items: 3
            },
            768: {
                items: 5
            },
            1200: {
                items: 6
            }
        }
    });
    $('.testimonials').owlCarousel({
        items: 1,
        nav: false,
        dots: false,
        autoHeight: true,
        autoplay: true,
        autoplayTimeout: 5000,
        loop: true,
        margin: 0
    });
    /*-----------------------------------------------------------------------------------*/
    /*	SHARE BAR
	/*-----------------------------------------------------------------------------------*/
    $('#share-bar').share({
        networks: ['twitter', 'facebook', 'tumblr', 'pinterest', 'googleplus', 'email'],
        orientation: 'vertical',
        affix: 'right center'
    });
    /*-----------------------------------------------------------------------------------*/
    /*	STICKY HEADER
	/*-----------------------------------------------------------------------------------*/
    var menu = $('.navbar'),
        pos = menu.offset();
    $(window).scroll(function() {
        if ($(this).scrollTop() > pos.top + menu.height() && menu.hasClass('default') && $(this).scrollTop() > 300) {
            menu.fadeOut('fast', function() {
                $(this).removeClass('default').addClass('fixed').fadeIn('fast');
            });
        } else if ($(this).scrollTop() <= pos.top + 300 && menu.hasClass('fixed')) {
            menu.fadeOut(0, function() {
                $(this).removeClass('fixed').addClass('default').fadeIn(0);
            });
        }
    });
    /*-----------------------------------------------------------------------------------*/
    /*	MENU
	/*-----------------------------------------------------------------------------------*/
    $('.js-activated').dropdownHover({
        instantlyCloseOthers: false,
        delay: 0
    }).dropdown();
    $('.btn.responsive-menu').on('click', function() {
        $(this).toggleClass('opn');
    });
    $('.navbar .nav li a').on('click', function() {
        $('.navbar .navbar-collapse.in').collapse('hide');
        $('.btn.responsive-menu').removeClass('opn');
    });
    /*-----------------------------------------------------------------------------------*/
    /*	IMAGE ICON HOVER
	/*-----------------------------------------------------------------------------------*/
    $('.icon-overlay a').prepend('<span class="icn-more"></span>');
    /*-----------------------------------------------------------------------------------*/
    /*	FANCYBOX
	/*-----------------------------------------------------------------------------------*/
    $(".fancybox-media").fancybox({
        arrows: true,
        padding: 0,
        closeBtn: true,
        openEffect: 'fade',
        closeEffect: 'fade',
        prevEffect: 'fade',
        nextEffect: 'fade',
        helpers: {
            media: {},
            overlay: {
                locked: false
            },
            buttons: false,
            thumbs: false,
            /*thumbs: {
                width: 50,
                height: 50
            },*/
            title: {
                type: 'inside'
            }
        },
        beforeLoad: function() {
            var el, id = $(this.element).data('title-id');
            if (id) {
                el = $('#' + id);
                if (el.length) {
                    this.title = el.html();
                }
            }
        }
    });
    /*-----------------------------------------------------------------------------------*/
    /*	DATA REL
	/*-----------------------------------------------------------------------------------*/
    $('a[data-rel]').each(function() {
        $(this).attr('rel', $(this).data('rel'));
    });
    /*-----------------------------------------------------------------------------------*/
    /*	PRETTIFY
	/*-----------------------------------------------------------------------------------*/
    window.prettyPrint && prettyPrint()
    /*-----------------------------------------------------------------------------------*/
    /* WIDTH CLASS
	/*-----------------------------------------------------------------------------------*/
    assign_bootstrap_mode();
    $(window).resize(function() {
        assign_bootstrap_mode();
    });

    function assign_bootstrap_mode() {
        var width = $(window).width();
        var mode = '';
        if (width < 768) {
            mode = "mode-xs";
        } else if (width < 992) {
            mode = "mode-sm";
        } else if (width < 1200) {
            mode = "mode-md";
        } else if (width > 1200) {
            mode = "mode-lg";
        }
        $("body").removeClass("mode-xs").removeClass("mode-sm").removeClass("mode-md").removeClass("mode-lg").addClass(mode);
    }

    /*-----------------------------------------------------------------------------------*/
    /*	WOW ANIMATION
    /*-----------------------------------------------------------------------------------*/
    new WOW().init();
    /*-----------------------------------------------------------------------------------*/
    /*	FORM
    /*-----------------------------------------------------------------------------------*/
    document.addEventListener("DOMContentLoaded", function() {
        var myForm;
        myForm = new VanillaForm(document.querySelector("form.vanilla"));
    });
});
