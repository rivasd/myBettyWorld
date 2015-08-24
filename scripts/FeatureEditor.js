/**
*A class to control the drawing/visual editing capacities of myBettyWorld. Does not take care of data attributes of the points
*
*
*@param opts.map {ol.Map} the OpenLayers 3 map on which we will draw
*@param opts.initialCollection {ol.Collection} if provided, features to draw at the beggining, also the container for the new ones
*@param opts.workingLayer {ol.layer.Vector} if provided, the layer that will hold our drawings. we assume that if provided, it uses the above param as feature collection
*@param opts.typeSelector {String} value of the "name" attribute of the HTML elements that controls the drawing type (lines, points, etc). works with radio buttons or single select element
*
*@author Daniel Rivas
*/
function FeatureEditor(opts){

    var editor = {};

    //this tells us in which mode we are, either "draw" or "edit"
    var mode;

    //the ol.map to be linked to this editor
    var theMap = opts.map;

	//
    var meta = opts.meta;

    var editTarget = opts.editTarget;

    //The ol.Collection that holds all of the features in memory, whether visible or not
    var allFeatures = opts.initialCollection || new ol.Collection();

    //the view that controls this model
    var viewer = opts.viewer;

    //a recycle bin ol.collection  that will hold deleted ol.features. this object should allow for permanent deleting or restoring
    var recycleBin = new ol.Collection();

    //the server link object allowing for communication with the database
    var serverLink = opts.server


    //the layer that will hold everything we draw
    var workingLayer = opts.workingLayer || new ol.layer.Vector({
        source: new ol.source.Vector({
            features: allFeatures
        }),
        title: "workingLayer" ,
        style:  function (feat, res) {
            var styleArray = [];
            var strokeColor = [];
            if (feat.get('isNew')) {
                strokeColor = [214, 36, 20, 1];
            }
            else {
                strokeColor = [235, 235, 235, 1];
            }


            var base = new ol.style.Style({
                image: new ol.style.Circle({
                    fill: new ol.style.Fill({
                        color: [255, 204, 51, 1]
                    }),
                    stroke: new ol.style.Stroke({
                        color: strokeColor,
                        width: 3
                    }),
                    radius: 7
                })
            });

            styleArray.push(base);

            var changedTextStyle = new ol.style.Style({
                text: new ol.style.Text({
                    text: "C",
                    fill: new ol.style.Fill({
                        color: [0, 0, 0, 1]
                    }),
                    stroke: new ol.style.Stroke({
                        width: 2,
                        color: [255, 255, 255, 1]
                    })
                })
            });

            if (feat.get("touched")) {
                styleArray.push(changedTextStyle);
            }

            return styleArray;
        }
       
    });

    //The ol.source that holds what we will draw
    var mainSource = workingLayer.getSource();

    //our ol.interaction.Draw objects trough which we will actually draw
    var drawPointInteraction = new ol.interaction.Draw({
        source: mainSource,
        type: 'Point',
        title: 'PointInteraction'
    });

    var drawLineInteraction = new ol.interaction.Draw({
        source: mainSource,
        type: 'LineString',
        title: 'LineInteraction'
    });

    var drawPolygonInteraction = new ol.interaction.Draw({
        source: mainSource,
        type: 'Polygon',
        title: 'PolygonInteraction'
    });

    var drawers = [drawPointInteraction, drawLineInteraction, drawPolygonInteraction];

    var drawersHash = {
        Point: drawPointInteraction,
        Line: drawLineInteraction,
        Polygon: drawPolygonInteraction
    };


    //Our ol.interaction.Select through which we will edit our drawing

    var selectInteraction = new ol.interaction.Select({
        layers: [workingLayer],
        title: "SelectInteraction"
    });

    //Finally, the ol.interaction.Modify object that will do the modifying
    var modifyInteraction = new ol.interaction.Modify({
        features: selectInteraction.getFeatures()
    });

    //the <input> element that controls which type of draw to use
    var $drawType = $("input[name="+opts.typeSelector+"]");


    function getType(){
        if($drawType.length > 1){
            //we probably got a list of radio buttons
            return $drawType.filter(":checked").val();
        }
        else{
            //we probably got a single type=select input element
            return $drawType.val();
        }
    }
    
    //this makes sure that when the user changes the draw type, we update the interactions accordingly
    $drawType.change(function (evt) {
        var type = getType();

        drawers.forEach(function (elem) {
            elem.setActive(false);
        });

        if(mode === "draw"){
            drawersHash[type].setActive(true);
        }
    })

    turnOff = function turnOff() {
        drawers.forEach(function (elem) {
            elem.setActive(false);
        });

        selectInteraction.setActive(false);
        if (modifyInteraction != undefined) modifyInteraction.setActive(false);

        //save if we need to save
        if (selectInteraction.getFeatures().getLength() == 1) {
            var toSave = selectInteraction.getFeatures().item(0);
            writeData(toSave, $(editTarget));
        }
        //flush all the selection
        selectInteraction.getFeatures().clear();
    };

    //Finally, attach everything to the map, instead of detaching/rebuilding interaction objects, this code works through the "active" attr of the interactions
    opts.map.addInteraction(drawPointInteraction);
    opts.map.addInteraction(drawLineInteraction);
    opts.map.addInteraction(drawPolygonInteraction);
    opts.map.addInteraction(modifyInteraction);
    opts.map.addInteraction(selectInteraction);

    //add the layer to the map, we remove it first in case it was provided to us already linked to the map
    //opts.map.removeLayer(workingLayer);
    opts.map.addLayer(workingLayer);

    //At this initialization step, ensure everything is turned off, and then let the caller take care of the rest!
    turnOff();

	/**********************************  EVENT LISTENERS ************************************************/

    selectInteraction.on("select", function (evt) {

        //alert("change in the selected object");

        //find out if the previous state was one with only one feature selected. if yes, then save before displaying the new data
        var prevLength = selectInteraction.getFeatures().getLength() + evt.deselected.length - evt.selected.length;
        var currentLength = selectInteraction.getFeatures().getLength();

        if (prevLength == 1) {
            var toSave;
            if (evt.deselected.length > 0) {
                toSave = evt.deselected[0];
            } else {
                toSave = selectInteraction.getFeatures().item(0);
            }

            writeData(toSave, $("#edit"));
        }

        if (selectInteraction.getFeatures().getLength() === 1) {
            //alert("there should be one feature only in the selection");

            //there is currently one item selected. show the edit UI!
            var theFeat = selectInteraction.getFeatures().item(0);
            displayData(theFeat, $("#edit"));
        } // this will be true when deselecting everyhting currently selected aka we are about to have an empty selection
        else if (selectInteraction.getFeatures().getLength() == 0) {


            //replace the ui by instruction:
            //alert("nothing selected!");


        }
        else {
            //replace the UI by instructions




        }
    });

    //For the application to manage multiple concurrent editors, as well as to reduce server load, we need to differentiate between features imported from the db
    //and the features draw through this painter (aka new features created by this user).
    //TOTHINK: do we need to set an ID client-side? it's probably best to let mySQL handle the auto increment...

    drawers.forEach(function (elem) {
        elem.on("drawend", function (evt) {
            evt.feature.set("isNew", true);

            //alert("just drew some stuff!"); // for debugging purposes

            //WE ALSO NEED TO INITIALIZE ALL INTERNAL DATA TO AT LEAST "" SO THAT THE REST OF THE CODE WORKS
            initFeature(evt.feature);
        });
    });

    function initFeature(feat){
        for (fieldName in meta) {
    		if (meta.hasOwnProperty(fieldName) && !meta[fieldName].invisible) {
    			var initVal;

    			if (Array.isArray(meta[fieldName].values)) {
    				initVal = [];
    			}
    			else{
    				initVal = "";
    			}


    			feat.set(fieldName, initVal);
    		}
    	}
    }

    modifyInteraction.on("modifyend", function (evt) {
        evt.features.forEach(function (elem) {
            //like a virgin....WOO!
            elem.set("touched", true);
        })//Make sure to set the same function when internal data is altered (this is just for graphical editing)
    })


    //debuggin function
    function logActiveInteractions(){
        theMap.getInteractions().forEach(function (elem) {
            if (elem.getActive()) {
                console.log(elem.get('title'));
            }
        })
    }

    function getAsFile() {
        //DEPENDENCY: FileSaver.js see https://github.com/eligrey/FileSaver.js
        var formatter = new ol.format.GeoJSON();
        var data = formatter.writeFeatures(mainSource.getFeatures());
        var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "geodata.txt")
    };

    function clearInterface($interface) {
        $interface.find(".accepts-data").each(function (idx, elem) {
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
    /******************************************  Data Edition code ***************************************/


    //This is a copy of the JSON object returned by the server that describes the organization of data, which values are acceptable, which fields are
    //editable, as well as the translation dictionnaries between the secondary keys used as actual values and the human readable associated strings displayed
    //see the param description of the main object for full description
    var meta = opts.meta

	/**
	*Writes data from the interface input elements to the specified ol.feature
	*
	*@param feat {ol.feature}	The ol.Feature to which we want to write the data
	*@param $interface {jQuery}	a jQuery DOM object. the method will search for all child <input> elements inside (with the appropriate class set by UserControls.js ) it 
	*							and try to write their value to the feature if allowed by the meta-data object
	*/
    function writeData(feat, $interface){
    	var $writers = $interface.find(".accepts-data");

    	$writers.each(function (idx, elem) {
    	    var fieldName = elem.getAttribute("name").replace(/-/g, " ");

    	    //don't even bother processing if this is a unchecked radio or checkbox
    	    if ((elem.type == "radio" || elem.type == "checkbox") && !elem.checked) {
    	        return;
    	    }

    	    //check that this field name is something that the server told us was save-able
    	    if (meta.hasOwnProperty(fieldName)) {
    	        var $input = $(elem);
    	        var valToWrite = $input.val(); //may return an array if this is a <select> element
    	        if (meta[fieldName].type == "int" || meta[fieldName].type == "float") {
    	            if (valToWrite !== "") {
    	                valToWrite = parseInt(valToWrite, 10);
    	            }
    	        }


    	        var isText = (elem.type == "text" || elem.tagName == "TEXTAREA");

    	        //we will assume that Open Layers 3 lets us store arrays as ol.Object custom properties...
    	        //A couple of safety checks...

    	        if (typeof valToWrite === "string" || typeof valToWrite === "number") {
    	            if (Array.isArray(meta[fieldName].values) && elem.type == "text") {
    	                throw "this fields expects an array of chosen values, tried to saved a string";
    	            }
    	        }
    	        else if (typeof valToWrite === "object") {
    	            if (!Array.isArray(meta[fieldName].values.length)) {
    	                throw "this field expects a single string as a free value, tried to write an array instead";
    	            }
    	        }
    	        else {
    	            throw "wow. what have you done?";
    	        }

    	        //we are now ready to write the data
    	        if (feat.get(fieldName) === undefined) {
    	            throw "You are trying to save a field that this feat did not already have set. this is a no-no";
    	        }

    	        if (elem.type == "checkbox") {
    	            //oh damn... friggin checkboxes. add this value to the array. if there is none, create it
    	            //why couldn't you stick to <select>?
    	            var updated = feat.get(fieldName).push(valToWrite);
    	            feat.set(fieldName, update);
    	        }
    	        else if (elem.type == "radio") {
    	            feat.set(fieldName, [valToWrite]);
    	        }
    	        else {
    	            // if we land here, it means we're writing from <input type=text> or <select>
    	            //wow you forgot to write the code to actually save the data
    	            if (elem.tagName == "SELECT" && !Array.isArray(valToWrite)) {
    	                valToWrite = [valToWrite];
    	            }
    	            feat.set(fieldName, valToWrite);
    	        }
    	    }
    	    else {
    	        throw "ERROR: trying to save a property not specified by the last server sync";
    	    }
    	});

		//flag that this feature has been edited and should be re-saved to the server on the next sync
    	feat.set("touched", true);
    }

	/**
	*Loads the data inside an ol.feature and displays in the chosen interface, ready for editing.
	*This function iterates through the meta-data object, and if the field is marked as editable, it will fetch the field from the feature, translate it to the correct
	*human-readable label if it is a secondary key, and display it in the appropriate element with class .accepts-data
	*
	*
	*@param feat {ol.feature}		the ol.feature from which we will pull data, as dictated, again, by the meta object that tells us
	*								which fields are editable and displayable data.
	*@param	$interface	{jQuery}	a jQuery DOM element that is supposed to hold the interface. we will try to fit the included data inside all child elements
	*								marked with the .accepts-data class, using the "name" attribute as a guide of which field to read.
	*/
	function displayData(feat, $interface){

        //to start, clear the interface
	    $interface.find(".accepts-data").each(function (idx, elem) {
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

		//start by iterating through the ownProperties of the meta-data object and identify visible ones
		for(fieldName in meta){
			if(meta.hasOwnProperty(fieldName) && !meta[fieldName].invisible && fieldName != "timestamp"){
				//"fieldName" should be retrievable from the feat object, if not then the client database was not properly initialized
				var rawValue = feat.get(fieldName);

				/* WE WILL ALLOW ABSENT VALUES FOR NOW FOR THE SAKE OF TESTING */
				/* CHANGE THIS FOR SERVER-SIDE DEBUGGING */
				if(rawValue == undefined){
					//rawValue = "missing!";
				}
				/* COMMENT OUT THE ABOVE CODE FOR SERVER-SIDE TESTING*/

				//find the correct element to update
				var target;
				//first, we will assume the values have been stored properly by the above function (and the server sync of course!)
				//If the rawValue is a string, we will assume we are looking for <input type="text">
				//If it is of type object (and by this I mean it is an array), then we are looking for either <select> or [type=radio] / [type=checkbox]
				if (!meta[fieldName].map) {
				    if (typeof rawValue == "string" || typeof rawValue == "number" || rawValue == null) {
				        target = $interface.find("input[name='" + fieldName.replace(/\s+/g, "-") + "'].accepts-data");
				        if (target.length == 0) {
				            throw "could not find the editable input[type=text] element with name=" + fieldName;
				        }
				        target.val(rawValue);
				    }
                    else{
                        throw "hum looks like you are writing a free-write field to a choice-constrained one";
                    }
				}
				else if (typeof rawValue == "object") {
				    var intermediate = $(".accepts-data").filter("[name=" + fieldName.replace(/\s+/g, "-") + "]");
				    //did we get multiple hits with this previous search? then we got a group of radio or checkbox

				    //SUPPORT FOR MULTIPLE DISCRETE VALUES COULD GO HERE
				    if (Array.isArray(rawValue) && rawValue.length == 1) {
				        rawValue = rawValue[0];
				    }


				    if (intermediate.length > 1) {
				        // are all of those <input> elements of the same type? they should be...
				        var ok = true;
				        var type = intermediate.first().attr("type");
				        intermediate.each(function (idx, elem) {
				            if (elem.tagName != "INPUT") {
				                ok = false;
				            }
				            if (elem.type != type) {
				                ok = false;
				            }
				        });

				        if (!ok) {
				            throw "wow, recheck your UI because names are being misused";
				        }
				        else {
				            // ok we are safe to write, pull the single element from the rawValue array. it is
				            intermediate.val(rawValue);
				        }
				    }
				    else {
				        //single hit, this has to be <select> element
				        if (intermediate.prop("tagName") != "SELECT") {
				            throw "Found a single input element when trying to write a multiple-choice data. It was not a <select>. You f*cked up son.";
				        }
				        target = intermediate;
				        //if, as it should be, we pulled an actual array from the ol.feat, we should be clear to use the val() jQuery method to finally write the data
				        target.val(rawValue);
				    }
				}
				else {
				    throw "hum a weird type was stored inside this ol.feature, maybe a number?";
				}
			}
		}
	}

    /**
    *Event listener that allows deletion of features (move to recycle bin)
    *
    *
    */
    function startDelete(evt){
        if (evt.which === 46){
            //Delete was pressed down. Move all selected features to the recycle bin
            var selectedFeats = selectInteraction.getFeatures();

            //We already got pwned by the delete-while-iterating bug in the past

            selectedFeats.forEach(function (elem) {
                //added reference to the feature to the recycle bin
                recycleBin.push(elem);
                mainSource.removeFeature(elem);
            });

            //make sure the select interaction itself does not keep references to the deleted features
            selectedFeats.clear();
            viewer.showInstructs();
        }
    }


    function convertBatchToEPSG(code){
        
    }

    /***************************** placing data  ********************************************/

    function place(feature){
        var placer = new ol.interaction.Draw({
            source: mainSource,
            type: "Point"
        });

        theMap.addInteraction(placer);
    }

    
    /**************** Public API **********************/


    /**
    *Desactivates the editor, so no change to the map can occur through it at least
    */
    editor.turnOff = turnOff;

    /**
    *choose the right drawer type then adds that iteraction to the map, making it ready to be drawn on
    *Best called when moving from another mode of interaction or for the first time
    *
    */
    editor.startDrawing = function draw() {

    	editor.stopEditing();
    	mode = "draw";
    	var type = getType();
    	drawersHash[type].setActive(true);
    	logActiveInteractions();
    };

    editor.stopDrawing = function stopdraw() {
        mode = "off";
        drawers.forEach(function (elem) {
            elem.setActive(false);
        });
    };

    editor.startEditing = function startEditing() {
        mode = "edit";
        selectInteraction.setActive(true);

        if (modifyInteraction != undefined) {
            modifyInteraction.setActive(true);
        }
        else {
            modifyInteraction = new ol.interaction.Modify({
                features: selectInteraction.getFeatures()
            });
        }
        //start listening for delete keypresses and delete accordingly
        $(document).on("keydown", startDelete);
        //viewer.showInputs();
    }

    editor.stopEditing = function stopEditing() {

        //check if something is selected before stopping editing so that we can save
        if (selectInteraction.getFeatures().getLength() == 1) {
            var featToSave = selectInteraction.getFeatures().item(0);
            writeData(featToSave, $("#edit"));
            viewer.showInstruct();
        }

        mode = "off";
        selectInteraction.setActive(false);
        if (modifyInteraction != undefined) {
            modifyInteraction.setActive(false);
        }
        //we must also flush both interaction of all the features they may still contain
        selectInteraction.getFeatures().clear();
        //stop deleting features on "delete" keypresses
        $(document).off("keydown", startDelete);

    }

    editor.read = displayData;
    editor.write = writeData;

    editor.bindSaver = function (id) {
        $(id).click(getAsFile);
    }

    editor.setView = function (UserControl) {
        viewer = UserControl;
    }

    editor.getSelect = function () {
        return selectInteraction;
    }

    editor.startDelete = function () {
        $(document).on("keydown", startDelete);
    }

    editor.stopDelete = function () {
        $(document).off("keydown", startDelete);
    }

    editor.getDatabase = function () {
    	return allFeatures;
    }

    editor.getRecycleBin = function () {
        return recycleBin;
    }

    editor.getUpdatesArray = function () {
        var news = [];
        allFeatures.forEach(function (elem) {
            if (elem.get('isNew') == true || elem.get('touched') == true) {
                news.push(elem);
            }
        });

        return news;
    }

    editor.updateDatabase = function ($fulldata){
        
    }

    editor.markAllTouched = function(){
         allFeatures.forEach(function(elem){
             elem.set('touched', true);
         })
    }

    editor.sync = function (callback) {
        //this.stopEditing();
        viewer.closeEdit();
        refinedCallback = function (newstuff, errors) {
            //code to update with the new data
            if (newstuff != null) {
                mainSource.clear()
                mainSource.addFeatures(newstuff.data.getArray());
                allFeatures = newstuff.data;
                allFeatures.forEach(function (elem) {
                    elem.set('isNew', false);
                    elem.set('touched', false);
                });
            }


            //finally do the user requested stuff
            callback(errors);
        }


        serverLink.sync(this.getUpdatesArray(), recycleBin, refinedCallback);



    }

    return editor;
}