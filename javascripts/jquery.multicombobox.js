(function( $ ) {
    $.widget( "ui.multicombobox", {
      _create: function() {
        this.wrapper = $( "<div>" )
          .addClass( "ui-multicombobox ui-widget-content ui-widget" )
          .insertAfter( this.element );
		this.items = $( "<ul>" )
		  .addClass( "ui-multicombobox-items" )
		  .appendTo( this.wrapper );
		
        this.element.hide();
        this._createAutocomplete();
		this._createShowAllButton();
      },
 
      _createAutocomplete: function() {
        var selected = this.element.children( ":selected" );
        this.input = $( "<input>" )
		  .appendTo(this.wrapper)
          .addClass( "ui-multicombobox-input" )
          .autocomplete({
            delay: 0,
            minLength: 0,
            source: $.proxy( this, "_source" )
          });
 
        this._on( this.input, {
          autocompleteselect: function( event, ui ) {
            ui.item.option.selected = true;
            this._trigger( "select", event, {
              item: ui.item.option
            });
			this._addItem(ui.item.option);
			this.input.val('');
			return false;
          },
		  keydown : "_handleAutocompleteInput"
        });
      },
	  
	  _createShowAllButton : function() {
		var input = this.input,
          wasOpen = false;
		
		$("<span>")
			.css({
				"position":"absolute",
				"top":0,
				"right":0,
			})
			.attr( "tabIndex", -1 )
			.attr( "title", "Show All Items" )
			.tooltip()			
			.prependTo(this.wrapper)
			.addClass( "ui-icon ui-icon-triangle-1-s ui-multicombobox-toggle" )
			.mousedown(function() {
				wasOpen = input.autocomplete( "widget" ).is( ":visible" );
			})
			.click(function() {
				input.focus();
				if ( wasOpen ) {
				  return;
				}
				input.autocomplete( "search", "" );
			});
	  },
 
      _source: function( request, response ) {
        var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
        response( this.element.children( "option:not(:selected)" ).map(function() {
          var text = $( this ).text();
          if ( this.value && ( !request.term || matcher.test(text) ) )
            return {
              label: text,
              value: text,
              option: this
            };
        }) );
      },

	  _addItem : function(item) {
		var option = $(item);
		var that = this;
		 var listItem = $('<li>').addClass('ui-multicombobox-item ui-widget-content ui-state-default ui-corner-all')
					.appendTo(this.items)
                    .attr("tabindex", "0")
                    .on("click",function(e) {
                      return false;
                    })
					.on("keydown", function(e) {
						var k = e.which;
						if(k == 8 || k == 46) {
							option.prop("selected", false);
							that._removeItem(listItem);
							return false;
						} else if(k == 37) {
							if(listItem.prev().size() > 0)
								listItem.prev().focus();
							return false;
						} else if(k == 39) {
							if(listItem.next().size() > 0)
								listItem.next().focus();
							else that.input.focus();
							return false;
						}
						return true;
					});
		
		var p = $("<p>").appendTo(listItem)
					.text(item.text);
		var span = $("<span>").addClass("ui-multicombobox-item-delete")
	                    .html("&times;")
	                    .appendTo(listItem)
	                    .on("click",function() {
	                      option.prop("selected", false);
						  that._removeItem(listItem);
	                    });
	  },
	  
	  _removeItem : function(listItem) {
		if(listItem.prev().size() > 0)
			listItem.prev().focus();
		else if(listItem.next().size() > 0)
			listItem.next().focus();
		else this.input.focus();
		listItem.remove();
	  },
	  
      _destroy: function() {
        this.wrapper.remove();
        this.element.show();
      },
	  
	  _handleAutocompleteInput: function(e) {
		var k = e.which;
		var caret = this.input.caret();
		if(caret.begin == 0 && caret.end == 0) {
			//handle key inputs
			if(k == 8 || k == 37) {
				var lastChild = this.items.find('li:last');
				if(lastChild.size() > 0) {
					lastChild.focus();
					return false;
				}
			}
		}
		return true;
	  }
	  
    });
	
	$.fn.extend({
	//Helper Function for Caret positioning
	caret: function(begin, end) {
		var range;

		if (this.length === 0 || this.is(":hidden")) {
			return;
		}

		if (typeof begin == 'number') {
			end = (typeof end === 'number') ? end : begin;
			return this.each(function() {
				if (this.setSelectionRange) {
					this.setSelectionRange(begin, end);
				} else if (this.createTextRange) {
					range = this.createTextRange();
					range.collapse(true);
					range.moveEnd('character', end);
					range.moveStart('character', begin);
					range.select();
				}
			});
		} else {
			if (this[0].setSelectionRange) {
				begin = this[0].selectionStart;
				end = this[0].selectionEnd;
			} else if (document.selection && document.selection.createRange) {
				range = document.selection.createRange();
				begin = 0 - range.duplicate().moveStart('character', -100000);
				end = begin + range.text.length;
			}
			return { begin: begin, end: end };
		}
	}
	});
	
  })( jQuery );