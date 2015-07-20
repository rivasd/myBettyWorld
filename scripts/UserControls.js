function UserControls(id, opts){
    var interfaceControls = {};
    var $controls = $(id);

    var colorBefore = opts.before;
    var colorActive = opts.active;

    //the FeatureEditor object to be controlled by this interface
    var editor = opts.controller;

    //We start by enabling the tabular UI from jQuery on the element specified in the constructor
    $controls.tabs({
        collapsible: true,
        heightStyle: "content",
        active: false
    });

    //Extract all the clickable tabs from the id
    var $tabs = $controls.find("ul a");

    $controls.on("tabsactivate", function (evt, ui) {

        //editor.turnOff();

        if (ui.newTab.length > 0) {
            //we just made a content appear, change the active tab to the activeColor
            if (ui.newTab.find("a[href=#draw]").length > 0) {
                editor.startDrawing();
                $("#draw label").first().click();
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

    return interfaceControls;
}