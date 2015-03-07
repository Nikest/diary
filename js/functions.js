var
    events = [],
    number = 0,
    marker = {},
    markers = [],
    mapOptions = {},
    windowHahs = '';

function cancellation() { // функция кнопки "отмена" в форме создания события
    $('#eventTitle, #eventDescription, #eventDate, #eventYoutube, #eventImg').css('box-shadow', 'inset 0 0 0 #FFF').val('');
    $('.create div').hide();
    $('#mapMarker').removeAttr("checked");
    deleteMarker(null);
    mapOptions = {
        center: new google.maps.LatLng(50.005806, 36.229085),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
}

function validation() { // Проверка форм на заполненность и корректность
    var stringPattern = /^([а-яё]|[0-9]|[a-z])/i,
        datePattern = /^([0-9][0-9][0-9][0-9])-([0-1][0-9])-([0-3][0-9])$/,
        address = /^(http:\/\/)|(https:\/\/)/i;

    var title = $('#eventTitle').val().replace(/^\s+/, ''),//удаление пробелов в начале строки
        date = $('#eventDate').val().replace(/^\s+/, ''),
        description = $('#eventDescription').val().replace(/^\s+/, ''),
        assess = $('input:radio[name=assess]:checked' ).val(),
        youtube = $('#eventYoutube').val().replace(/^\s+/, ''),
        img = $('#eventImg').val().replace(/^\s+/, '');

    if(stringPattern.test(title)) {
    } else {
        $('#eventTitle').css('box-shadow', 'inset 0 0 5px #FF5F00');
        return
    }

    if(stringPattern.test(description)) {
    } else {
        $('#eventDescription').css('box-shadow', 'inset 0 0 5px #FF5F00');
        return
    }

    if(datePattern.test(date)) {
    } else {
        $('#eventDate').css('box-shadow', 'inset 0 0 5px #FF5F00');
        return
    }

    if ($("#mapMarker").prop("checked")) {
    } else {
        $('#createMap').css('box-shadow', '0 0 5px #FF5F00');
        return
    }

    if (youtube != '') {
        if (address.test(youtube)) {
            var validYoutube = youtube;
            var youtube = validYoutube.replace(/watch\?v\=/, 'embed/');
        } else {
            $('#eventYoutube').css('box-shadow', 'inset 0 0 5px #FF5F00');
            return
        }
    }

    if (img != '') {
        if (address.test(img)) {

        } else {
            $('#eventImg').css('box-shadow', 'inset 0 0 5px #FF5F00');
            return
        }
    }

    objectEvent(title, description, date, assess, youtube, img); //передача переменных для создания объекта
    $('#eventTitle, #eventDescription, #eventDate, #eventYoutube, #eventImg').val('');
    $('.create div').hide();
    $('#assess_1').attr("checked","checked");
    numberOfEvents();//подсчет всех событий и вывод их на кнопку "все события"
    eventToLocal(); //загрузка в LocalStorage
    $('#mapMarker').removeAttr("checked");//удаление маркера с карты
}

function objectEvent(title, description, date, assess, youtube, img) { // На основе полученных данных из формы создает объект
    events[events.length] = new ObjEvent(title, description, date, assess, youtube, img);
    writeEvents(number);//выводятся в ДОМ события
    number++;
}

function localToEvent() { // Из localStorage создает объекты в массиве events
    var count = localStorage.getItem('count');
    var num = parseInt(count);

    if (num) {
        for(var i = 0; i < num; i++) {
            eval('var data_' + i + '= localStorage.getItem(' + i + ');');
        }

        for(var i = 0; i < num; i++) {
            var a = eval('data_' + i);
            events[i] = JSON.parse(a);
        }

        number = num;

    } else {
        number = 0;
    }
}

function ObjEvent(title, description, date, assess, youtube, img) { // конструктор
    this.title = title;
    this.description = description;
    this.date = date;
    this.assess = assess;
    this.youtube = youtube;
    this.img = img;
    this.number = number;
    this.pColor = '#000';
}

function writeEvents(number) { // Выводит в DOM объект из массива events
    var
        div_open = '<div data-number="' + number + '" id="number_' + number + '">',
        div_close = '</div>',
        div_map = '<div id="map_'+ number +'"></div>',
        h2 = '<h2>' + events[number].title + '</h2>',
        p = '<p style="color:'+ events[number].pColor +'">' + events[number].description + '</p>',
        span_date = '<span>Дата: ' + events[number].date + '</span>',
        span_assess = '<span class="assess">' + events[number].assess + '</span>',
        edit_button = '<span class="edit">Редактировать текст</span>',
        style_button = '<span class="style">Редактировать стили</span>',
        delete_button = '<span class="delet">Удалить</span>',
        youtube = '', img = '';

    if(events[number].youtube != '') {
        youtube = '<iframe src="' + events[number].youtube + '"></iframe>';
    }
    if(events[number].img != '') {
        img = '<img src="' + events[number].img + '"></img>';
    }

    $('#list').append(div_open + h2 + span_date + p + youtube + img + div_map + span_assess + edit_button + style_button + delete_button + div_close)
    eval('var div_cont = $("#number_' + number + '")');
    if((events[number].youtube != '') && (events[number].img != '')) {
        div_cont.children('iframe').css({width: '50%', height: '200px'});
        div_cont.children('img').css({width: '50%', height: '200px'})
    }
    $('.edit').editor();
    $('.style').styleEditor();
    $('.delet').deleter();

    eval('var map = document.getElementById("map_' + number + '")');

    if (typeof markers[number] != "undefined") {
        events[number].mapCoord = {
            lat: markers[number].position.k,
            lng: markers[number].position.D
        };
    } else {
        if (typeof events[number].mapCoord === 'undefined') {
            events[number].mapCoord = {
                lat: marker.position.k,
                lng: marker.position.D
            };
        }
    }


    events[number].mapOptions = {
        center: new google.maps.LatLng(events[number].mapCoord.lat, events[number].mapCoord.lng),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var eventMap = new google.maps.Map(map, events[number].mapOptions);

    var eventMarker = new google.maps.Marker({
        position: new google.maps.LatLng(events[number].mapCoord.lat, events[number].mapCoord.lng),
        map: eventMap,
        title: 'Здесь произошло событие: ' + events[number].title
    });
}

function numberOfEvents() { // выводит в кнопку "Все события" колличество событий
    if(number != 0) {
        $('.numberEvents').text(number).css('background', '#e1e7ed');
    } else {
        $('.numberEvents').text('').css('background', '#fff');
    }
}

function eventToLocal() { // переводит объекты из массива events в localStorage
    number = 0;
    for (var i = 0; i < events.length; i++) {
        eval('var data_' + i + ' = JSON.stringify(events[' + i + '])');
        var data = eval('data_' + i);
        localStorage.setItem(i, data);
        number++
    }

    localStorage.setItem('count', number);
}

function output() { // функция кнопки "Все события". Выводит из массива events объекты в DOM
    $('.create div').hide();
    $('#list').children('div').remove();
    for(var i = 0; i < events.length; i++) {
        writeEvents(i);
    }
}

function openMap() { // открывает карту в форме 'создания события'.
    mapOptions = {
        center: new google.maps.LatLng(50.005806, 36.229085),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var mapCreator = new google.maps.Map(document.getElementById("createMap"), mapOptions);

    google.maps.event.addListener(mapCreator, 'click', function(event) {
        addMarker(event.latLng, mapCreator);
    });

}

function addMarker(location, map) { // Отмечает маркером область карты по клику
    deleteMarker(null);

    marker = new google.maps.Marker({
        position: location,
        map: map
    });

    markers.push(marker);
}

function deleteMarker(map) { // Удаляет лишние маркеры
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function allMapGeneration() { // функция кнопки "Где я был". Открывает карту и выставляет на ней отметки из всех событий

    $('#list').children('div').remove();
    $('#list').append('<div id="allMap"></div>');

    var allMapOptions = {
        center: new google.maps.LatLng(49.51, 36.14),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var allMap = new google.maps.Map(document.getElementById('allMap'), allMapOptions);

    for(var i = 0; i < events.length; i++) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(events[i].mapCoord.lat, events[i].mapCoord.lng),
            map: allMap,
            title: 'Здесь произошло событие: ' + events[i].title
        });
    }

}

function hash() {
    if(window.location.hash === '#new' && window.location.hash != windowHahs) {
        $('#newButt').click();
        windowHahs = window.location.hash
    }

    if(window.location.hash === '#all' && window.location.hash != windowHahs) {
        $('#allButt').click();
        windowHahs = window.location.hash
    }

    if(window.location.hash === '#map' && window.location.hash != windowHahs) {
        $('#mapButt').click();
        windowHahs = window.location.hash
    }

    var edipPat = /#editor/;
    if(edipPat.test(window.location.hash)) {
        if(window.location.hash != windowHahs) {
            if($('.edit').text() === '') {
                $('#allButt').click();
            }
            var hash = window.location.hash;
            var num = parseInt(hash.replace(/#editor\//, ''));
            $('.edit').each(function(i, elem){
                if(i === num) {
                    $(elem).click()
                }
            });
            windowHahs = window.location.hash
        }
    }

    var stylePat = /#style/;
    if(stylePat.test(window.location.hash)) {
        if(window.location.hash != windowHahs) {
            if($('.style').text() === '') {
                $('#allButt').click();
            }
            var hash = window.location.hash;
            var num = parseInt(hash.replace(/#style\//, ''));
            $('.style').each(function(i, elem){
                if(i === num) {
                    $(elem).click()
                }
            });
            windowHahs = window.location.hash
        }
    }

    var deletPat = /#delete/;
    if(deletPat.test(window.location.hash)) {
        if(window.location.hash != windowHahs) {
            if ($('.delet').text() === '') {
                $('#allButt').click();
            }
            var hash = window.location.hash;
            var num = parseInt(hash.replace(/#delete\//, ''));
            $('.delet').each(function(i, elem){
                if(i === num) {
                    $(elem).click()
                }
            });
            windowHahs = window.location.hash
        }

    }
}
