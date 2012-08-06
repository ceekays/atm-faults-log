/**********************************************************************
 *		alert.js                                                      *
 *                                                                    *
 *      This script creates a custom alert box by overriding          *
 *      the default window.alert method of a browser                  *
 *                                                                    * 
 *      dependencies:                                                 *
 *        - alert.css                                                 *
 *		                                                              *
 *                                                                    *
 **********************************************************************
 *                                                                    *
 *      Created on July 27, 2011                                      *
 *      by Edmond C. Kachale (Malawi)                                 *
 *                                                                    *
 **********************************************************************/

var defaultMsgBoxTitle  = "Oops!";
var defaultMsgBoxStyle  = "OK";

// over-ride the alert method only if this a newer browser.
// Older browser will see standard alerts
if(document.getElementById) {
  window.alert = function(message) {
    dispatchMessage(message);
  }
}

function dispatchMessage(message, msgBoxStyle, msgBoxTitle) {

  msgBoxTitle = (!msgBoxTitle) ? defaultMsgBoxTitle : msgBoxTitle;
  msgBoxStyle = (!msgBoxStyle) ? defaultMsgBoxStyle : msgBoxStyle;

  if(document.getElementById("msgBoxContainer")) return;

  var container   = document.getElementsByTagName("body")[0].appendChild(document.createElement("div"));
  var alertBox    = container.appendChild(document.createElement("div"));
  var titleBar    = alertBox.appendChild(document.createElement("h1"));
  var messageBox  = alertBox.appendChild(document.createElement("p"));

  container.id = "msgBoxContainer";

  container.style.height = document.documentElement.scrollHeight + "px";

  alertBox.id = "alertBox";
  
  // MSIE doesnt treat position:fixed correctly, so this compensates for positioning the alert
  if(document.all && !window.opera) 
    alertBox.style.top = document.documentElement.scrollTop + "px";
  // center the alert box
  //alertBox.style.left = (document.documentElement.scrollWidth - alertBox.offsetWidth)/2 + "px";

  titleBar.appendChild(document.createTextNode(msgBoxTitle));
  messageBox.innerHTML = message;
  
  // create an anchor element to use as the confirmation button.
  confirmButton       = alertBox.appendChild(document.createElement("a"));
  confirmButton.id    = "confirmButton";
  confirmButton.href  = "#";

  confirmButton.appendChild(document.createTextNode(msgBoxStyle));

  // set up the onclick event to remove the alert when the anchor is clicked
  confirmButton.onclick = function() { 
    hideMessage();
    return false;
  }
}

function hideMessage() {
  document.getElementsByTagName("body")[0].removeChild(document.getElementById("msgBoxContainer"));
  return false;
}


