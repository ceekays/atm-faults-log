var month_names_options = ["", "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];

/* checks for the presence of a substring in a given string of
  * semi-colon separated substrings.
  * it returns 'true' if found, otherwise it returns 'false'
  *
  * for example :
  *  1. ["programming;in;javascript;is;cool"].contains("javascript") => true
  *  2. ["programming;in;javascript;is;cool"].contains("java") => false
  *
  * TO DO: ADD HANDLING OF 'SPACE' SEPARATED SUBSTRINGS
  */
String.prototype.contains = function (substring) {

  var array_of_strings = this.split(';');

  if (jQuery.inArray(substring, array_of_strings)>= 0)  {
    return true;
  }
  else {
    return false;
  }
}


function displayTab(tabMenu, tabMenuId, tabBody, tabMenuContainer){

  /* inactivate all tab menus */
  function inactivateAlltabs(menu) {
    menu      = document.getElementById(menu);
    tabLinks  = menu.getElementsByTagName('LI');

    for (i = 0; i < tabLinks.length; i++) {
      tabLinks[i].className = '';
    }
  }

  /* hide all tab menus */
  function hideAllTabs(tab) {
    tabData = document.getElementById(tab);
    tabDivs = tabData.getElementsByTagName('DIV');

    for (i = 0; i < tabDivs.length; i++) {
      tabDivs[i].style.display = 'none';
    }
  }

  /* activate a tab*/
  function doShow(menu, menuId) {
    hideAllTabs(tabMenuContainer);
    inactivateAlltabs(tabBody);
    menu.className = 'activated';
    tabData = document.getElementById(menuId);
    tabData.style.display = 'block';
    return false;
  }

  doShow(tabMenu, tabMenuId);
}

function confirmRecordDeletion(message, form) {    
  if(!tstMessageBar){
    var tstMessageBar = document.createElement("div");
    tstMessageBar.id = "messageBar";
    tstMessageBar.className = "messageBar";

    tstMessageBar.innerHTML = message + "<br/>" +
    "<button onmousedown=\"document.getElementById('content').removeChild(document.getElementById('messageBar'));\"><span>OK</span></button>";

    tstMessageBar.style.display = "block";
    document.getElementById("content").appendChild(tstMessageBar);
        
    return false;
  }
  return false;
}

String.prototype.capitalize = function(){
  var titleized_string = new Array();

  if( (this.length > 0)){
    titleized_string.push(this.charAt(0).toUpperCase());
    titleized_string.push(this.substring(1,this.length).toLowerCase());
    return titleized_string.join("");
  }

  else{
    return this;
  }
}

String.prototype.titleize = function(){
  var titleized_string = new Array();
  var sub_strings = this.split(" ");

  for(i = 0; i < sub_strings.length; i++)
    titleized_string.push(sub_strings[i].capitalize());

  return titleized_string.join(" ");
}

function showProgressBar(id){
  var info, element;

  if(typeof(custom_message) == "undefined"){
    custom_message="The system is processing your request.";
  }

  info = "<div id='popupBox'  align='center'>";
  info += "<p id='p1'>"+custom_message+"</p>";
  info += "<p id='p2'>Please wait......</p>";
  info += "</div>";

  element = document.getElementById(id);
  element.innerHTML += info;

  alert(element.innerHTML);

}

function applyFormattingStyle(tableId, tableData){

  var tableRow      = tableData.parentNode.parentNode;

  var image;    /* image handler */
  var radio;    /* the hidden radio button */
  var thisRow;  /* the row that has been selected */

  /* get to the tr attribute */
  var rows = document.getElementById(tableId).children[0].children;

  /* reset all rows except the first one: which is the header */
  for (i = 1; i < rows.length; i++) {
    var tr      = rows[i].children;
    var rowSize = tr.length;
    var size    = rows.length;

    /* reset all cells in this row */
    for (j = 0; j < size; j++){
      tr[j].className = "box-table";

      if(j == 3){
        tr[j].className = "fakecheckbox  box-table";
        image           = tr[j].getElementsByTagName('img');
        image[0].src    = "public/images/radio_unchecked.png";
        radio           = tr[j].getElementsByTagName('input');

        if(radio[0].type == "radio"){
          radio[0].checked = false;
              
        }
      }
    }
  }

  /* add formatting to the checked row*/
 

  thisRow = tableRow.children;
  rowSize = thisRow.length;

  for (j = 0; j < rows.length; j++){

    thisRow[j].className = "clicked";

    if(j == 3){
      image                 = thisRow[j].getElementsByTagName('img');
      image[0].src          = "public/images/radio_checked.png";
      radio                 = thisRow[j].getElementsByTagName('input');
      thisRow[j].className  = "fakecheckbox clicked";

      if(radio[0].type == "radio"){
        radio[0].checked = true;
      }
    }
  }

}

function populate(){
  var beneficiaryName;
  var beneficiaryPhone;

  var beneficiaryNameId;
  var beneficiaryPhoneId;

  var beneficiaryRefName;
  var beneficiaryRefPhone;

  var submit = false;
  var message;

  var  scheme_type_id = document.getElementById("scheme_type_id");
  
  if("" == scheme_type_id.value){
    alert("You have not selected a scheme type. Please tick as appropriate!");
    return false;
  }
   
  for(var i = 0; i < 4; i++){
    beneficiaryNameId   = "beneficiary_name_"  + (i + 1);
    beneficiaryPhoneId  = "beneficiary_phone_" + (i + 1);

    beneficiaryName     = document.getElementById(beneficiaryNameId);
    beneficiaryPhone    = document.getElementById(beneficiaryPhoneId);

    beneficiaryRefName  = "beneficiary_full_name_"     + (i + 1);
    beneficiaryRefPhone = "beneficiary_phone_number_"  + (i + 1);

    beneficiaryRefName  = document.getElementById(beneficiaryRefName);
    beneficiaryRefPhone = document.getElementById(beneficiaryRefPhone);

    if(("" != beneficiaryName.value) && ("" == beneficiaryPhone.value)){
      message = "'" + beneficiaryName.value +"' has no associated phone number. Please check!";
      alert(message);
      return false;
      
    }
    else if(("" == beneficiaryName.value) && ("" != beneficiaryPhone.value)){
      message = "The phone number '" + beneficiaryPhone.value +"' has no associated beneficiary name. Please check!";
      alert(message);
      return false;
    }
    else if(("" != beneficiaryName.value) && ("" != beneficiaryPhone.value)){
      beneficiaryRefName.value  = beneficiaryName.value;
      beneficiaryRefPhone.value = beneficiaryPhone.value;
      submit = true;
    }
    
  }

  if(!submit) alert("There are no beneficiaries. Please check!");

  if(submit) document.newSchemeDetails.submit();
  

  return submit;
}

/* a fix indexOf() function for Arrays in IE browsers*/
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
    ? Math.ceil(from)
    : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
        this[from] === elt)
        return from;
    }
    return -1;
  };
}

Object.prototype.update = function(key, value){
  this[key] = value;
  return this[key];
}

Object.prototype.indexOf = function (thisKey) {
  var i = 0;
  for (eachKey in this) {
    ++i;
    if(eachKey === thisKey){
      return i;
    }
  }
  return -1;
}

Object.prototype.numberOfKeys = function () {
  var i = 0;
  for (key in this) {
    i++;
  }
  return i;
}
/*
  Dean Povey's brute-force hack to compare two Associative Arrays in Javascript
  url: http://stackoverflow.com/questions/1107237/compare-two-arrays-javascript-associative
 */
Object.prototype.equals = function(array) {
  if (this === array) {
    return true;
  }
  if (this.numberOfKeys() != array.numberOfKeys()) {
    return false;
  }
  for (key in this) {
    if (this[key] != array[key]) {
      return false;
    }
  }
  return true;
}

function setSelectedIndex(id, value) {
  var element;

  element = document.getElementById(id);

  // Loop through all the items in the list
  for (i = 0; i< element.options.length; i++) {
    if (element.options[i].value == value) {
      element.options[i].selected = true;
      break;
    }
    else if (element.options[i].text == value) {
      element.options[i].selected = true;
      break;
    }
  }
  return;
}

function createDynamicForm(){

}

Date.prototype.toMySQLDateTime =  function() {
  var year, month, day, hours, minutes, seconds;
  year = String(this.getFullYear());
  month = String(this.getMonth() + 1);
  if (month.length == 1) {
    month = "0" + month;
  }
  day = String(this.getDate());
  if (day.length == 1) {
    day = "0" + day;
  }
  hours = String(this.getHours());
  if (hours.length == 1) {
    hours = "0" + hours;
  }
  minutes = String(this.getMinutes());
  if (minutes.length == 1) {
    minutes = "0" + minutes;
  }
  seconds = String(this.getSeconds());
  if (seconds.length == 1) {
    seconds = "0" + seconds;
  }
  // should return something like: 2011-06-16 13:36:00
  return year + "-" + month + "-" + day + ' ' + hours + ':' + minutes + ':' + seconds;
}

String.prototype.toDayMonthYear = function(){
  var monthNames;
  var dateString;

  monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  dateString = this.split("-");
  
  return (dateString[2] + " " + monthNames[parseInt(dateString[1]) - 1] + " " + dateString[0]);
}

/* display beneficiaries list */
function showBeneficiaries(beneficiaries){
  var beneficiary_name;
  var beneficiary_phone;
  var beneficiary_id;
  var maxSize = beneficiaries.length;
  
  for(var i = 0; i < maxSize; ++i){
    beneficiary_name  = document.getElementById('beneficiary_name_'+(i + 1));
    beneficiary_phone = document.getElementById('beneficiary_phone_'+(i + 1));
    beneficiary_id    = document.getElementById('beneficiary_id_'+(i + 1));

    beneficiary = beneficiaries[i];

    beneficiary_name.value  = beneficiary['full_name'];
    beneficiary_phone.value = beneficiary['phone_number'];
    beneficiary_id.value    = beneficiary['id'];

    beneficiary_name.style.backgroundColor="#2DBF37";
    beneficiary_name.style.color="#FFFFFF";
    beneficiary_phone.style.backgroundColor="#2DBF37";
    beneficiary_phone.style.color="#FFFFFF";
  }

  return maxSize;
}

Object.prototype.dump = function (){
  return JSON.stringify(this);
}

function update_scheme_type(scheme_type){
  var  scheme_type_id = document.getElementById("scheme_type_id");

  scheme_type_id.value = scheme_type;
}

function hide(id){
  var element = document.getElementById(id);

  if(element)
    element.style.visibility = 'hidden';
}

function show(id){
  var element = document.getElementById(id);

  if(element)
    element.style.visibility='visible';
}


Object.prototype.isEmpty = function () {
  for(var i in this) {
    if(this.hasOwnProperty(i))
      return false;
  }
  return true;
}

/* name, select_options, html_options */
function select_field(name, select_options, html_options){
  var select_tag;
  var select_option;
  var option;
  var size;

  select_tag = document.createElement("select");

  select_tag.setAttribute('name',name);

  if("undefined" != typeof(html_options)){
    for(attribute in html_options){
      select_tag.setAttribute(attribute, html_options[attribute]);
    }
  }

  size = select_options.length;
  /* create options elements */
  for(var i = 0; i < size; i++){
    select_option = select_options[i];
    if((select_option instanceof Array) && (2 == select_option.length))
      option = new Option(select_option[0], select_option[1]);
    else
      option = new Option(select_option, select_option);
    select_tag.appendChild(option);
  }

  return select_tag;
}

function select_field_tag(name, select_options, html_options){
  var select_field_tag;

  select_field_tag = select_field(name, select_options, html_options);
  document.write("<span id='" + name + "'></span>");
  document.getElementById(name).appendChild(select_field_tag);
}

function getBaseURL() {
  var url = location.href;  // entire url including querystring - also: window.location.href;
  var baseURL = url.substring(0, url.indexOf('/', 14));


  if (baseURL.indexOf('http://localhost') != -1) {
    // Base Url for localhost
    url = location.href;  // window.location.href;
    var pathname = location.pathname;  // window.location.pathname;
    var index1 = url.indexOf(pathname);
    var index2 = url.indexOf("/", index1 + 1);
    var baseLocalUrl = url.substr(0, index2);

    return baseLocalUrl + "/";
  }
  else {
    // Root Url for domain name
    return baseURL + "/";
  }
}

function setDefaultText(textFieldId, default_text){
  var textField = document.getElementById(textFieldId);

  recallOnClick(textField, default_text); // initialize the textbox
  textField.setAttribute('onClick', "clearOnClick(this, '"+ default_text +"')");
  textField.setAttribute('onBlur',"recallOnClick(this, '" + default_text +"')");
}

// clear the field when clicked
function clearOnClick(field, default_text) {
  if (field.value == default_text){
    field.value           = "";
    field.style.fontStyle = null;
    field.style.color     = null;
  }
}

// retain the default text if empty
function recallOnClick(field, default_text){
  if (field.value == ""){
    field.value           = default_text;
    field.style.fontStyle = "italic";
    field.style.color     = "gray";
  }
}

