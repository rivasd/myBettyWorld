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
		<script src="http://openlayers.org/en/v3.7.0/build/ol-debug.js" type="text/javascript"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.3.6/proj4.js"></script>
        <!--<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">-->
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>

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
						"values" => array("number")
					),

					"région" => array(
						"values" => array(
							"Caribou", "Igloolik", "Ungava"
						)
					),

					"style" => array(
						"values" => array(
							"Jeu vocal", "Chant des enfants", "Chant de gorge"
						),
						"allowMultiple" => TRUE,
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
                        <div id="edit">edit</div>
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
							<br>
							<br>
							<br>
							<br>
							<br>
							<br>
							<br>
							<br>
							<br>
							<br>
							<br><br>
							<br>
							<br>
							<br>
							<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
                        </div>
                        <div id="opts">opts</div>
                    </div>
                
				<div id="map">
				</div>
			</div>
			<footer>
                <ul class="navbar" id="lownavbar">
                    <li><a><i class="fa fa-download vertical-center"></i></a></li>
                    <li><a><i class="fa fa-floppy-o vertical-center"></i></i></a></li>
                    <li><a><i class="fa fa-sign-out vertical-center"></i></a></li>
                </ul>
			</footer>
		</div>
    </body>
</html>
