function UserControls(opts){
    var interfaceControls = {};
    var $controls = $(opts.interfaceTarget);

    var colorBefore = opts.before;
    var colorActive = opts.active;

    //the FeatureEditor object to be controlled by this interface
    var featureEditor = opts.controller;

	//theDataEditor object controlled by this interface
    var dataEditor = opts.reader;

    //id string of the target element for the ui
    var editTarget = opts.editTarget

	//JSON object sent by the server, contains most of the conf details
    var specification = JSON.parse(document.getElementById("server-data").innerHTML);

    //the meta data object
    var meta = opts.meta;

    //We start by enabling the tabular UI from jQuery on the element specified in the constructor
    $controls.tabs({
        collapsible: true,
        heightStyle: "content",
        active: false
    });

    //Extract all the clickable tabs from the id
    var $tabs = $controls.find("ul.navbar a");

    $controls.on("tabsactivate", function (evt, ui) {

        featureEditor.turnOff();

        if (ui.oldTab.length > 0) {
            //we just made a tab disappear
            if (ui.oldPanel.attr("id") == "edit") {
                clearInputs();
                featureEditor.stopEditing();
                clearInputs();
            }
        }

        if (ui.newTab.length > 0) {
            //we just made a content appear, change the active tab to the activeColor
            if (ui.newTab.find("a[href=#draw]").length > 0) {
                featureEditor.startDrawing();
                $("#draw label.table-row").first().click();
            }
            else if (ui.newTab.find("a[href=#edit]")) {
                featureEditor.startEditing();
            }
        }
    });

    function highlightChoice($radioSet, chosenClass){
        $radioSet.click(function (evt) {
            $radioSet.removeClass(chosenClass);
            $(this).addClass(chosenClass);
        });
    }

    highlightChoice($("div#draw label"), "chosen");


    function showInputs(){
        $("#edit").animate({ "left": "-100%" }, 200);
    }

    function showInstruct(){
        $("#edit").animate({ "left": "0%" }, 200);
    }



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
	function buildDataUI(){
		var editorUi = $("<div></div>", { class: "table data-viewer" });

		var spec = meta;

		//iterate through the keys in spec
		for(field in spec){
			if(spec.hasOwnProperty(field)){
				//the server will set some properties as uneditable, skip them
				//this only prevents them from appearing in the ui, the real protection must of course be implemented server-side
				//by the class responsible for writing to the databse
				if(spec[field].invisible || field == 'timestamp'){
					continue;
				}
				//check that an array was passed as a value
				
				var mockRow = $("<div></div>", { class: "table-row" });
				editorUi.append(mockRow);

				var fieldLabel = $("<span>" + field + "</span>");
				fieldLabel.addClass("field-name");
				fieldLabel.addClass("table-cell");
				mockRow.append(fieldLabel);

				var editable;
				var choices = spec[field].values;

				if(Array.isArray(choices)){
					// we requested a list of possible values
					var editable = $("<select></select>");
					choices.forEach(function (elem) {
						editable.append($("<option>" + spec[field].map[elem] + "</option>").attr("value", elem));
					});

					if(spec[field].allowMultiple){
						editable.attr("multiple", "multiple");
						editable.attr("size", 2);
					}
				}
				else{
					// we left the user free to write whatever value, but it should conform to the specified "type"
					var type = choices;
					editable = $("<input></input>", { "type": type, class: "input-text "+"ensure-"+type });
				}
					
				editable.addClass("accepts-data");
				mockRow.append(editable);

                //make a link between the meta-data object and the html element for write purpose
				spec[field].inputElement = editable;

                //for read purposes, set the name equal to the field ** bug detected, fails when field name contains spaces, replace with hyphens, need to decode!!!!
				editable.attr("name", field.replace(/\s+/g, "-"));
				
			}
		}
		console.log(editorUi);
		$(editTarget).empty().append(editorUi);
	}

    //call this builder immediatly on object creation
    buildDataUI()

    function clearInputs(){
        $(editTarget).find(".accepts-data").each(function (idx, elem) {
            if (elem.type == "checkbox" || elem.type == "radio") {
	            elem.checked = false;
	        }
	        else if (elem.tagName == "SELECT") {
	            $(elem).val([]);
	        }
	        else {
	            elem.value = "";
	        }
        });
    }

    /*********************************************** event listeners  *************************************/

    featureEditor.getSelect().on("select", function (evt) {
        //if there is one feature in selection, scroll to show the input
        var selected = dataEditor.getSelect().getFeatures().getLength();

        if (selected == 1) {
            showInputs();
        }
        else {
            showInstruct();
            clearInputs();
        }
    });




	/************************************  PUBLIC API   ***************************************/

    interfaceControls.rebuildUI = buildDataUI;
    interfaceControls.showInstructs = showInstruct;
    interfaceControls.showInputs = showInputs;

    interfaceControls.closeEdit = function () {
        var editor = $("#edit");
        if (editor.is(":visible")) {
            $tabs.filter("a[href=#edit]").trigger("click");
        }
    }

    return interfaceControls;
}