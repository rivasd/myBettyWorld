<?php
require_once "myBettyConnector.php";

$connection = new myBettyConnector(array(
    "database" => "myBettyWorld",
    "username" => "root",
    "password" => "lapinrose229",
    "host" => "localhost",
    "masterTable" => "master"
));

echo json_encode($connection->load($_GET['fill']));
?>

