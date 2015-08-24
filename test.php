<?php

require_once "cgi-bin/SecurityManager.php";
require_once "cgi-bin/myBettyConnector.php";


$opts = array(
    "database" => "myBettyWorld",
    "username" => "root",
    "password" => "lapinrose229",
    "host" => "localhost",
    "masterTable" => "master"
);


$connection = new myBettyConnector($opts);


?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title></title>
    </head>
    <body>
        <?php 
            
            echo $connection->load();
        
        ?>
    </body>
</html>
