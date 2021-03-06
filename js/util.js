/*global jQuery, $ */

if(typeof global !== "undefined")
{
    var global = window;
}

if(typeof UTIL === "undefined")
{
    var UTIL = {};
}

UTIL.randomBetween = function (min, max)
{
    return min + Math.floor(Math.random() * (max - min + 1));
}; // end UTIL.randomBetween = function (min, max)

UTIL.roundTo = function (number, places)
{
    return isNaN(parseFloat(number)) ? NaN : number.toFixed(places);
}; // end UTIL.roundTo = function (number, places)

UTIL.readyForRegExp = function (textIn)
{
    var textOut = "";
    var charIn = "";
    var regExpChar = "\\^$*+?.[]-{}()|";

    for(var i = 0; i < textIn.length; ++i)
    {
        charIn = textIn.charAt(i);
        if(regExpChar.indexOf(charIn) !== -1)
        {
            textOut += "\\" + charIn;
        }
        else
        {
            textOut += charIn;
        }
    }
    return textOut;
}; // end UTIL.readyForRegExp = function (textIn)

UTIL.getValueFromURL = function (urlNameIn)
{
    var urlValue = "";
    var urlName = UTIL.readyForRegExp(urlNameIn);
    var search = UTIL.trim(location.search);
    if(search === "")
    {
        return "";
    }

    // [\?&]open=(\w+)&?
    var pattern = new RegExp("[\\?&]" + urlName + "=(\\w+)&?");

    urlValue = "";
    if(pattern.test(search))
    {
        urlValue = RegExp.$1;
    }
    return urlValue;
}; // end UTIL.getValueFromURL = function (urlNameIn)

UTIL.trim = function (stringIn)
{
    if(stringIn === "" || stringIn === null)
    {
        return "";
    }
    else
    {
        //return stringIn.replace(/^\s*/, "").replace(/\s*$/, "");
        return stringIn.replace(/^\s+/, "").replace(/\s\s*$/, "");
    }
}; // end UTIL.trim = function (stringIn)

UTIL.setCookie = function(cookieName, value, expireDays, secure, path)
{
    var expDate = new Date();
    var expiresResult = "";
    if(expireDays === 0)
    {
        // session cookie
        expiresResult = "";
    }
    else
    {
        expDate.setDate(expDate.getDate() + expireDays);
        expiresResult = "; expires=" + expDate.toGMTString();
    }

    var secureResult = "";
    if(secure === undefined)
    {
        secureResult = "";
    }
    else if(secure === true)
    {
        secureResult = "; secure";
    }
    else
    {
        secureResult = "";
    }

    var pathResult = "";
    pathResult = "; path=" + path;
    document.cookie = UTIL.trim(cookieName) + "=" + encodeURIComponent(value) + expiresResult + secureResult + pathResult;

    expDate = null;
}; // end UTIL.setCookieWithPath = function(cookieName, value, expireDays, secure, path)

UTIL.eraseCookie = function(cookieName)
{
    UTIL.setCookie(cookieName, "", -1);
}; // end UTIL.eraseCookie = function(cookieName)

UTIL.getCookie = function (searchName)
{
    var cookies = document.cookie.split(";");
    var found = false;
    var cookieCrumbs = [];
    var cookieName = "";
    var cookieValue = "";

    for(var i = 0; i < cookies.length && !found; i++)
    {
        cookieCrumbs = cookies[i].split("=");
        if(cookieCrumbs.length < 2)
        {
            continue;
        }
        cookieName = cookieCrumbs[0];
        cookieName = UTIL.trim(cookieName);

        cookieValue = decodeURIComponent(UTIL.trim(cookieCrumbs[1]));

        if(cookieName === searchName)
        {
            found = true;
        }
    }
    if(!found)
    {
        cookieValue = "";
    }

    return cookieValue;
}; // end UTIL.getCookie = function (searchName)

UTIL.getSubCookie = function(cookieName, subCookieName)
{
    var cookies = document.cookie.split(";");
    for(var i = 0; i < cookies.length; i++)
    {
        var cookieCrumbs = cookies[i].split("=");

        //cookieCrumbs[0] = cookieCrumbs[0].replace(/^\s+/, "");
        cookieCrumbs[0] = cookieCrumbs[0].replace(/^\s\s*/, "");

        if(cookieCrumbs[0] === cookieName)
        {
            var cookieValue = cookieCrumbs[1];
            
            cookieValue = decodeURIComponent(cookieValue);
            
            var subCookies = cookieValue.split("/");
            for(var j = 0; j < subCookies.length; j++)
            {
                var subCookieCrumbs = subCookies[j].split(":");
                if(subCookieCrumbs[0] === subCookieName)
                {
                    return subCookieCrumbs[1];
                }
            }
        }
    }
    return "";
}; // end UTIL.getSubCookie = function(cookieName, subCookieName)

UTIL.log = function (message)
{
    if(typeof console !== "undefined")
    {
        if(typeof console.log !== "undefined")
        {
            console.log(message);
        }
    }
    else
    {
        if(typeof window.opera !== "undefined")
        {
            if(typeof window.opera.postError !== "undefined")
            {
                window.opera.postError(message);
            }
        }
    }
}; // end UTIL.log = function (message)

UTIL.debug = function (message)
{
    if(UTIL.getValueFromURL("debug") !== "1")
    {
        return;
    }
    UTIL.log(message);
}; // end UTIL.debug = function (message)

UTIL.getGuid = function()
{
    var guid;
    var hexDigits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    function makeSegment(length)
    {
        var segment = "";
        for(var i = 0; i < length; i++)
        {
            segment += hexDigits[UTIL.randomBetween(0,15)];
        }
        return segment;
    }
    guid = "guid-" + makeSegment(8) + "-" + makeSegment(4) + "-" + makeSegment(4) + "-" + makeSegment(4) + "-" + makeSegment(12);
    return guid;
}; // end UTIL.getGuid = function()

UTIL.compareDates = function(dOne, dTwo)
{
    if(+dOne < +dTwo)
    {
        return -1;
    }
    else if(dOne === dTwo)
    {
        return 0;
    }
    else
    {
        return 1;
    }
}; // end UTIL.compareDates = function(dOne, dTwo)

UTIL.isValidDate = function(strText)
{
    var blnValid;
    var nDate;

    if(strText === "" || strText === null)
    {
        return true;
    }
    nDate = Date.parse(strText);
    blnValid = true;
    if(isNaN(nDate))
    {
        blnValid = false;    
    }

    //alert(strText + " is " + (blnValid ? "valid" : "invalid"));
    return blnValid;
}; // end UTIL.isValidDate = function(strText)


UTIL.isSafeDataEntry = function(strText)
{
    var pattern = /[^a-zA-Z'".,;:0-9\-\?\s]+/;
    var isOK = !pattern.test(strText);
    return isOK;
}; // end UTIL.isSafeDataEntry = function(strText)

UTIL.isValidEmailAddress = function(strText)
{
    var blnValid;
    var re;

    if(strText === "" || strText === null)
    {
      return true;
    }
    // erhoward@prodigy.net
    re = /^[^@]+@([a-z0-9\-]+\.)+[a-z]{2,4}$/i;
    blnValid = re.test(strText);
    return blnValid;
}; // UTIL.isValidEmailAddress = function(strText)

UTIL.isValidPhoneNumber = function(strText)
{
    var blnValid;
    var re;

    if(strText === "" || strText === null)
    {
        return true;
    }
    // 609-882-2489 or (609) 882-2489
    re = /^((\d{3}-\d{3}-\d{4})|(\(\d{3}\)\s\d{3}-\d{4}))$/i;

    blnValid = re.test(strText);
    return blnValid;
}; // end UTIL.isValidPhoneNumber = function(strText)

UTIL.isValidSocialSecurityNumber = function(strText)
{
    var blnValid;
    var re;

    if(strText === "" || strText === null)
    {
        return true;
    }
    re = /^\d{3}-\d{2}-\d{4}$/i;  
    blnValid = re.test(strText);
    //alert(strText + " is " + (blnValid ? "valid" : "invalid"));
    return blnValid;
}; // end UTIL.isValidSocialSecurityNumber = function(strText)

UTIL.isValidZipCode = function(strText)
{
    var blnValid;
    var re;

    if(strText === "" || strText === null)
    {
        return true;
    }
    re = /^\d{5}-\d{4}$/i;  
    blnValid = re.test(strText);
    //alert(strText + " is " + (blnValid ? "valid" : "invalid"));
    return blnValid;
}; // end UTIL.isValidZipCode = function(strText)

;(function($){
    $.fn.dateHighlighter = function(optionsIn){
        var options = $.extend({}, $.fn.dateHighlighter.defaults, optionsIn);
        return this.each(function(){
            var END_OF_WEEK_DAY = 6;
            var BEGIN_OF_WEEK_DAY = 0;
            var userDateIn = $(this).attr("data-date-highlighter-date") || "";
            if(isNaN(Date.parse(userDateIn)))
            {
                 return;             
            }
            var userDate = new Date(Date.parse(userDateIn));
            var userDay = userDate.getDay();
            
            var currentDate = new Date();
            var currentDay = currentDate.getDay();
            
            var endWeekOffset = END_OF_WEEK_DAY - userDay;
            var beginWeekOffset = userDay - BEGIN_OF_WEEK_DAY;
            
            var endWeekDate = new Date(+userDate);
            var beginWeekDate = new Date(+userDate);
            
            beginWeekDate.setDate(beginWeekDate.getDate() - beginWeekOffset);
            endWeekDate.setDate(endWeekDate.getDate() + endWeekOffset);
            
            if(+currentDate <= +beginWeekDate)
            {
                $(this).addClass("active");
                if($(this).hasClass("panel"))
                {    
                    $(this).addClass("panel-info");
                }
            }
        });
    };
    $.fn.dateHighlighter.defaults = {
    };
})(jQuery);
