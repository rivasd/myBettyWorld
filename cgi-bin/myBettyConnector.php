<?php
/**
*Master class allowing interaction with a myBettyWorld MySQL database
*
*
*@author Daniel Rivas
*/
class BettyConnector {

	//the MySQL database name to be used
	protected $database;

	//the hostname, username, and password to use
	protected $username;
	protected $password;
	protected $host;

	//the master table in the data that holds the actual features
	protected $masterTable;

	//MySQL columns used internally only, not to be returned to the client
	protected $internals = array("version", "owner", "removed");
	
	//the database connection mysqli object to be used
	protected $db;
	
	//the metadata table obtained by calling DESCRIBE {$masterTable} on the database
	protected $meta;
	
	/**************************** Custom Exceptions ******************************/

	class LoginFailure extends Exception {}
	class DatabaseError extends Exception {}


	/***************************************** Private Methods ******************************************************/


	function __construct($opts){
		//start off by checking if the user is logged in
		$secure = new SecurityManager();
		if(!$secure->isLoggedIn){
			throw new LoginFailure("Tried to create a server connection from a un-authenticated session. REFUSED.")
		}
		$this->$database = $opts["database"];
		$this->$username = $opts["username"];
		$this->$password = $opts["password"];
		$this->$host     = $opts["host"];
		$this->$masterTable = $opts["masterTable"];

		$this->$db = connectToDB();

		$meta = $this->$db->query("DESCRIBE $masterTable");
		if($this->$db->error){
			throw new DatabaseError("failed attempt to call DESCRIBE 'masterTable': ".$this->$db->error);
		}


	}

	/**
	*General use function to start a connection to the db
	*
	*@return {mysqli}
	*@throws Exception when connection fails
	*/
	function connectToDB(){
		$db = mysqli_connect($host, $username, $password $database);

		if($db->connect_error){
			echo ($db->connect_error);
			throw new DatabaseError("could not connect to database: ".$db->connect_error);
		}else{
			return $db;
		}
	}

	/**
	*Used to identify which columns of the master table are references to other tables
	*
	*
	*@return {mysqli_result}
	*/
	function getForeignColumns(){
		
		$columns = $this->$db->query("select `column_name`, `referenced_table_name`, `referenced_column_name` from information_schema.KEY_COLUMN_USAGE where `table_schema` = DATABASE() and table_name = \"$masterTable\" and `referenced_table_name` is not null and `column_name` != \"owner\"");
		if($this->$db->error){
			throw DatabaseError("Query failed, could not fetch metadata: ".$db->error);
		}
		return $columns;
	}

	/**
	*Follows foreign key constraints to retrieve the human-readable value referenced by the key
	*
	*
	*
	*/
	function translateKey($keyValue, $table){
		
	}


	function createFeatureFromRow($row){
		$feature = array(
			"type" => "Feature",
		);


	}



	/*********************************************** Public API **********************************/

	




}
?>


