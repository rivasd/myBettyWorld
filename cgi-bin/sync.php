<?php
require_once "myBettyConnector.php";

$writes = json_decode($_POST['writes']);
$deletes = json_decode($_POST['deletes']);


$connector = new myBettyConnector(array(
    "database" => "myBettyWorld",
    "username" => "root",
    "password" => "lapinrose229",
    "host" => "localhost",
    "masterTable" => "master"
));

$report = '';
$request = array();
$request['writes'] = $writes;
$request['deletes'] = $deletes;
echo $connector->sync($request);
?>


