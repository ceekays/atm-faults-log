<?php
/**********************************************************************
 *      db_connect.php                                                *
 *                                                                    *
 *      DBConnect - a Rails-like ActiveRecord library for PHP         *
 *                                                                    *
 *      connects business objects and database tables to create a     *
 *      persistable domain model where logic and data are             *
 *      presented in one wrapping                                     *
 *                                                                    *
 *      https://github.com/ceekays/dbconnect                          *
 *                                                                    *
 **********************************************************************
 *                                                                    *
 *      Created on July 26, 2011                                      *
 *      by Edmond C. Kachale (Malawi)                                 *
 *      (kachaleedmond [at] gmail [dot] com)                          *
 *                                                                    *
 **********************************************************************
 * This library is free software: you can redistribute it and/or      *
 * modify it under the terms of the GNU General Public License as     *
 * published by the Free Software Foundation, either version 3 of the *
 * License, or (at your option) any later version.                    *
 *                                                                    *
 * This library is distributed in the hope that it will be useful,    *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of     *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the      *
 * GNU General Public License for more details.                       *
 *                                                                    *
 * You should have received a copy of the GNU General Public License  *
 * along with this library. If not, see http://www.gnu.org/licenses/  *
 *                                                                    *
 **********************************************************************/

class DBConnect {
  //database setup
  private $dbHostname   = '';
  private $dbName       = '';
  private $dbUsername   = '';
  private $dbPassword   = '';
  private $dbConnection = null;

  private $cond_str     = '';
  private $config       = '';

  protected $conditions = array();
  protected $associates = array();

  public  $dbTable      = '';
  public  $tbPrimaryKey = 'id'; // default primary key name

  public $first         = '';
  public $last          = '';
  public $done          = false;
  
  public function DBConnect() {
    $this->config = Horde_Yaml::loadFile(POT_ROOT.'config/database.yml');
    $env = $this->config['env'];
    $env = $this->config[$env];
    $this->dbHostname = $env['host'];
    $this->dbName     = $env['database'];
    $this->dbUsername = $env['username'];
    $this->dbPassword = $env['password'];
  }

  // setup information
  function setup() {
    $setup_info = array('host' => $this->dbHostname, 'database' => $this->dbName,
            'table' => $this->dbTable, 'username' => $this->dbUsername,
            'password' => $this->dbPassword);
    return $setup_info;
  }

  // define the table for a class model
  function set_table_name($table) {
    $this->dbTable = $table;
  }

  // define the primary key for a class model
  function set_primary_key($primary_key) {
    $this->tbPrimaryKey = $primary_key;
  }

  // relationship mapping
  function has_one($object) {
    $this->associates[] = $object;
    $class  = str_replace('_', ' ', $object);
    $class  = ucwords($class);
    $class  = str_replace(' ', '', $class);
    $this->{$object} = new $class();
  }

  //connect to database
  function db_connect() {
    $this->dbConnection = mysql_connect($this->dbHostname, $this->dbUsername,
                    $this->dbPassword) or die ('Unable to connect to the database!');
    mysql_select_db($this->dbName) or die ('Unable to select database!');
    return;
  }

  /*
      retrieves first occurrence of a dataset from a table using custom sql.
      It helps prevent SQL injections by passing variables as parameters
      ex: find_by_sql("SELECT * FROM ? WHERE username ='?';" ,$table, $username)
  */
  function find_by_sql($query) {
    $args  = func_get_args();
    $query = array_shift($args);
    $query = str_replace("?", "%s", $query);
    $args  = array_map('mysql_real_escape_string', $args);
    array_unshift($args,$query);
    $query  = call_user_func_array('sprintf',$args);
    $this->db_connect();
    $result = mysql_query($query) or die(mysql_error());
    $result = mysql_fetch_assoc($result);
    if(!$result) {
      return null;
    }
    $this->done = true;
    // map each field to its value
    foreach ($result as $key => $value) {
      $this->{$key} = $value;
    }
    foreach($this->associates as $associate) {
      $key    = $this->tbPrimaryKey;
      $value  = $this->{$key};
      $this->{$associate}->find_by_attribute(array($key=>$value));
    }
    return $this;
  }

  /*  
      retrieves all occurrences of datasets from a table using custom sql. 
      It helps prevent SQL injections by passing variables as parameters
      ex: find_all_by_sql("SELECT * FROM ? WHERE username ='?';" ,
          $table, $username)
  */
  function find_all_by_sql($query) {
    $object = null;
    $args  = func_get_args();
    $query = array_shift($args);
    $query = str_replace("?", "%s", $query);
    $args  = array_map('mysql_real_escape_string', $args);
    array_unshift($args,$query);
    $query  = call_user_func_array('sprintf',$args);
    $this->db_connect();
    $qry_result = mysql_query($query) or die(mysql_error());
    if(!$qry_result) return null;
    $this->done = true;
    $results = array();
    while($db_field = mysql_fetch_assoc($qry_result)) {
      $results[] = $db_field;
    }
    // map each field to its value
    foreach ($results as $result) {
      $class = get_class($this);
      $object = $this->{$this->dbTable}[] = new $class();
      foreach ($result as $key => $value) {
        $object->{$key} = $value;
      }
    }
    if(isset($this->{$this->dbTable})) {
      $objects      = $this->{$this->dbTable};
      $this->first  = $objects[0];
      $this->last   = $objects[count($objects) - 1];
    }else {
      $this->first  = null;
      $this->last   = null;
    }
    foreach($this->associates as $associate) {
      $key    = $this->tbPrimaryKey;
      if(isset($this->{$key})) {
        $value  = $this->{$key};
        $this->{$associate}->find_by_attribute(array($key=>$value));
      }
    }
    return $this;
  }

  /*  
      retrieves datasets from a table using in-built DBConnet parameters:
      first, last, all. It also accepts an id
      TODO: still under development: to add handling of more other options
  */
  function find($query) {
    $args  = func_get_args();
    $query = array_shift($args);
    // get table conditions
    $this->append_default_conditions();
    if(is_string($query)) {

      if($query == "first") {

        $result = $this->find_by_sql("SELECT * FROM ? ".$this->cond_str."",
                  $this->dbTable);
        //if($result == -1) $result = "Unable to find the first record in '".
        //$this->dbTable."' table.";
        return $result;
      }
      elseif($query == "last") {
        $result = $this->find_by_sql("SELECT * FROM ? ".$this->cond_str.
                  " ORDER BY ? DESC", 
                  $this->dbTable, $this->tbPrimaryKey );
        //if($result == -1) $result = "Unable to find the last record in '".
        //$this->dbTable."' table.";
        return $result;
      }
      elseif($query == "all") {
        $result = $this->find_all_by_sql("SELECT * FROM ? ".
                  $this->cond_str." ORDER BY ? ",
                  $this->dbTable, $this->tbPrimaryKey);
        //if($result == -1) $result = "Unable to get records in '"
        //.$this->dbTable."' table.";
        return $result;
      }
    }
    // find by id
    if(is_int($query)) {
      if ($this->cond_str == "") {
        $this->cond_str = "WHERE ".mysql_real_escape_string($this->tbPrimaryKey).
                          " = '".mysql_real_escape_string($query)."' ";
      }
      else {
        $this->cond_str .= " AND ".mysql_real_escape_string($this->tbPrimaryKey).
                          " = '".mysql_real_escape_string($query)."' ";
      }
      $query = "SELECT * FROM ? ".$this->cond_str."";
      $result = $this->find_by_sql($query, $this->dbTable);
      //if($result == -1) $result = "Unable to find a record in '".
      //$this->dbTable."' table with ".$this->tbPrimaryKey." = ".$query;
      return $result;
    }
  }
  
  /*
    find dataset satisfying some conditions. 
    Expects an associated array:
      array(key => value)
  */

  function find_by_attribute($attributes, $rows = null) {
    $this->db_connect();

    $attr_conditions = $this->append_attributes($attributes);
    // get table conditions
    $this->append_default_conditions();
    if ($this->cond_str == "") {
      $this->cond_str = "WHERE ".$attr_conditions;
    }
    else {
      $this->cond_str .= " AND ".$attr_conditions;
    }
    $query = "SELECT * FROM ? ".$this->cond_str;
    if(in_array($this->tbPrimaryKey, array_keys($attributes)))
      $result = $this->find_by_sql($query, $this->dbTable);
    else {
      if(null != $rows) {
        switch($rows) {
          case first:
            $result = $this->find_by_sql($query, $this->dbTable);
            break;
          case last:
            $result = $this->find_all_by_sql($query, $this->dbTable)->last;
            break;
          default:
            $result = $this->find_all_by_sql($query, $this->dbTable);
            break;
        }
      }
      else
        $result = $this->find_all_by_sql($query, $this->dbTable);
    }

    return $result;
  }

  /*
    find the first dataset satisfying some conditions. 
    Expects an associated array:
      array(key => value)
  */
  function find_first_by_attribute($attributes) {
    $this->db_connect();

    $attr_conditions = $this->append_attributes($attributes);
    // get table conditions
    $this->append_default_conditions();
    if ($this->cond_str == "") {
      $this->cond_str = "WHERE ".$attr_conditions;
    }
    else {
      $this->cond_str .= " AND ".$attr_conditions;
    }
    $query  = "SELECT * FROM ? ".$this->cond_str;
    $result = $this->find_by_sql($query, $this->dbTable);
    //if($result == -1) $result = "Unable to find a record in '".
    //$this->dbTable."' table with ".$key." = ".$value;
    return $result;
  }

    /*
    inserts data into a table. Expects an associated array:
      array(key => value)
  */  
  function create($attributes) {
    $result = null;
    if(!is_array($attributes)) {
      $result = null;
    }
    else {
      $keys           = array_keys($attributes);
      $keys_string    = "";
      $values_string  = "";
      // escape the values
      foreach($keys as $key) {
        $keys_string    .= mysql_real_escape_string($key).",";
        $values_string  .= "'".mysql_real_escape_string($attributes[$key])."',";
      }
      $keys_string    = substr_replace($keys_string,"",-1);
      $values_string  = substr_replace($values_string,"",-1);
      $query  = "INSERT INTO %s (%s) VALUES (%s)";
      $query  = sprintf($query, $this->dbTable, $keys_string, $values_string);
      if(mysql_query($query)) {
        //$result = mysql_insert_id();
        $result = $this->find(mysql_insert_id());
      }
      else {
        $result = null; // "Unable insert data into '".$this->dbTable."' table.";
      }
    }
    return $result;
  }
  
  /*
    modifies data in a table using id. Expects an associated array:
      array(key => value)
  */ 
  function save($attributes) {
    $result = null;
    $this->db_connect();

    if(!is_array($attributes)) {
      $result = -1;
    }
    else {
      $keys   = array_keys($attributes);
      $string = "";
      // escape the values
      foreach($keys as $key) {
        if($key != $this->tbPrimaryKey)
          $string    .= mysql_real_escape_string($key)." = '".
                        mysql_real_escape_string($attributes[$key])."', ";
      }
      $string = substr_replace($string,"",-2);
      $query  = "UPDATE %s SET %s WHERE %s = %s";
      $query  = sprintf($query, $this->dbTable, $string, $this->tbPrimaryKey,
                $attributes[$this->tbPrimaryKey]);

      if(mysql_query($query)) {
        //$result = mysql_insert_id();
        $result = $this->find(mysql_insert_id());
      }
      else {
        $result = null; // "Unable insert data into '".$this->dbTable."' table.";
      }
    }
    return $result;
  }

  /*
    voids data into a table
  */ 
  function void($user_id, $reason = "Voided!") {
    $this->db_connect();
    $id = $this->{$this->tbPrimaryKey};

    $query      = "UPDATE %s SET voided = 1, voided_by = %s,".
                  " void_reason = '%s' WHERE %s = %s";
    $query      = sprintf($query, $this->dbTable, $user_id, $reason,
                  $this->tbPrimaryKey, $id);
    $qry_result = mysql_query($query) or die(mysql_error());
  }

  //private method. no doc
  private function append_default_conditions() {
    $this->cond_str = "";
    $this->db_connect();
    if(!empty($this->conditions)) {
      $keys           = array_keys($this->conditions);
      $keys_length    = (count($keys) - 1);
      $this->cond_str = "WHERE ";
      // escape the values
      for($i = 0; $i <= $keys_length; ++$i) {
        $this->cond_str .= mysql_real_escape_string($keys[$i])." = '".
                            mysql_real_escape_string($this->conditions[$keys[$i]])."' ";
        if($i != $keys_length) {
          $this->cond_str .= "AND ";
        }
      }
    }
    return $this->cond_str;
  }

  //private method. no doc
  private function append_attributes($attributes) {
    $cond_string = "";
    $this->db_connect();
    if(!empty($attributes)) {
      $keys         = array_keys($attributes);
      $keys_length  = (count($keys) - 1);
      // escape the values
      for($i = 0; $i <= $keys_length; ++$i) {
        $cond_string .= mysql_real_escape_string($keys[$i])." = '".
                        mysql_real_escape_string($attributes[$keys[$i]])."' ";
        if($i != $keys_length) {
          $cond_string .= "AND ";
        }
      }
    }
    return $cond_string;
  }
}
?>

