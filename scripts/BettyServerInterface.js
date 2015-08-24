function BSI(opts){
    var interface = {};


    /*** Public API **/

    function receiveRawData(ans, fillIn) {
        fillIn = fillIn || false;
        var parser = new ol.format.GeoJSON();
        ans.data.features.forEach(function (elem) {
            if (fillIn) {
                if (Array.isArray(elem.geometry.coordinates[0])) {
                    elem.geometry.coordinates.forEach(function (coor) {
                        coor = ol.proj.transform(coor, 'EPSG:4326', 'EPSG:3857');
                    })
                }
                else {
                    elem.geometry.coordinates = ol.proj.transform(elem.geometry.coordinates, 'EPSG:4326', 'EPSG:3857');
                }
            }
        });

        var reply = {};
        reply.meta = ans.meta;
        reply.data = new ol.Collection(parser.readFeatures(ans.data));

        return reply;
    }

    interface.load = function (callback, fillIn) {

        


        $.ajax({
            url: "cgi-bin/loadAll.php",
            method: "GET",
            dataType: 'json',
            data: {
                fill: fillIn
            },
            success: function (ans) {
                //var parser = new ol.format.GeoJSON();


                //ans.data.features.forEach(function (elem) {
                //    if (Array.isArray(elem.geometry.coordinates[0])) {
                //        elem.geometry.coordinates.forEach(function (coor) {
                //            coor = ol.proj.transform(coor, 'EPSG:4326', 'EPSG:3857');
                //        })
                //    }
                //    else {
                //        elem.geometry.coordinates = ol.proj.transform(elem.geometry.coordinates, 'EPSG:4326', 'EPSG:3857');
                //    }
                //});

                var reply = receiveRawData(ans, fillIn);
                callback(reply);
            }
        });
    }

    interface.sync = function (writes, recyclebin, after) {
        //Ideally, start by resolving all conflicts
        var formatter = new ol.format.GeoJSON();
        var featArray = formatter.writeFeatures(writes);
        var deleteArray = formatter.writeFeatures(recyclebin.getArray());
        $.ajax({
            url: '../cgi-bin/sync.php',
            method: 'POST',
            dataType: 'json',
            data: {
                writes: featArray,
                deletes: deleteArray
            },
            success: function (newdata) {
                //formatter.readFeatures()
                after(receiveRawData(newdata.data), newdata.errors);
            }
        });
    }

    return interface;
}