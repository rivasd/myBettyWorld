var hook = {};

$(function () {

    //var mapper = new Mapper({
    //    target: 'map',
    //    dataURL: 'data/epiedboeuf.txt',
    //    projections: [
    //        ["EPSG:3978", "+proj=lcc +lat_1=49 +lat_2=77 +lat_0=49 +lon_0=-95 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs", [-2747629.369105021, -933111.728342669, 3582832.0571527407, 4658277.930268141]]
    //    ],
    //    center: [748643.0223069002, 1333780.29831271],
    //    sources: {
    //        Toporama: {
    //            url: 'http://wms.ess-ws.nrcan.gc.ca/wms/toporama_fr',
    //            layers: 'SCW-Toporama'
    //        }
    //    }
    //});

    var server = BSI();
    server.load(setup, false);

    function setup(fulldata) {

        var meta = fulldata.meta;
        var data = fulldata.data;
        console.log(fulldata);


        var map = new ol.Map({
            target: 'map',
            layers: [
          new ol.layer.Tile({
              source: new ol.source.MapQuest({ layer: 'sat' })
          })
        ],
            view: new ol.View({
                center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
                zoom: 4
            }),
            controls: []
        });


        var editor = FeatureEditor({
            map: map,
            typeSelector: "drawing",
            meta: meta,
            editTarget: "#edit-interface",
            initialCollection: data,
            server: server
        });

        editor.bindSaver("#saveCopy");

        //the object allowing us to control the user interface
        var ui = UserControls({
            active: "#475e89",
            before: "#2E4762",
            controller: editor,
            interfaceTarget: "#mainWrap",
            editTarget: "#edit-interface",
            meta: meta,
            reader: editor
        });

        editor.setView(ui);

        hook.map = map;


        $("#sync").click(syncHandler);

        function syncHandler(evt) {
            evt.preventDefault();
            var syncbutton = $("#sync");
            syncbutton.off("click");

            //well start by saving any non comitted changes locally
            editor.sync(aftersync);

            function aftersync(errors) {
                $("#sync").click(syncHandler);
                if (errors) {
                    alert("sync did not succeed");
                }
                else {
                    alert("everything went well!");
                }
            }

        }

        $("#touchedAll").click(editor.markAllTouched);
    }




});