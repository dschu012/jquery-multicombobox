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
          }
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
                    .on("click",function(event) {
                      return false;
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
			listItem.next.focus();
		else this.input.focus();
		listItem.remove();
	  },
	  
      _destroy: function() {
        this.wrapper.remove();
        this.element.show();
      }
    });
  })( jQuery );