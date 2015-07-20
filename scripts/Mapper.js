function Mapper(opts){
    
    var self = this;
    if(proj4 == null){
        throw ("make sure you link to the proj4js library to handle arbitrary projections: http://proj4js.org/");
    }else if(ol == null || ol.Map == null){
        throw ("make sure you link to the Open Layers 3 library http://openlayers.org/");
    }
    
    var interface = {};
	var theFilter;
    //the id of the div element that will receive the map
    var targetDiv = opts.target;

    

    //the array of ol.proj.Projection objects that will be supported
    var loadedProjections = (function (projArray) {
        if (projArray == null) throw ("must provide an array of pairs like: [['EPSG:1234', 'proj4js string..']]");
        var arrlength = projArray.length;
        var supportedProjs = [];
        for (var i = 0; i < arrlength; i++) {
            proj4.defs(projArray[i][0], projArray[i][1]);
            var olProjection = ol.proj.get(projArray[i][0])
            if (projArray[i][2] != null) {
                olProjection.setExtent(projArray[i][2]);
            }
            supportedProjs.push(olProjection);
        }
        return supportedProjs;
    })(opts.projections);

    

    //the center coordinate of the map, given in the first projection of the projections array
    var center = opts.center;
    
    //A literal object of layers that will be supported as choices for the base map
    //key: an arbitrary name given by the user
    //value: an ol.Layer.Tile object
    var baseMaps = (function (requests) {
        var layers = {};
        for (var request in requests) {
            if (requests.hasOwnProperty(request)) {
                var reqParams = {};
                reqParams.layers = requests[request].layers;
                if (requests[request].hasOwnProperty('styles')) {
                    reqParams.styles = requests[request].styles;
                }
				
                layers[request] = new ol.layer.Tile({
                    source: new ol.source.TileWMS({
                        url: requests[request].url,
                        params: reqParams
                    }),
                    title: 'base'
                });
            }
        }
        return layers;
    })(opts.sources);




    //flag used to delay feature rendering after the map has finished loading for the first time
    var firstLoad = true;
    var pointLayer;
    var regionsLayer;

	interface.addPointLayer = function (layer) {
		pointLayer = layer;
	};

	interface.addRegionsLayer = function (layer) {
	    regionsLayer = layer;
	};

	interface.addFeatFilter = function (FF) {
		theFilter = FF;
	};

    interface.redrawSimple = function() {
        var thingsToDraw = theFilter.filterAll();
        interface.project(thingsToDraw);
    }

    //the view used to initialize the map, can be changed later
    var theView = new ol.View({
        center: center,
        projection: loadedProjections[0], 
        zoom: 1,
        zoomFactor: 1.5,
        extent: loadedProjections[0].getExtent(), 
		maxResolution: 3500
    });


    //theView.on('change:resolution', function (evt) {
    //    //calculateNewExtent(evt.oldValue, theMap.getLayers().item(0).getExtent(), theMap.getLayers().item(0));
    //    var newExtent = theView.calculateExtent(theMap.getSize());
    //});

    //the ol.Map object. Yay!
    var theMap = new ol.Map({
    	target: targetDiv,
    	view: theView,
    	layers:  [(function (layers) {
    		for (var layer in layers) {
    			if (layers.hasOwnProperty(layer)) {
    				layers[layer].setContrast(0);
    				return layers[layer];
    			}
    		}
    	})(baseMaps)
        ]
    });

    var mainSelect = new ol.interaction.Select({
    	layers: function (layer) {
    		return (layer.get('title') != 'regionsLayer');
    	}
    });


    mainSelect.on("select", function (evt) {
        var numberOfSelected = mainSelect.getFeatures().getLength();
        var infoPanel = $("#infoPanel");
        if (numberOfSelected == 1) {
            if (1 - evt.selected.length + evt.deselected.length != 1) {
                infoPanel.slideDown();
            }
            infoPanel.empty();
            infoPanel.append(generateInfoPanel(mainSelect.getFeatures().item(0)));
        }
        else {
            infoPanel.slideUp('fast', function () {
                infoPanel.empty();
            });
        }
    });




	function generateInfoPanel(feature){

		var doNotShow = ["geometry", "proj", "donnee", "url"];


		var infoUl = $("<table></table>", { class: "infoContainer" });
        infoUl.append($("<thead><tr><th colspan = '2'>Données supplémentaires</th></tr></thead>"))
		feature.getKeys().forEach(function (key) {
			if (doNotShow.indexOf(key) != -1) {
				return;
			}
			var infoRow = $("<tr></tr>", { class: "infoRow" });
			infoRow.append($("<td>" + key + "</td>", { class: "infoKey" }));
			infoRow.append($("<td>" + feature.get(key) + "</td>", { class: "infoValue" }));
			infoUl.append(infoRow);
		});
		if(feature.get("url") != undefined){
			var audioTD = $("<tr></tr>", { class: "infoRow" });
			audioTD.append($("<td colspan = '2'><audio controls src='" + feature.get('url') + "' type='audio/mp3'></audio></td>"));
		}
		infoUl.append(audioTD);
		return infoUl;
	};

    theMap.addInteraction(mainSelect);

    interface.getMap = function () {
        return theMap;
    }

    

    function calculateNewExtent(oldResolution, oldExtent, layer){
        var newDimensions = theMap.getSize();
        var changeFactor = oldResolution / theMap.getView().getResolution();
        for(var i=0; i<oldExtent.length;i++){
            oldExtent[i] = oldExtent[i] * changeFactor;
        }
        layer.setExtent(oldExtent);
    }

    //theMap.on('postcompose', function (event) {
    //    var context = event.context;
    //    var canvas = context.canvas;
    //    var image = context.getImageData(0, 0, canvas.width, canvas.height);
    //    var data = image.data;
    //    for (var i = 0, ii = data.length; i < ii; i += 4) {
    //    data[i] = data[i + 1] = data[i + 2] = (3 * data[i] + 4 * data[i + 1] + data[i + 2]) / 8;
    //    }
    //    context.putImageData(image, 0, 0);
    //});

    function onPostRender(evt) {
    
        var evtMap = evt.map;
        var center = ol.extent.getCenter(evtMap.getView().getProjection().getExtent());
        var limits = evtMap.getView().getProjection().getExtent();
        var limit_x = Math.abs(limits[2] - limits[0]);
        var limit_y = Math.abs(limits[3] - limits[1]);

        var view_extent = evtMap.getView().calculateExtent(evtMap.getSize());
        var view_x = Math.abs(view_extent[2] - view_extent[0]);
        var view_y = Math.abs(view_extent[3] - view_extent[1]);

        var deltaY = limit_y - view_y;
        var deltaX = limit_x - view_x;
		if(deltaY < 0){
			deltaY = 0;
		}
		if(deltaX < 0){
			deltaX = 0;
		}

        ol.View.prototype.constrainCenter = ol.CenterConstraint.createExtent([center[0]-deltaX/2, center[1]-deltaY/2, center[0]+deltaX/2, center[1]+deltaY/2]);
    }

    theMap.on('postrender', onPostRender);


    /**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * @param   Number  h       The hue
     * @param   Number  s       The saturation
     * @param   Number  l       The lightness
     * @return  Array           The RGB representation
     */
    function hslToRgb(input){
        var r, g, b;

        var h = input.h;
        var s = input.s;
        var l = input.l;

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return "rgb("+Math.round(r * 255)+", "+ Math.round(g * 255)+", "+ Math.round(b * 255)+")";
    }

    function generateNRandomColors(n){
        var resultSet = [];
        var step = 1 / n;
        for(var i = 0; i < 1; i += step) {
            c= {}
            c.h = i;
            c.s = 0.85 + Math.random() * 0.15;
            c.l = 0.35 + Math.random() * 0.3;

            resultSet.push(hslToRgb(c));
        }
        return resultSet;
    }

    /**
    *
    *
    *@param {setObject[]} array of setobjects
    *@param setObject.set array of ol.features of the group
    *@param setObject.name string reprensenting which particular values of filters were used to select the points in this group
    *@param colors {rgb[]} array of strings reprensenting the rgb colors to use as legend
    *@return {jQuery} a jQuery object representing the legend, to be inserted at your pleasure ;)
    */
    function generateLegend(items, colors){

        var legend = $("<div></div>", {
            class: "legendContainer floater"
        });
        var legendList = $("<table></table>", {
            class: "legendList"
        });
        legend.append(legendList);
        legendList.append($("<thead><tr><th colspan='3'>Sous-groupes</th></tr></thead>"));
        var isEmpty = true;

        items.forEach(function (elem, i, arr) {
            if (elem.set.length == 0) {
                return;
            }

            isEmpty = false;

            var checkboxID = 20 + i;
            var legendListItem = $("<tr></tr>");
            //start with the little square showing the correct color;
            var colorCont = $("<td></td>");
            colorCont.append($("<div></div>", {
                style: "background-color: " + colors[i] + ";",
                class: "legendColor"
            }));
            legendListItem.append(colorCont);
            var label = items[i].name.slice(0, -1);
            legendListItem.append("<td>" + label + "</td>");
            var switchTd = $("<td></td>");
            var checkboxDiv = $('<div class="switch"></div>');
            switchTd.append(checkboxDiv);
            var checkbox = $('<input id="cmn-toggle-' + checkboxID + '" class="cmn-toggle cmn-toggle-round" type="checkbox">');
            var checkboxLabel = $('<label for="cmn-toggle-' + checkboxID + '"></label>');

            legendListItem.append(switchTd);
            checkboxDiv.append(checkbox).append(checkboxLabel);



            legendList.append(legendListItem);


            checkboxLabel.trigger("click");

            var newLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: items[i].set
                }),
                title: items[i].name,
                visible: false,
                style: new ol.style.Style({
                    image: new ol.style.Circle({
                        fill: new ol.style.Fill({
                            color: colors[i]
                        }),
                        radius: 6,
                        stroke: new ol.style.Stroke({
                            color: [0, 0, 0, 1],
                            width: 2
                        }),
                        snapToPixel: false
                    })
                })
            });

            theMap.addLayer(newLayer);

            checkbox.change(function (evt) {
                if (newLayer.getVisible()) {
                    newLayer.setVisible(false);
                } else {
                    newLayer.setVisible(true);
                }
            })
            //turns out its more convenient to create the layers here so we can bind an event listener to the checkboxinput node...

        });
        if(!isEmpty){
            return legend;
        }
        else{
            return null;
        }
        
    }

    /**actually show the stuff i guess... <3
    *
    *
    *@param {set[]} items an array objecs
    *@param 
    */
    interface.project = function (items) {


        if (items.length > 0) {

            //hack to solve concurrent iterating/deleting of array
            var numberOfLayers = theMap.getLayers().getLength();
            for (var i = 0; i < numberOfLayers; i++) {
                var newLength = theMap.getLayers().getLength();
                var item = theMap.getLayers().item(newLength - 1);
                if (item.get("title") != 'regionsLayer' && item.get("title") != 'base') {
                    theMap.removeLayer(item);
                }
            }



            if (items.length > 1) {
                //this is the hard case, we need to generate the correct number of different colors, a legend html object, then add
                //all of this to the map
                var numberOfGroups = items.length;
                var colors = generateNRandomColors(numberOfGroups);
                //we need to clear the legend if it exists
                var oldLegend = $(".legendContainer");
                if (oldLegend.length != 0) {
                    oldLegend.remove();
                }
                //now that this is removed, we add the new legend as a child of the control element
                var $theLegend = generateLegend(items, colors);

                //check if we just returned a completely empty div when making legend, if yeah, then dont append anything
                if ($theLegend != null) {
                    
                    $("#zindexhack").append($theLegend);
                    $theLegend.find("label").click();
                    $theLegend.jScrollPane({
                        verticalGutter: 10,
                        verticalDragMaxHeight : 75
                    });
                }
            }
            else {
                //single object provided, this is the simple case
                pointLayer.getSource().clear(true);
                pointLayer.getSource().addFeatures(items[0].set);
                theMap.addLayer(pointLayer);
            }
        }
        else {
            throw "WTF empty array???";
        }
    };

    interface.getFilter = function () {
        return theFilter;
    }

    return interface;
}