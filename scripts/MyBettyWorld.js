/**
*client side code for MyBettyWorld
*
*
*
*
*/
$(function (opts) {
    var myApp = {};

    myApp.mapper = Mapper(opts);

    myApp.userInterface = UserControls(opts.interfaceTarget);

    myApp.featureEditor = FeatureEditor(opts);










    return myApp;
});