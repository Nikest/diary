$(document).ready(function(){
    localToEvent();
    numberOfEvents();

    $('.create div').hide();
    $('.create h1').click(function(){
        $('#list').children('div').remove();
        $('.create div').slideToggle(5);
        openMap()
    });

    $('#newButt').click(function(){
        $('.create div').show();
        $('#list').children('div').remove();
        openMap();
    });

    $('#eventDate').datepicker({dateFormat: "yy-mm-dd"});

    $('#eventTitle, #eventDescription, #eventDate, #eventYoutube, #eventImg, #createMap').click(function(){
        $(this).css('box-shadow', 'inset 0 0 0 #FFF').css('box-shadow', '0 0 0 #FFF');
    });

    $('#mapButt').click(function(){allMapGeneration()});
    $('#allButt').click(function(){output()});



});

$(window).load(function(){
    $('body').css('opacity', '1');

    hash();
});

