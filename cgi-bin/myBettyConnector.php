<?php
/**
*Master class allowing interaction with a myBettyWorld MySQL database
*
*
*@author Daniel Rivas
*/

	class LoginFailure extends Exception {}
	class DatabaseError extends Exception {}
    require_once "SecurityManager.php";

class myBettyConnector {

	//the MySQL database name to be used
	protected $database;

    //the security manager for this instance
    protected $secManager;

	//the hostname, username, and password to use
	protected $username;
	protected $password;
	protected $host;

	//the master table in the data that holds the actual features
	protected $masterTable;

	//MySQL columns used internally only, not to be returned to the client
	protected $internals = array("version", "owner", "removed", "id", "creator", "geometry", "timestamp", "coordinates");
    protected $mustHave = array("Piste");
    //things that will never need to be written to the database (ie info that will never come from the client but will be set completely client side)
    //If a mistake is made here the insert and update operation will ask for a value that wont come from the client, and an error will occur (not all handles will be bound on the prepared PDO statement)
    protected $unwritables;
	
	//the database connection mysqli object to be used
	protected $db;
	
	//the metadata table obtained by calling DESCRIBE {$masterTable} on the database
	protected $meta;

    protected $metadata;
    
	protected $superTable;

    //array of all fields that cannot take null values
    protected $nonNulls;

	/***************************************** Constructor/Destructor ******************************************************/


	function __construct($opts){
		//start off by checking if the user is logged in
		$this->secManager = new SecurityManager();
		if(!$this->secManager->isLoggedIn()){
			throw new LoginFailure("Tried to create a server connection from a un-authenticated session. REFUSED.");
		}
		$this->database = $opts["database"];
		$this->username = $opts["username"];
		$this->password = $opts["password"];
		$this->host     = $opts["host"];
		$this->masterTable = $opts["masterTable"];

		$this->db = $this->connectToDB();

		$temp = $this->db->query("DESCRIBE `".$this->masterTable."`");
		if(!$temp){
			throw new DatabaseError("failed attempt to call DESCRIBE 'masterTable': ");
		}
        $this->meta = $this->resultToArray($temp, TRUE);
        $this->nonNulls = array();
        foreach($this->meta as $metaRow){
            if($metaRow['Null'] == "NO"){
                array_push($this->nonNulls, $metaRow["Field"]);
            }
        }
        $this->unwritables = array("version", "owner", "removed", "id", "timestamp", "creator");
        $this->metadata = $this->createMeta();
        
	}

    function __destruct(){
        $this->db = NULL;
    }


    /******************************************* Private Methods *****************************************************/

	/**
	*General use function to start a connection to the db
	*
	*@return {mysqli}
	*@throws Exception when connection fails
	*/
	function connectToDB(){
        try{
            $db = new PDO("mysql:host=".$this->host.";dbname=".$this->database, $this->username, $this->password);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		    return $db;
        }
		catch(PDOException $e){
		    echo "Connection error: ".$e->getMessage().". Could not connect to the database";
            die();
		}
	}

	/**
	*Used to identify which columns of the master table are references to other tables
	*
	*
	*@return {mysqli_result}
	*/
	function getForeignColumns(){
		
        //echo "call to getForeignColumns";
        //var_dump($this->db);

		$columns = $this->db->query("select `column_name`, `referenced_table_name`, `referenced_column_name` from information_schema.KEY_COLUMN_USAGE where `table_schema` = DATABASE() and `table_name` = \"".$this->masterTable."\" and `referenced_table_name` is not null");
		if(!$columns){

            echo "query failed bitch";

			throw new DatabaseError("Query failed, could not fetch metadata. Cannot recover error message due to bad PDO design ");
		}
        
        //var_dump($columns);

        $ans = $this->resultToArray($columns);

        //var_dump($ans);

        
        //var_dump($columns);
        return $ans;
	}

	function resultToArray($pdo_result, $forceNotNull = FALSE){
        //DEBUG STATEMENTS
        //echo "translating the pdo_result object: \n\n";
        //var_dump($pdo_result);

        $resultArray = $pdo_result->fetchAll(PDO::FETCH_ASSOC);


        if(count($resultArray) < 1 && $forceNotNull){
            throw new DatabaseError("Given an empty pdo_result");
        }

        return $resultArray;
	}


	function createFeatureFromRow($row){
		$feature = array(
			"type" => "Feature",
		);


	}

    function getPDOTypeFromMeta($field){
        $type = $this->metadata[$field]['type'];
        $returnval;
        if($type == 'int'){
            $returnval = PDO::PARAM_INT;
        }
        elseif($type == "text" || $type == "varchar"){
            $returnval = PDO::PARAM_STR;
        }
        elseif($type == 'tinyint'){
            $returnval = PDO::PARAM_BOOL;
        }
        return $returnval;
    }


    function createInsertStatement(){
        $query = "INSERT INTO ".$this->masterTable." ";

        $columns = "(";
        $values = "(";
        $binders = array();

        //echo $this->unwritables;
        foreach($this->metadata as $entry => $data){

            //var_dump($entry);

            if(!in_array($entry, $this->unwritables)){
                $columns .= $entry.", ";
                $values .= ":".$entry.", ";
                $binders[$entry] = 0;
            }
        }

        $columns = substr($columns, 0, -2);
        $columns .= ", creator)";
        $values = substr($values, 0, -2);
        $values .= ", :creator)";
        
        $query .= $columns." VALUES ".$values;
        //debug statement
        //echo $query

        $stmt = $this->db->prepare($query);
        $stmt->bindValue(":creator", $this->secManager->getUserID(), PDO::PARAM_INT);
        $statementData = array();
        $statementData['insertstmt'] = $stmt;
        $statementData['bindarray'] = $binders;

        //bind the params to the statement object

        foreach($binders as $name => $link){
            $stmt->bindParam(":".$name, $link, $this->getPDOTypeFromMeta($name)); 
        }

        return $statementData;
    }

    function createUpdateStatement(){
        $query = "UPDATE ".$this->masterTable." SET ";

        $updates = "version = version+1, ";
        $binders = array();
        foreach($this->metadata as $entry => $data){
            if(!in_array($entry, $this->unwritables)){
                $updates .= $entry."=:".$entry.", ";
                $binders[$entry] = NULL;
            }
        }
        $updates = substr($updates, 0, -2);
        $updates .= " WHERE id=:id";
        $query = $query.$updates;
        $stmt = $this->db->prepare($query);
        
        //reiterate over possible fields again to bind them, and in the darkness unite them
        foreach($binders as $name => $link){
            $stmt->bindParam(":".$name, $link, $this->getPDOTypeFromMeta($name));
        }
        //debug statement
        //echo $query;
        //var_dump($stmt);
        

        return array(
            'updatestmt' => $stmt,
            'bindarray' => $binders
        );
    }

	/**
	*
	*
	*@param	featureCollection {string}	a json string that is an array of geoJSON features
	*
	*/
	function writeBatch($featureCollection){

        //debug code
        

		$errorMsg = '';
		$insertLink = $this->createInsertStatement();
		$updateLink = $this->createUpdateStatement();

		//we will start by checking the data correctness as well as we can, and proceed only if no errors are found
		$featureCollection = $featureCollection->features; 

		foreach($featureCollection as $feature){
			$possibleError = $this->checkSingleFeat($feature);
			if($possibleError != ''){
				$errorMsg .= $possibleError."\n";
			}

		}
		//If any error was found, do not proceed with database writes and return the error messages
		if($errorMsg != ""){
			return $errorMsg;
		}
		else{ //no errors found
            //echo "\n\n We are now at the writing stage, errors should be cleared";
			foreach($featureCollection as $checkedFeat){
				//I know we should not have insert errors if the checking code was good, but hey you never know
				//so use a try block to catch all pdo exceptions 

				//but before lets sanitize our (I realize now stupid) convention about singleton arrays
				//foreach($checkedFeat->properties as $data){
				//	if(gettype($data) == 'array'){
				//		$data = $data[0];
				//	}
				//}

                //debug statement
                //echo "Trying to sync this feat: ";
                //var_dump($checkedFeat->properties->isNew);

				try{
					if($checkedFeat->properties->isNew == TRUE && !isset($checkedFeat->properties->id)){
						//this is an INSERT

                        //debug statement
                        //echo "now trying for an insert?";
                        //var_dump($checkedFeat);


						//1.bind all the params in the $insertLink->binders array
						foreach($insertLink['bindarray'] as $name => $link){
                            $datapiece = $checkedFeat->properties->$name;
                            if(gettype($datapiece) == 'array'){

                                //echo "the data ".$name." is actually a singleton array";

                                $checkedFeat->properties->$name = $datapiece[0];
                            }
                            //debug statement
                            //var_dump($checkedFeat->properties->$name);

                            if($checkedFeat->properties->$name == ""){
                                $checkedFeat->properties->$name = NULL;
                            }
							$insertLink['insertstmt']->bindValue(":".$name, $checkedFeat->properties->$name, $this->getPDOTypeFromMeta($name));
						}

                        //debug statement
                        //var_dump($insertLink['insertstmt']);

                        //$insertLink['insertstmt']->bindValue(":coordinate", json_encode($checkedFeat->geometry->coordinate));
                        $insertLink['insertstmt']->bindValue(":coordinates", json_encode($checkedFeat->geometry->coordinates));
                        //debug statement
                        $insertLink['insertstmt']->bindValue(":creator", $this->secManager->getUserId(), PDO::PARAM_INT);
                        $insertLink['insertstmt']->bindValue(":geometry", array_search($checkedFeat->geometry->type, $this->metadata['geometry']['map']), PDO::PARAM_INT);
						//2.then execute the statement
						$insertLink['insertstmt']->execute();
						//3.profit?

					}
					elseif($checkedFeat->properties->isNew == FALSE &&  isset($checkedFeat->properties->id)){
						//this is an UPDATE
                        //debug statement
                        //echo "<br> trying for an update!";


						foreach($updateLink['bindarray'] as $name => $uplink){

                            //debug statement
                            //var_dump($name);
                            //echo "<br><br>we are binding: ".$name;

							$uplink = $checkedFeat->properties->$name;
                            if(gettype($uplink) == 'array'){
                                $checkedFeat->properties->$name = $uplink[0];
                            }

                            $updateLink['updatestmt']->bindValue(":".$name, $checkedFeat->properties->$name, $this->getPDOTypeFromMeta($name));
						}
                        //debug statement
                        //var_dump($checkedFeat->properties);
                        //var_dump($updatetLink['updatestmt']);

                        //dont forget to bind the id!
                        $updateLink['updatestmt']->bindValue(":id", $checkedFeat->properties->id, PDO::PARAM_INT);
                        //since the coordinates do not belong to the properties subobject, add them manually
                        //$updateLink['updatestmt']->bindValue(":coordinate", json_encode($checkedFeat->geometry->coordinate));
                        $updateLink['updatestmt']->bindValue(":coordinates", json_encode($checkedFeat->geometry->coordinates), PDO::PARAM_STR);
                        $updateLink['updatestmt']->bindValue(":geometry", array_search($checkedFeat->geometry->type, $this->metadata['geometry']['map']), PDO::PARAM_INT);
                        //$updateLink['updatestmt']->debugDumpParams();
						$updateLink['updatestmt']->execute();
					}
					else{
						//this kind of error should have been caught by checkSingleFeat
						throw new DatabaseException("could not determine if new or old feature, this should have been caught earlier");
					}
				}
				catch(PDOException $e){
					$errorMsg .= "Error found while writing to database:".$e->getMessage()."/n";
				}
			}
		}
		return $errorMsg;
	}

    function createMeta(){
        $metadata = array();
        $foreigns = $this->getForeignColumns();

        //DEBUG STATEMENTS
        //var_dump($foreigns);

        $foreign_keys = array();
        foreach($foreigns as $row){
            array_push($foreign_keys, $row["column_name"]);
        }

        //debug statement
        //var_dump($foreigns);

        foreach($this->meta as $field){
            $metaEntry = array();
            $fieldname = $field["Field"];
            $fieldType = stristr($field["Type"], "(", TRUE);
            
            if($fieldType != ""){
                $metaEntry["type"] = $fieldType;
            }

            if(in_array($fieldname, $this->internals)){
                $metaEntry["invisible"] = TRUE;
            }
            else{
                $metaEntry["invisible"] = FALSE;
            }

            if(in_array($fieldname, $foreign_keys)){
                //this field is a reference to an entity in another table. find the list of possible entity values
                $targetRow;
                foreach($foreigns as $row){
                    if($row["column_name"] == $fieldname){
                        $targetRow = $row;
                        break;
                    }
                }

                //fill the "values" sub field with the foreign keys
                $referencedTable = $this->resultToArray($this->db->query("select * from `".$targetRow["referenced_table_name"]."`"));
                $referencedID = array();
                foreach($referencedTable as $row){
                    array_push($referencedID, intval($row[$targetRow["referenced_column_name"]]));
                }
                //the keys that will be used as actual values of the <select> elements client-side
                $metaEntry["values"] = $referencedID;

                $map = array();
			    foreach($referencedTable as $row){
                    //REFINE THIS LATER TO LET USERS SPECIFY WHICH COLUMNS USER WANT TO BE RETURNED AS A VALU-MAP
                    //KEEP A META TABLE? A META DOCUMENT? NAMING CONVENTION FOR OUTPUT COLUMNS??
				    $map[(int) $row["id"]] = $row["name"];
			    }


                $metaEntry["map"] = $map;
            
            }
            else{
                // return information about which type of info this is
                //REFINE THIS LATER FOR BETTER TYPECHECKING
                $metaEntry["values"] = "text";
            }

			//create the map between foreign keys and human-readable values
			

            //REFINE THIS AFTER TESTING TO LET USERS KNOW WHICH ENTRIES GET TO USE MULTIPLE VALUES
            $metaEntry["allowMultiple"] = FALSE;
            $metaEntry["acceptsNull"] = TRUE;
            if(array_search($fieldname, $this->nonNulls)){
                $metaEntry['acceptsNull'] = FALSE;
            }


            $metadata[$fieldname] = $metaEntry;
        }

        $metadata["timestamp"] = time();

        //insert the newly created meta JSON string into the 
        $temp = fopen("../tmp/meta.txt", "w");
        fwrite($temp, json_encode($metadata));


        //debug statement
        //var_dump($metadata);
        return $metadata;
    }




    /**
    *checks the validity of a sent GeoJSON object against the provided database description
    *
    *@param $feat   {Object} must be a Object (decoded previously from a GeoJSON string) of an object of the type that make up the "features" array when a call to an ol.format.GeoJSON object is made client-side
    *@return {String}       empty string if all is fine, a collection of error message if data was invalid
    */
    function checkSingleFeat ($feat){

        //echo "\n Preparing to check feature: \n\n";

        $meta = $this->metadata;

        $featObject = $feat;
        $errorString = '';


        //debug statement
        //var_dump($feat);

        //get the right geometry secondary to write in the master table
        $givenGeometryType = $featObject->geometry->type;

        //we should first check that all the properties and geometry types of this representation of ol.feature are accepted in the database
        $geometry = array_search($givenGeometryType, $meta["geometry"]["map"]);
        if($geometry === FALSE){
            $errorString .=  "Did not find requested geometry type ".$givenGeometryType." in the last database report\n";
        }
        // now cycle through all properties, check that the provided meta entry contains the table, as well as the possible value for 2nd order fields
        foreach($featObject->properties as $property => $value){
            if($property != "id" && $property != "isNew"){

                

                //the value, as per our stupid specs (my bad) can be either a literal or an array. the array can contain a single element, in that case extract it
                //if the array contains many elements, check all of them, if it's a literal, check its type
                if(gettype($value) == "array" && count($value) == 1){
                    $value = $value[0];
                }

                //debug statement
                //echo "Validating the field ".$property." of the current feature";
                //echo "this is its value";
                //var_dump($value);

                if(!isset($meta[$property]) && $property != "touched"){
                    $errorString .= "The property: ".$property." is not among the fields in the database\n";
                }
                elseif($value == "" || $value == NULL || $value[0] == NULL){
                    //this field was simply not filled. if it was obligatory, set an error here
                }
                elseif(!isset($meta[$property]["map"])){
                    //we expect literal values, but first check that the type of the value sent corresponds to the MySQL type of the column

                    $supposedType = $meta[$property]["type"];
                    if($value != NULL) {
                        if($supposedType == 'text' || $supposedType == 'varchar'){
                            if(gettype($value) != 'string'){
                                //tried to save something that is not a string to a varchar or text field
                                $errorString .= "the sent value: ".$value." was a ".gettype($value). " but the field ".$property." accepts ".$supposedType;
                            }
                        }
                        elseif($supposedType == 'int' || $supposedType =="tinyint"){
                            if(gettype($value) != "integer"){
                                $errorString .= "expecting a numerical value for field ".$property. " but the sent value ".$value. "is not an int";
                            }
                        }
                    }
                    else{
                        if(!$meta[$property]["acceptsNull"] && !in_array($property, $this->unwritables)){
                            $errorString .= "The field ".$property." does not accept NULL values";
                        }
                    }
                }
                elseif(isset($meta[$property]['map'])){
                    if(gettype($value) == 'array'){

                        //debug statement
                        //echo "we should never see this as long as the program does not support multiple values per field";

                        foreach($value as $fkey){
                            if(array_search($fkey, $meta[$property]['values']) === FALSE){
                                $errorString .= "There is no valid entry with id ".$fkey." in the table of ".$property."\n";
                            }
                        }
                    }
                    else{
                        if(array_search($value, $meta[$property]['values']) === FALSE){
                            $errorString .= "There is no valid entry with id ".$value." in the table of ".$property."\n";
                        }
                    }
                }
            }
        }
        return $errorString;
    }


    /**
    *Returns a JSON string with all the data, ready to be parsed by ol.format.GeoJSON to create actual ol.features
    *
    *
    *
    *
    */
    function getAllData(){

        $skip = array("removed", 'geometry', "coordinate", "coordinates");

        $GeoJSON = array();
        $GeoJSON['type'] = 'FeatureCollection';
        $features = array();

        //perform a hideous query to get all the info
        $dataStmt = $this->db->query("SELECT * FROM ".$this->masterTable." WHERE removed=0");
        $data = $dataStmt->fetchAll(PDO::FETCH_ASSOC);

        foreach($data as $row){

            //debug statement
            //var_dump($row);

            $geoObject = array();
            $geoObject['type'] = "Feature";
            $geometry = array();

            //debug statement
            //var_dump($this->metadata['geometry']['map']);

            $geometry['type'] = $this->metadata['geometry']['map'][$row['geometry']];
            if($row['coordinate'] != NULL){
                $geometry['coordinate'] = json_decode($row['coordinates']);
            }
            elseif($row['coordinates'] !=NULL){
                $geometry['coordinates'] = json_decode($row['coordinates']);
            }

            $geoObject['geometry'] = $geometry;

            $properties = array();
            foreach($row as $field => $val){
                if(!in_array($field, $skip)){
                    if($this->metadata[$field]['type'] == 'int'){
                        $val = intval($val);
                    }
                    if(isset($this->metadata[$field]['map'])){
                        //we need to convert the value to a singleton array
                        $val = array(intval($val));
                    }
                    
                    $properties[$field] = $val;
                }
            }
            $properties['isNew'] = FALSE;
            $geoObject['properties'] = $properties;
            //COMPLETE WITH many-to-many TABLES IN THE FUTURE (get the keys from relationship tables)

            array_push($features, $geoObject);
        }

        $GeoJSON['features'] = $features;

        return $GeoJSON;
    }

    function fillInCoordinates($dataobject){
        $citydata = $this->db->query("SELECT * FROM villes");
        $citydata = $citydata->fetchAll(PDO::FETCH_ASSOC);

        foreach($dataobject['features'] as $index => $point){
            $id = $point['properties']['Ville'][0];
            //echo $id;
            $coordinateString ='';
            foreach($citydata as $cityrow){
                if($cityrow['id'] == $id){
                    $coordinateString = $cityrow['coordonnees'];
                }
            }

            //debug statement
            // echo " <br>found the coordinates";
            
            $coordarray =explode(", ", $coordinateString);

            (float) $coordarray[0];
            //echo "<br>".$coordarray[0];
            (float) $coordarray[1];
            //echo "<br>".$coordarray[1];

            $coordarray[0] = floatval($coordarray[0]);
            $coordarray[1] = floatval($coordarray[1]);

            //invert the coor? maybe that ll solved it
            $temp = $coordarray[0];
            $coordarray[0] = $coordarray[1];
            $coordarray[1] = $temp;


            if($dataobject['features'][$index]['geometry']['coordinates'] == NULL){
                $dataobject['features'][$index]['geometry']['coordinates'] = $coordarray;
            }
            
            // var_dump($dataobject['features'][$index]);
        }

        return $dataobject;
    }


	/*********************************************** Public API **********************************/

	public function getTestMeta(){

		$testInsert = '[{"type":"Feature","geometry":{"type":"Point","coordinates":[3469802.4375206823,2629440.652836424]},"properties":{"isNew":false, "Disque": [1], "Piste":" newtestsong", "Chercheur":[1], "Ville":[1], "Date":1984, "Genre":"chansonTest", "Voix":"voix test", "Accompagnement":null, "Dessine":null, "Groupes":null, "id":253}}]';


	    //echo json_encode($this->createMeta());
        //var_dump($this->createInsertStatement());
        //var_dump($this->createUpdateStatement());

        echo $this->getAllData();
	}

    public function load($fillIn = FALSE){
        $load = array();
        $load['meta'] = $this->metadata;
        $everything = $this->getAllData();
        if($fillIn){
            $everything = $this->fillInCoordinates($everything);
        } 

        //debug statement
        //var_dump($everything);

        $load['data'] = $everything;

        return $load;
    }

    public function sync($req){

        $reply = array();

        $errorString = "";
        $errorString = $this->writeBatch($req['writes']);
        if($errorString != ""){
            $reply['errors'] = "The following problem occurred: ".$errorString.". The database was unchanged. retry?";
            $reply['data'] = NULL;
            return json_encode($reply);
        }
        else{
            $reply['data'] = $this->load();
            $reply['errors'] = FALSE;
            return json_encode($reply);
        }
    }
}
?>


