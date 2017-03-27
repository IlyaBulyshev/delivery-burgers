// // Accordion team
$(document).ready (function(){

$('.team-item__triggle').on('click', function(e){
    e.preventDefault();

    var triggle= $(this),
        contentDown = triggle.next ('.team-item__content');      
        contentUp = $('.team-item__content');
        item = triggle.parents ('.team-item');
        otherItems = $('.team-item');

        if (!item.hasClass ('active')) {
            otherItems.removeClass ('active');
            item.addClass ('active');
            contentUp.stop().slideUp();
            contentDown.stop().slideDown();
        } else {
            item.removeClass ('active')
            contentUp.stop().slideUp();
        };
    });
});


// Accordion menu 

$(document).ready (function(){

    $('.menu__item-trigger').on('click', function(e){
        e.preventDefault();

        var triggle = $(this);
            item = triggle.parents('.menu__item');
            otherItems = $('.menu__item');
            contentDown = triggle.next('.menu__item-content');
            contentUp = $ ('.menu__item-content');
            
           
            if (!item.hasClass('active')) {
                otherItems.removeClass ('active')
                item.addClass('active');
                contentUp.animate({width:'0px'}, 400);
                contentDown.animate({width:'540px'}, 400);
            } else {
                item.removeClass('active');
                contentUp.animate({width:'0px'}, 400);
            }
    });
});

//slider burger
$(function(){

    var moveSlide = function (container, slideNum) {
            var 
                items = container.find ('.stage-outer');
                activeSlide = items.filter ('.active');
                regItem = items.eq(slideNum);
                regIndex = regItem.index();
                list = container.find ('.burger-slider');
                duration = 500;

                if (regItem.length) {
                    list.animate({
                    "left": -regIndex * 100 + "%"
                }, duration, function(){
                    activeSlide.removeClass('active');
                    regItem.addClass ('active');
                });
            }
       
    };
    $('.burger-slider__btn').on('click', function(e){
            e.preventDefault();

            next = $(this);
            container = next.closest('.burger-slider-wrap');
            items = container.find ('.stage-outer');
            activeSlide = items.filter ('.active');
            nextItem = activeSlide.next();
            prevItem = activeSlide.prev();
      
            if (next.hasClass('slider--next')) {
                
                if(nextItem.length) {
                    moveSlide(container, nextItem.index());
                } else {
                    moveSlide(container, items.first().index());
                }
               
            } if (next.hasClass('slider--prev')) {

                if (prevItem.length) {
                     moveSlide(container, prevItem.index());
                } else {
                    moveSlide(container, items.last().index());
                }
            }

            });
});
 

//yandex-map

ymaps.ready(init);
 
function init(){     
 
    var myMap;
 
    myMap = new ymaps.Map("map", {
        center: [56.83856814279386,60.60536138972059],
        zoom: 15,
        controls: []
    });
    
    myMap.behaviors.disable('scrollZoom');
 
    myMap.controls.add("zoomControl", {
        position: {top: 15, left: 15}
    });

    var coords = [
    [56.837549874631065, 60.592855188043465],
    [56.833607089531256, 60.597149188664496],
    [56.837235154642734, 60.60921364815884],
],  
    myCollection = new ymaps.GeoObjectCollection({}, {
        draggable: false,
        iconLayout: 'default#image',
        iconImageHref: '../img/icons/map-marker.svg',
        iconImageSize: [46, 57],
        iconImageOffset: [-26, -52]
    });

    for (var i = 0; i < coords.length; i++ ) {
        myCollection.add (new ymaps.Placemark(coords[i]));
    }

    myMap.geoObjects.add(myCollection);
};

// one page scrollZoom

$(function(){

    var section = $('.section'),
        display = $('.maincontent');
        inScroll = false; 

    var ScrollToSection = function(sectionEq){
        var position = 0;

        if(!inScroll) {
            inScroll = true;

            position = (section.eq(sectionEq).index() * -100) + '%';

            section.eq(sectionEq).addClass('activation')
            .siblings().removeClass('activation');
            
            display.css({
                'transform': 'translate3d(0, '+ position +', 0)'
            })

            setTimeout(function(){
                inScroll = false;
            }, 930)

            $('.fixed-menu__item').eq(sectionEq).addClass('activation')
            .siblings().removeClass('activation');
           
        }

       
        
    };


    $('.wrapper').on('wheel', function(e){
       
        var deltaY = e.originalEvent.deltaY;
            activeSection = section.filter('.activation');
            nextSection = activeSection.next();
            prevSection = activeSection.prev();
            
       if (deltaY > 0) { 

           if (nextSection.length) {
            ScrollToSection(nextSection.index())
           }
       }

       if (deltaY < 0) { 
            if (prevSection.length) {
            ScrollToSection(prevSection.index())
            }
       }
    });

    $('.down-arrow').on('click', function(e){
        e.preventDefault();

         ScrollToSection(1);

    })

    $('.fixed-menu__link, .nav__link, .order-link, .burger-slider__buy').on('click', function(e){
         e.preventDefault();

         var href = parseInt($(this).attr('href'));

         ScrollToSection(href);
    });

    $(document).on('keydown', function(e){
        
        var activeSection = section.filter('.activation');
            nextSection = activeSection.next();
            prevSection = activeSection.prev();

        switch(e.keyCode) {
            case 40 :
            if (nextSection.length) {
            ScrollToSection(nextSection.index())
            }
            break;

            case 38 :
            if (prevSection.length) {
            ScrollToSection(prevSection.index())
            }
            break;
        }

    });
});

// input mask
$(function(){
    $('.phone-mask').inputmask('+7 (999) 999 99 99');
});

//fancybox
$(function(){
    $('.review__hover-btn').fancybox({
        type: 'inline',
        maxWidth: 460,
        fitToView: false,
        padding: 0
    });

    $('.popup__close').on('click', function(e){
        e.preventDefault();
        $.fancybox.close();
    });
});


//form submit 

$(function(){
    $('#order-form').on('submit', function(e){
        e.preventDefault();

        var form = $(this),
            formData = form.serialize();
        $.ajax({
            url: '../mail.php',
            type: 'POST',
            data: formData,
            success: function(data) {
               
                var popup = data.status ? '#success' : '#error';

                
                $.fancybox.open({
                src: popup,
                type: 'inline',
                maxWidth: 250,
                opts : {
                    afterClose: function () {
                    form.trigger('reset');
                    }
                }
            });
            $('.inner-btn__close').on('click', function(e) {
                e.preventDefault();
                $.fancybox.close();
              });                  
            }
        })
    });
});


