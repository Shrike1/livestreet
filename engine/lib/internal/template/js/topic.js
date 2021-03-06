var ls = ls || {};

/**
 * Опросы
 */
ls.topic = (function ($) {

	this.preview = function(form, preview) {
		form=$('#'+form);
		preview=$('#'+preview);
		var url = aRouter['ajax']+'preview/topic/';
		'*previewBefore*'; '*/previewBefore*';
		ls.ajaxSubmit(url, form, function(result) {
			if (result.bStateError) {
				ls.msg.error(null, result.sMsg);
			} else {
				preview.show().html(result.sText);
				ls.hook.run('ls_topic_preview_after',[form, preview, result]);
			}
		});
	};

	this.insertImageToEditor = function(sUrl) {
		$.markItUp({replaceWith: '<img src="'+sUrl+'" />'} );
		$('#window_upload_img').find('input[type="text"]').val('');
		$('#window_upload_img').jqmHide();
		return false;
	};

	return this;
}).call(ls.topic || {},jQuery);