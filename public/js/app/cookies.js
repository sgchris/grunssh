/**
 * Mozilla little cookies framework
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
 * 
 * usage:
 * 	docCookies.getItem: function(sKey)
 * 	docCookies.setItem: function(sKey, sValue, vEnd, sPath, sDomain, bSecure)
 * 	docCookies.removeItem: function(sKey, sPath, sDomain)
 * 	docCookies.hasItem: function(sKey)
 * 	docCookies.keys: function()
 */
var docCookies={getItem:function(a){return a?decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*"+encodeURIComponent(a).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*([^;]*).*$)|^.*$"),"$1"))||null:null},setItem:function(a,c,b,e,f,g){if(!a||/^(?:expires|max\-age|path|domain|secure)$/i.test(a))return!1;var d="";if(b)switch(b.constructor){case Number:d=Infinity===b?"; expires=Fri, 31 Dec 9999 23:59:59 GMT":"; max-age="+b;break;case String:d="; expires="+b;break;case Date:d="; expires="+
b.toUTCString()}document.cookie=encodeURIComponent(a)+"="+encodeURIComponent(c)+d+(f?"; domain="+f:"")+(e?"; path="+e:"")+(g?"; secure":"");return!0},removeItem:function(a,c,b){if(!this.hasItem(a))return!1;document.cookie=encodeURIComponent(a)+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT"+(b?"; domain="+b:"")+(c?"; path="+c:"");return!0},hasItem:function(a){return a?(new RegExp("(?:^|;\\s*)"+encodeURIComponent(a).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=")).test(document.cookie):!1},keys:function(){for(var a=
document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g,"").split(/\s*(?:\=[^;]*)?;\s*/),c=a.length,b=0;b<c;b++)a[b]=decodeURIComponent(a[b]);return a}};
