/**********************************************************************
 *	 ajax_parser.js                                                   *
 *                                                                    *
 *      This script creates a custom alert box by overriding          *
 *      the default window.alert method of a browser                  *
 *                                                                    * 
 *      dependencies:                                                 *
 *        - alert.css                                                 *
 *			                                                          *
 *                                                                    *
 **********************************************************************
 *                                                                    *
 *      Created on July 27, 2011                                      *
 *      by Edmond C. Kachale (Malawi)                                 *
 *                                                                    *
 **********************************************************************/

var ajaxRequest = createAJAXRequest();

function createAJAXRequest() {
  var request;
  if(window.XMLHttpRequest) {
    try {
      request = new XMLHttpRequest();
    } 
    catch(e) {
      request = false;
    }
  } 
  else if(window.ActiveXObject) {
    try {
      request = new ActiveXObject("Msxml2.XMLHTTP");
    } 
    catch(e) {
      try {
        request = new ActiveXObject("Microsoft.XMLHTTP");
      }
      catch(e) {
        request = false;
      }
    }
  }
  return request;
}

function handleServerResponse() {
  var response;

  //if(ajaxRequest.readyState == 4)
  {
    response = ajaxRequest.responseText;
    
    alert(ajaxRequest.readyState);
    return true;
  }

  alert("Unable to save changes that you made!");
  return false;
}

function processForm(form) {
  var element         = "";
  var elementName     = "";
  var elementRequired = "";
  var elementType     = "";
  var elementValue    = "";
  var params          = "";

  var formSize = form.elements.length;

  for(var i = 0; i < formSize; i++) {

    element         = form.elements[i];
    elementRequired = element.required;
    elementValue    = element.value;
    elementName     = element.name;
    elementType     = element.type;

    switch(elementType) {
      case "text":
      case "hidden":
      case "password":
      case "textarea":
        // is it a required field?
        if(elementRequired == "true" && elementValue.length < 1) {
          alert("'" + elementName + "' is required, please complete.");
          element.focus();
          return false;
        }
        params += elementName + "=" + encodeURI(elementValue) + "&";
        break;

      case "checkbox":
      case "radio":
        if(element.checked){
          params += elementName + "=" + encodeURI(elementValue) + "&";
        }
        break;

      case "select-one":
        index   = element.selectedIndex;
        params  += elementName + "=" + element.options[index].value + "&";
        break;
    } // switch
  } // for

  params = params.substr(0,(params.length - 1)); // remove the trailing '&'
  return params;
}

function sendRequest(form, url, method) {
  var params = "";
  if(("" == method) || (typeof(method) == "undefined")) method = "GET";

  // TODO: remove this object monkey-patching by creating a form on the fly
  if("object" == typeof(form)) {
    params = "person" + "=" + encodeURI(JSON.stringify(form));
  }
  else{
    params  = processForm(form);
  }
 
  if("" != params) {
    if(method == 'GET'){
      ajaxRequest.open(method, url + '?' + params);
      ajaxRequest.onreadystatechange = handleServerResponse;
      ajaxRequest.send(null);
    }
    else{
      ajaxRequest.open(method, url, true);
      // adding some http headers that set along with any POST request
      ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      ajaxRequest.setRequestHeader("Content-length", params.length);
      ajaxRequest.setRequestHeader("Connection", "close");

      ajaxRequest.onreadystatechange = handleServerResponse;
      ajaxRequest.send(params);
    }
  }
  return true;
}
