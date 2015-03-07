var control = 0;
var cnt = 0;
(function( $ ) {
    $.fn.editor = function() { // функция кнопки для редактирования текста события

        $(this).click(function(){

            var div = $(this).parent();
            var dataNumber = parseInt(div.attr('data-number'));

            window.location.hash = 'editor'+'/'+dataNumber;

            var value = $(this).parent().children('p').text();
            div.children('p').after('<textarea>' + value + '</textarea><button class="button darkStyle" id="editButton">Сохранить</button><button class="button lightStyle" id="closeEditor">Отмена</button></br>');
            div.children('p').remove();

            control = dataNumber;

            $(this).parent().children('#editButton').click(function() {

                if (control == dataNumber) {
                    var newValue = $(this).parent().children('textarea').val();

                    if(newValue === '') {
                        div.children('textarea').css('box-shadow', 'inset 0 0 5px #FF5F00');
                        return
                    } else {
                        events[dataNumber].description = newValue;
                        div.children('textarea').after('<p>' + events[dataNumber].description + '</p>');
                        div.children('button').remove();
                        div.children('textarea').remove();
                        div.children('input').remove();
                    }

                    eventToLocal();
                    control++
                }

            });

            $(this).parent().children('#closeEditor').click(function() {
                if(control === dataNumber) {
                    div.children('textarea').after('<p>' + events[dataNumber].description + '</p>');
                    div.children('button').remove();
                    div.children('textarea').remove();
                    div.children('input').remove();
                    div.children('br').remove();
                }
            });

        });
    };

$.fn.deleter = function() { // функция кнопки удаления события

     $(this).click(function(){
         var div = $(this).parent();
         var dataNumber = parseInt(div.attr('data-number'));

         window.location.hash = 'delete'+'/'+dataNumber;

         control = dataNumber;
         $('#deleterBox').show();
         $('#deleterBox').children('div').children('p').text('Действительно ли вы хотите удалить событие ' + '"' + events[dataNumber].title + '"' + ' безвозвратно?');

         $('#deletUnconf').click(function(){
             $('#deleterBox').hide();
         });

         $('#deletConf').click(function(){

             if(control === dataNumber) {
                 events.splice(dataNumber,1);
                 div.remove();
                 localStorage.clear();
                 eventToLocal();
                 output();
                 numberOfEvents();
                 control++;
                 $('#deleterBox').hide();
             }

         });

     });

};

    $.fn.styleEditor = function() { // функция кнопки редактирования стилей
        $(this).click(function(){

            var div = $(this).parent();
            var p = div.children('p');
            var dataNumber = parseInt(div.attr('data-number'));

            window.location.hash = 'style'+'/'+dataNumber;

            control = dataNumber;

            if(cnt === 0) {
                div.children('p').after('<input type="text" id="picker" value="Выбрать цвет"></input><button class="button darkStyle" id="save">Сохранить</button><button class="button lightStyle" id="unSave">Отмена</button>');
                cnt++
            }

            $('#picker').colpick({
                layout:'hex',
                submit:0,
                colorScheme:'dark',
                onChange:function(hsb,hex,rgb,el,bySetColor) {
                    $(el).css('border-color','#'+hex);
                    if(!bySetColor) $(el).val(hex);
                }
            }).keyup(function(){
                $(this).colpickSetColor(this.value);
            });

            $(this).parent().children('#save').click(function() {
                if(control === dataNumber) {
                    var color = '#' + $('#picker').val();
                    p.css('color', color);
                    div.children('input').remove();
                    div.children('button').remove();
                    div.children('button').remove();
                    control++;
                    cnt = 0;
                    events[dataNumber].pColor = color;
                    eventToLocal();
                }

            });

            $(this).parent().children('#unSave').click(function() {
                if(control === dataNumber) {
                    div.children('input').remove();
                    div.children('button').remove();
                    div.children('button').remove();
                    control++;
                    cnt = 0;
                }

            });

        });

    }

})(jQuery);

