function UserControls(opts){
    var interfaceControls = {};
    var $controls = $(opts.interfaceTarget);

    var colorBefore = opts.before;
    var colorActive = opts.active;

    //the FeatureEditor object to be controlled by this interface
    var featureEditor = opts.controller;

	//theDataEditor object controlled by this interface
    var dataEditor = opts.reader;

	//JSON object sent by the server, contains most of the conf details
    var specification = JSON.parse(document.getElementById("server-data").innerHTML);

    //We start by enabling the tabular UI from jQuery on the element specified in the constructor
    $controls.tabs({
        collapsible: true,
        heightStyle: "content",
        active: false
    });

    //Extract all the clickable tabs from the id
    var $tabs = $controls.find("ul a");

    $controls.on("tabsactivate", function (evt, ui) {

    	featureEditor.turnOff();

    	if (ui.newTab.length > 0) {
    		//we just made a content appear, change the active tab to the activeColor
    		if (ui.newTab.find("a[href=#draw]").length > 0) {
    			featureEditor.startDrawing();
    			$("#draw label").first().click();
    		}
    		else if (ui.newTab.find("a[href=#edit]")) {
    			featureEditor.startEditing();
    		}
    	}
    	if (ui.oldTab.length > 0) {
    		//we just made a tab disappear, make sure its color is back to normal

    	}
    });

    function highlightChoice($radioSet, chosenClass){
        $radioSet.click(function (evt) {
            $radioSet.removeClass(chosenClass);
            $(this).addClass(chosenClass);
        });
    }

    highlightChoice($("div#draw label"), "chosen");

	/**
	*function that builds the correct UI for the data edition panel given a specification.
	*
	*@param spec {Object} keys are the fields that can be edited. the associated value is yet another object. If the array has one member, it will be considered an HTML5 input type attr. 
	*					  if it has many members, a select input type will be created with those members as possible values.
	*					  The special key "meta" holds an object that hodls meta-information about the editor, such as when multiple values of the list are supported
	*
	*@param spec.field	{Object}	The object associated with each field name contains a few things: the "values" key holds the array of possible values. 
	*
	*@return	{jQuery}	a jQuery object that contains the div element holding the editor interface	 
	*/
	function buildDataUI(spec){
		var editorUi = $("<div></div>", { class: "table data-viewer" });

		console.log(spec);

		//iterate through the keys in spec
		for(field in spec){
			if(spec.hasOwnProperty(field)){
				//the server will set some properties as uneditable, skip them
				//this only prevents them from appearing in the ui, the real protection must of course be implemented server-side
				//by the class responsible for writing to the databse
				if(spec[field].invisible){
					continue;
				}
				//check that an array was passed as a value
				if(!Array.isArray(spec[field].values)){
					throw "could not build editor UI, no array of possible values for this field!";
				}
				else{
					var mockRow = $("<div></div>", { class: "table-row" });
					editorUi.append(mockRow);

					var fieldLabel = $("<span>" + field + "</span>", { class: "table-cell field-name" });
					mockRow.append(fieldLabel);

					var editable;
					var choices = spec[field].values;

					if(choices.length > 1){
						// we requested a list of possible values
						var editable = $("<select></select>");
						choices.forEach(function (elem) {
							editable.append($("<option>" + elem + "</option>", { value: elem }));
						});

						if(spec[field].allowMultiple){
							editable.attr("multiple", "multiple");
							editable.attr("size", 1);
						}
					}
					else if( choices.length === 1){
						// we left the user free to write whatever value, but it should conform to the specified "type"
						var type = choices[0];
						editable = $("<input></input>", { "type": type, class: "input-text "+"ensure-"+type });
					}
					else{
						throw "spec[field].values array is empty for this field...";
					}
					editable.addClass("accepts-data");
					mockRow.append(editable);
				}
			}
		}

		return editorUi;
	}

	/************************************  PUBLIC API   ***************************************/

	interfaceControls.injectDataViewer = function (target) {
		var holder = $(target);
		holder.empty().append(buildDataUI(specification));
	}

    return interfaceControls;
}