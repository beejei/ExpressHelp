var svee;
$(function(){
	$('section.test .answer.btn-group').click(function(event){
		$(this).find('.btn').removeClass('btn-primary');
		$(event.target).filter('.btn').addClass('btn-primary');
	});
	$('section.test .answer button[data-toggle="button"]').click(function(event){
		if($(this).hasClass('active')){
			$(this).removeClass('btn-primary');
		}
		else{
			$(this).addClass('btn-primary');
		}
	});
	$('#test-form').submit(function(event){
		var data = $(this).serialize();
		$(this).find('button.active').each(function(i, e){
			data = data + '&' + e.name + '=' + e.value;
		});
		console.log(data);
		alert(data);
		event.preventDefault();
	});

	svee = new SVEE();
});

function SVEE(){this.init()};
SVEE.prototype = {
	init: function(){
		var self = this;
		this.tmpl = doT.template(document.getElementById('tmpl_test').text, undefined);
		this.$container = $('section.test');
		this.page = 1;
		$.getJSON(
			'/svq_test.json', function(rs){
				rs.page = self.page;
				self.$container.html(self.tmpl(rs.svq));
			}
		);
	},
	isDefault: function(num, arr){
		var chk = false;
		for(var i = 0, n = arr.length; i < n; i++){
			if(arr[i] == num){
				chk = true;
			}
		}
		return chk;
	}
};