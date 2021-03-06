/****************
 * MAIN
 */

jQuery(document).ready(function($){
	// Хук начала инициализации javascript-составляющих шаблона
	ls.hook.run('ls_template_init_start',[],window);
	 
	// Всплывающие окна
	$('#window_login_form').jqm();
	$('#blog_delete_form').jqm({trigger: '#blog_delete_show'});
	$('#add_friend_form').jqm({trigger: '#add_friend_show'});
	$('#window_upload_img').jqm();
	$('#userfield_form').jqm();
	$('#favourite-form-tags').jqm();
	$('#modal_write').jqm({trigger: '#modal_write_show'});
	$('#foto-resize').jqm();
	$('#avatar-resize').jqm();

	$('.js-registration-form-show').click(function(){
		if ($('#block_popup_login_item_registration').length) {
			$('#window_login_form').jqmShow();
			$('#block_popup_login_item_registration').trigger('click');
			return false;
		} else {
			window.location=aRouter.registration;
		}
	});

	$('.js-login-form-show').click(function(){
		if ($('#block_popup_login_item_login').length) {
			$('#window_login_form').jqmShow();
			$('#block_popup_login_item_login').trigger('click');
			return false;
		} else {
			window.location=aRouter.login;
		}
	});
	
	// Datepicker
	 /**
	  * TODO: навесить языки на datepicker
	  */
	$('.date-picker').datepicker({ 
		dateFormat: 'dd.mm.yy',
		dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
		monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
		firstDay: 1
	});
	
	
	// Поиск по тегам
	$('.js-tag-search-form').submit(function(){
		window.location = aRouter['tag']+encodeURIComponent($(this).find('.js-tag-search').val())+'/';
		return false;
	});
	
	
	// Автокомплит
	ls.autocomplete.add($(".autocomplete-tags-sep"), aRouter['ajax']+'autocompleter/tag/', true);
	ls.autocomplete.add($(".autocomplete-tags"), aRouter['ajax']+'autocompleter/tag/', false);
	ls.autocomplete.add($(".autocomplete-users"), aRouter['ajax']+'autocompleter/user/', true);

	
	// Скролл
	$(window)._scrollable();

	
	// Тул-бар топиков
	ls.toolbar.topic.init();
	// Кнопка "UP"
	ls.toolbar.up.init();

	
	// Всплывающие сообщения
	$('.js-title-comment, .js-title-topic').poshytip({
		className: 'infobox-standart',
		alignTo: 'target',
		alignX: 'left',
		alignY: 'center',
		offsetX: 5,
		liveEvents: true,
		showTimeout: 1500
	});

	$('.js-infobox-vote-topic').poshytip({
		content: function() {
			var id = $(this).attr('id').replace('vote_total_topic_','vote-info-topic-');
			return $('#'+id).html();
		},
		className: 'infobox-standart',
		alignTo: 'target',
		alignX: 'center',
		alignY: 'top',
		offsetX: 2,
		liveEvents: true,
		showTimeout: 100
	});
	
	$('.js-tip-help').poshytip({
		className: 'infobox-standart',
		alignTo: 'target',
		alignX: 'right',
		alignY: 'center',
		offsetX: 5,
		liveEvents: true,
		showTimeout: 500
	});

	// подсветка кода
	prettyPrint();
	
	// Хук конца инициализации javascript-составляющих шаблона
	ls.hook.run('ls_template_init_end',[],window);
});



/*****************
 * BLOCKS
 */

/**
 * Подключаем действующие блоки
 */
jQuery(function($){
	$('[id^="block_stream_item"]').click(function(){
		ls.blocks.load(this, 'block_stream');
		return false;
	});

	$('[id^="block_blogs_item"]').click(function(){
		ls.blocks.load(this, 'block_blogs');
		return false;
	});

	$('[id^="block_favourite_topic_tags_item"]').click(function(){
		ls.blocks.switchTab(this, 'block_favourite_topic_tags');
		return false;
	});

	$('[id^="block_tags_item"]').click(function(){
		ls.blocks.switchTab(this, 'block_tags');
		return false;
	});

	$('[id^="block_upload_img_item"]').click(function(){
		ls.blocks.switchTab(this, 'block_upload_img');
		return false;
	});

	$('[id^="block_popup_login_item"]').click(function(){
		ls.blocks.switchTab(this, 'block_popup_login');
		return false;
	});
});


/****************
 * COMMENTS
 */

/**
* Обработка комментариев
*/
ls.comments = (function ($) {
	/**
	* Опции
	*/
	this.options.folding = false;

	return this;
}).call(ls.comments || {},jQuery);

jQuery(document).ready(function(){
	ls.comments.init();
});



/*****************
 * FAVOURITE
 */


ls.hook.add('ls_favourite_toggle_after',function(idTarget,objFavourite,type,params,result){
	$('#fav_count_'+type+'_'+idTarget).text((result.iCount>0) ? result.iCount : '');
});


/****************
 * TALK
 */


jQuery(document).ready(function($){
	// Добавляем или удаляем друга из списка получателей
	$('#friends input:checkbox').change(function(){
		ls.talk.toggleRecipient($('#'+$(this).attr('id')+'_label').text(), $(this).attr('checked'));
	});
	
	// Добавляем всех друзей в список получателей
	$('#friend_check_all').click(function(){
		$('#friends input:checkbox').each(function(index, item){
			ls.talk.toggleRecipient($('#'+$(item).attr('id')+'_label').text(), true);
			$(item).attr('checked', true);
		});
		return false;
	});
	
	// Удаляем всех друзей из списка получателей
	$('#friend_uncheck_all').click(function(){
		$('#friends input:checkbox').each(function(index, item){
			ls.talk.toggleRecipient($('#'+$(item).attr('id')+'_label').text(), false);
			$(item).attr('checked', false);
		});
		return false;
	});
	
	// Удаляем пользователя из черного списка
	$("#black_list_block").delegate("a.delete", "click", function(){
		ls.talk.removeFromBlackList(this);
		return false;
	});
	
	// Удаляем пользователя из переписки
	$("#speaker_list_block").delegate("a.delete", "click", function(){
		ls.talk.removeFromTalk(this, $('#talk_id').val());
		return false;
	});
});

