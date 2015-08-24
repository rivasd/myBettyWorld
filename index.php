<?php

?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title></title>

		<link rel="stylesheet" type="text/css" href="styles/myBettyWorld.css">
        <!--<link rel="stylesheet" href="styles/font-awesome-4.3.0/css/font-awesome.css">-->
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
        <link href='http://fonts.googleapis.com/css?family=Play' rel='stylesheet' type='text/css'>

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
		<script src="http://openlayers.org/en/v3.8.2/build/ol-debug.js" type="text/javascript"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.3.6/proj4.js"></script>
        <!--<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">-->
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>

        <!--FileSaver.js to allow download from client-side only-->
        <script src="FileSaverJS/FileSaver.js"></script>

        <script src="scripts/BettyServerInterface.js"></script>
        <script src="scripts/UserControls.js"></script>
        <script src="scripts/FeatureEditor.js"></script>
		<script src="scripts/global.js"></script>
		<script src="scripts/Mapper.js"></script>
    </head>
    <body>
		<script id="server-data" type="application/json">
			<?php
				//this is where we will pull useful data from the server in the same http request that serves the page
				$params = array(
					"id" => array(
						"invisible" => TRUE,
						"values" => array("number")
					),

					"titre" => array(
						"values" => array("text")
					),

					"date" => array(
						"values" => array("text")
					),

					"région" => array(
						"values" => array(
							1, 2, 3, 4
						),
                        "map" => array(
                            1 => "Caribou",
                            2 => "Igloolik",
                            3 => "Terre Neuve",
                            4 => "Nunavut"
                        )
					),

					"style" => array(
						"values" => array(
							1, 2, 3
						),
                        "map" => array(
                            1 => "Jeu chanté",
                            2 => "Jeu vocal",
                            3 => "Chant des enfants"
                        ),
						"allowMultiple" => TRUE,
					),

                    "Polyphonies" => array(
                        "values" => array(
                            1, 2, 3, 4
                        ),

                        "map" => array(
                            1 => "Induite",
                            2 => "poly1",
                            3 => "poly2",
                            4 => "poly3"
                        )
                    )
				
				);
				
				echo json_encode($params);
			?>
		</script> 

		<div id="mainWrap">
			<header>
                <div id="title-container"><p id="title">MyBettyWorld</p></div>
                <ul class="navbar" id="topnavbar">
                        <li class="mainbutton"><a href="#search"><i class="fa fa-search vertical-center"></i></a></li>
                        <li class="mainbutton"><a href="#edit"><i class="fa fa-pencil-square-o vertical-center"></i></a></li>
                        <li class="mainbutton"><a href="#draw"><i class="fa fa-paint-brush vertical-center"></i></a></li>
                        <li class="mainbutton"><a href="#opts"><i class="fa fa-bars vertical-center"></i></a></li>
                    </ul>
			</header>
            
			<div id="center">
				
                    <div id="controls">
                        <div id="search">search</div>
                        <div id="edit">
                            <div id="edit-instructions" class="switchable">
                                <ul>
                                    <li>
                                        Click on a point, line or polygon to select it. You can then change its shape with the mouse.
                                    </li>
                                    <li>
                                        If you select a single feature, this panel will change to allow you to edit the data attached to the feature.
                                    </li>
                                    <li>
                                        Shift-click to add to the current selection, and press delete to remove all selected features.
                                    </li>
                                </ul>
                            </div>
                            <div id="edit-interface" class="switchable">
                            
                            </div>
                        </div>
                        <div id="draw">
                            <input class="hidden" type="radio" name="drawing" value="Point" id="PointSelector" checked/>
                            <input class="hidden" type="radio" name="drawing" value="Line" id="LineSelector"/>
                            <input class="hidden" type="radio" name="drawing" value="Polygon" id="PolygonSelector"/>
                            <div class="table">
                                
                                <label for="PointSelector" class="table-row">
                                    <span class="table-cell icon">
                                        <i class="fa fa-circle"></i>
                                    </span>
                                    <span class="table-cell">
                                        <p class="descriptor">Points</p>
                                    </span> 
                                </label>
                                    
                                <label for="LineSelector" class="table-row">
                                    <span class="table-cell icon">
                                        <img src="styles/Polygonal_chain_64.png" class="icon"/>
                                    </span>
                                    <span class="table-cell">
                                        <p class="descriptor">Lines</p>
                                    </span>
                                </label>
                                
                                    
                                <label for="PolygonSelector" class="table-row">
                                    <span class="table-cell icon">
                                        <img src="styles/Pentagon__64.png" class="icon"/>
                                    </span>
                                    <span class="table-cell">
                                        <p>Polygon</p>
                                    </span>
                                </label>
                             </div>   
                             <p class="instructions">Hold the <span class="key">Shift</span> key to activate free draw!</p> 
							<!--test html for the max-height feature-->
                        </div>
                        <div id="opts">opts</div>
                    </div>
                
				<div id="map">
				</div>
			</div>
			<footer>
                <ul class="navbar" id="lownavbar">
                    <li><a id="saveCopy"><i class="fa fa-download vertical-center"></i></a></li>
                    <li><a id="sync"><i class="fa fa-floppy-o vertical-center"></i></a></li>
                    <li><a id="touchedAll"><i class="fa fa-sign-out vertical-center"></i></a></li>
                </ul>
			</footer>
		</div>
    </body>
</html>
