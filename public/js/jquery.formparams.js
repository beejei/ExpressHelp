(function( $ ) {
	var radioCheck = /radio|checkbox/i,
		keyBreaker = /[^\[\]]+/g,
		numberMatcher = /^[\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?$/;

	var isNumber = function( value ) {
		if ( typeof value == 'number' ) {
			return true;
		}

		if ( typeof value != 'string' ) {
			return false;
		}

		return value.match(numberMatcher);
	};

	$.fn.extend({
		/**
		 * @parent dom
		 * @download http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/form_params/form_params.js
		 * @plugin jquery/dom/form_params
		 * @test jquery/dom/form_params/qunit.html
		 * <p>Returns an object of name-value pairs that represents values in a form.  
		 * It is able to nest values whose element's name has square brackets. </p>
		 * Example html:
		 * @codestart html
		 * &lt;form>
		 *   &lt;input name="foo[bar]" value='2'/>
		 *   &lt;input name="foo[ced]" value='4'/>
		 * &lt;form/>
		 * @codeend
		 * Example code:
		 * @codestart
		 * $('form').formParams() //-> { foo:{bar:2, ced: 4} }
		 * @codeend
		 * 
		 * @demo jquery/dom/form_params/form_params.html
		 * 
		 * @param {Boolean} [convert] True if strings that look like numbers and booleans should be converted.  Defaults to true.
		 * @return {Object} An object of name-value pairs.
		 */
		formParams: function( convert ) {
			if ( this[0].nodeName.toLowerCase() == 'form' && this[0].elements ) {

				return jQuery(jQuery.makeArray(this[0].elements)).getParams(convert);
			}
			return jQuery("input[name], textarea[name], select[name]", this[0]).getParams(convert);
		},
		getParams: function( convert ) {
			var data = {},
				current;

			convert = convert === undefined ? true : convert;

			this.each(function() {
				var el = this,
					type = el.type && el.type.toLowerCase();
				//if we are submit, ignore
				if ((type == 'submit') || !el.name ) {
					return;
				}

				var key = el.name,											// 실제 key(전체값)
					value = $.data(el, "value") || $.fn.val.call([el]),		// form object의 value값
					isRadioCheck = radioCheck.test(el.type),				// radio 체크값
					parts = key.match(keyBreaker),							// [][] 처럼 이중,삼중으로 배열형태로 네이밍이 되어있는 경우, 이걸 split해서 배열로 돌려준다
					write = !isRadioCheck || !! el.checked,					// radio/checkbox이고, 체크되면 true
					//make an array of values
					lastPart;

				if ( convert ) {
					if ( (type === "checkbox" || type === "radio") && isNumber(value) ) {
						value = parseFloat(value);
					} else if ( value === 'true' || value === 'false' ) {
						value = Boolean(value);
					}
				}

				// go through and create nested objects, 반복으로 drill down하면서 child노드를 만든다
				current = data;
				for ( var i = 0; i < parts.length - 1; i++ ) {
					if (!current[parts[i]] ) {
						current[parts[i]] = {};
					}
					current = current[parts[i]];
				}
				lastPart = parts[parts.length - 1];

				//now we are on the last part, set the value
				if ( /\[\]$/.test(key)/*lastPart in current && type === "checkbox" */) {
					if (!$.isArray(current[lastPart]) ) {
						//current[lastPart] = current[lastPart] === undefined ? [] : [current[lastPart]];
						current[lastPart] = [];
					}
					if( type === "checkbox" )
						current[lastPart].push(write);
					else if( write ) {
						current[lastPart].push(value);
					}
					//current[lastPart].push(write);	// modified by beejei
				} else if ( write || !current[lastPart] ) {
					if( type === "checkbox" )
						current[lastPart] = write;
					else if( type === "radio" ){
						if(typeof current[lastPart] === 'undefined')
							current[lastPart] = write;
						if(el.checked){
							current[lastPart] = value;
						}
					}else
						current[lastPart] = write ? value : undefined;
				}

			});
			return data;
		}
	});

})(jQuery)