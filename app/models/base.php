<?php

  ini_set("display_errors", "On");

/* defines */
if(!defined('POT_ROOT')) {
  $project_root = (dirname(dirname(dirname(__FILE__)))."\\");
  $project_root = str_replace('\\', '/', $project_root);
  define("POT_ROOT", $project_root);
}

define('RENDER_SELF', basename($_SERVER['SCRIPT_NAME']),false);

if(!defined('first')) {
  define("first", 10000);
}

if(!defined('last')) {
  define("last", 99999);
}

if(!defined('all')) {
  define("all", 100000);
}

/* print money format */
function print_money($money, $currency = '$') {
  $money = number_format($money, 2, '.', ',');
  return ($currency." ".$money);
}

/* print alphabet */
function print_alphabet($i) {
  return chr($i + 65);
}

class Time {
  static function now() {
    return date('Y-m-d h:i:s', time());
  }
}

class Date {
  private $month_names = array(""     => 0, "January"  => 1, "February" => 2,
                          "March"     => 3, "April"    => 4, "May"      => 5,
                          "June"      => 6, "July"     => 7, "August"   => 8,
                          "September" => 9, "October"  => 10,
                          "November"  => 11,"December" => 12);

  static function today($format = null) {
    (null == $format) ? $today = date('D, d F Y', time()) : $today = date($format, time());
    return $today;
  }

  static function end_of_month($month = null, $year=null){
    if(null == $month) {
      $month_end = date('Y-m-d',mktime(0,0,0,(date('m') + 1),0,date('Y')));
    }
    else{
      $date = new Date();
      $month_value = $date->month_names[$month];
      if(null == $year)
        $month_end = date('Y-m-d',mktime(0,0,0,($month_value + 1),0,date('Y')));

      else
        $month_end = date('Y-m-d',mktime(0,0,0,($month_value + 1),0,$year));
    }
    return $month_end;
  }

  static function beginning_of_month($month = null, $year=null){
    if(null == $month) {
      $month_beginning = date('Y-m-d',mktime(0,0,0,date('m'),1,date('Y')));
    }
    else{
      $date         = new Date();
      $month_value  = $date->month_names[$month];

      if(null == $year)
        $month_beginning = date('Y-m-d',mktime(0,0,0,$month_value,1,date('Y')));

      else
        $month_beginning = date('Y-m-d',mktime(0,0,0,$month_value,1,$year));
    }
    return $month_beginning;
  }
}  

/* Rails like redirect_to method */
function redirect_to ($url, $message = "") {
  if("/" == $url[strlen($url)-1])
    header('Location: ' . $url);
  else
    header('Location: ' . $url.".php");

  if("" != $message) $_SESSION['message'] = $message;

  exit;
}

function render($partial, $path = null) {
  if($path['path'])
    require_once($path['path']."_".$partial.".php");
  else
    require_once("_".$partial.".php");
}

function __autoload($class_name) {
  require str_replace('_', '/', $class_name) . '.php';
}

spl_autoload_register('__autoload');

function dump($object) {
  echo "<pre>";
  print_r($object);
  exit;
}

function pretty_url() {
  #remove the directory path we don't want
  $request  = str_replace("/splc_2/app/views/", "", $_SERVER['REQUEST_URI']);

//    print_r($_SERVER['REQUEST_URI']);

  #split the path by '/'
  $params     = explode("/", $request);
  #keeps users from requesting any file they want
  $safe_pages = array("login", "index", "protection/plan");

  if(in_array($params[0], $safe_pages)) {
    include($params[0].".php");
  } else {
    //include("404.php");
  }
}

function javascript_include_tag($file_name) {
  $file_path  = 'public/javascripts/'. $file_name.'.js';
  $script_tag = "<script type = 'text/javascript' src = ". $file_path ." ></script>\n";
  return $script_tag;
}

function stylesheet_link_tag ($file_name) {
  $file_path  = 'public/stylesheets/'. $file_name.'.css';
  $link_tag   = "<link href = ". $file_path ." rel = 'stylesheet' type = 'text/css' />\n";
  return $link_tag;
}

function image_tag($image, $html_options) {
  $tag = "<img src='public/images/".$image."' ";

  if(is_array($html_options)) {
    foreach($html_options as $key=> $value) {
      $tag .= $key." = '".$value."' ";
    }
  }

  $tag .= "/>\n";

  return $tag;
}

function floatify($float_string) {
  return (double) floatval(preg_replace("/,/","",$float_string));
}

function titleize($string){
  return ucwords(strtolower($string));
}

?>

