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
    var theMap = opts.map

    //The ol.Collection that holds all of the features in memory, whether visible or not
    var allFeatures = opts.initialCollection || new ol.Collection();

    //the layer that will hold everything we draw
    var workingLayer = opts.workingLayer || new ol.layer.Vector({
        source: new ol.source.Vector({
        	features: allFeatures
        }),
        title: "workingLayer",
        style: new ol.style.Style({
            fill: new ol.style.Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
              color: '#ffcc33',
              width: 2
            }),
            image: new ol.style.Circle({
              radius: 7,
              fill: new ol.style.Fill({
                color: '#ffcc33'
              })
            })
          })
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
    var modifyInteraction;

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
    };

    //Finally, attach everything to the map, instead of detaching/rebuilding interaction objects, this code works through the "active" attr of the interactions
    opts.map.addInteraction(drawPointInteraction);
    opts.map.addInteraction(drawLineInteraction);
    opts.map.addInteraction(drawPolygonInteraction);
    //the modify interaction will have to be added on the fly since it has to work on the features present on the map at the time is activated, and at first there might be no features at all
    opts.map.addInteraction(selectInteraction);

    //add the layer to the map, we remove it first in case it was provided to us already linked to the map
    //opts.map.removeLayer(workingLayer);
    opts.map.addLayer(workingLayer);

    //At this initialization step, ensure everything is turned off, and then let the caller take care of the rest!
    turnOff();

    //debuggin function
    function logActiveInteractions(){
        theMap.getInteractions().forEach(function (elem) {
            if (elem.getActive()) {
                console.log(elem.get('title'));
            }
        })
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
    		theMap.addInteraction(modifyInteraction);
    	}
    }

    editor.stopEditing = function stopEditing() {
        mode = "off";
        selectInteraction.setActive(false);
        modifyInteraction.setActive(false);
		//we must also flush both interaction of all the features they may still contain

    }

    return editor;
}