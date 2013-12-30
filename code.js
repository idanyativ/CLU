/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var result = null;
var resultsList = null;
var threeRes = null;
var count = 0
var other = null;
var length = 0;
var historySearches = {};
var historyList = null;
var numberOfSearch = 0;

function getCLU(value) {
    console.log("getCLu : " + value);
    if (value === "") {
        alert("value cant be null");
    } else {
        var jsStr = '{"value" : value}';
        var jsObj = eval("(" + jsStr + ")");
//        var results = sendValueToServer(jsObj);
        result = localSend(jsObj,value);
        length = result.results.length;
        historySearches[numberOfSearch] = value;
        numberOfSearch++;
        if (result === null) {
            alert("no results")
        } else {
            other = JSON.parse(JSON.stringify(result));
            threeRes = cutResults(other);
            buildPage(threeRes);
        }
    }
}

//function sendValueToServer(valInJson) {
//    console.log("Get Clue About" + valInJson.value);
//    event.preventDefault();
//    $.ajax({
//        type: "POST",
//        url: 'localhost:8000',
//        data: {
//           'json' : valInJson
//        },
//        success: function(response) {
//            console.log(response);
//        }
//    });
//
//    return false;
//
//}

function localSend(obj,val) {
    var resultAsJson = null;
    //post to server and get result as json
    if(val ==="neymar"){
            resultAsJson = '{"results":[{"value":"Footballer","context":"is a Brazilian footballer"},{"value":"Barcelona","context":"plays for La Liga club FC Barcelona"},{"value":"Winger","context":"play as a forward or winger"},{"value":"Santos","context":"Neymar joined Santos in 2003"},{"value":"Ronaldinho","context":"Ronaldinho states he will be the best in the world"}]}';

    }else{
           resultAsJson = '{"results":[{"value":"POP","context":"is a Brazilian footballer"},{"value":"neymar","context":"plays for La Liga club FC Barcelona"},{"value":"Winger","context":"play as a forward or winger"},{"value":"Santos","context":"Neymar joined Santos in 2003"},{"value":"Ronaldinho","context":"Ronaldinho states he will be the best in the world"}]}';
    }
    
    if(resultAsJson !== null){
    var resultAsString = JSON.parse(resultAsJson);
    return resultAsString;
}else{
    alert("result it null!");
}
}

function goToWiki(value) {
    console.log(value);
    window.open("http://en.wikipedia.org/wiki/" + value, "_self")
}
function getValueZ() {
    console.log(document.getElementById('mainSpeech').value);
    return document.getElementById('mainSpeech').value;
}


function buildPage(res)
{
    $.mobile.changePage('#resultPage');
    $('#resultSpeech').val(getValueZ());
    $('#name').val(getValueZ());
    var listValues = res;
    $("#resList2").empty();
    resultsList = document.getElementById("resList2");
    if (listValues !== null)
    {
        // Building each reminders record in the page
        for (var i = 0; i < 3; i++) {
            // $(resultsList).append("<div><id\"=listcontainer\"" + 3*i);
            $(resultsList).append("<li><a draggable=\"true\" ondragstart=\"drag(event)\" onclick=\"getContext(" + i + ")\" data-iconshadow=\"false\"  data-icon=\"false\" id=\list" + i + ">" + result.results[i].value + "</a></li>");
            //$(resultsList).append("<div>");
            $("#list"+i).css({"height":"30px","padding-top":"25px"});
            count++;
            console.log("count:" + count);
            console.log("i:" + i);
            console.log(resultsList);
        }
    }
    console.log("listString=" + resultsList);
    $('#resultPage').html();
    $('#listcontainer2').html(resultsList);
    $('#listcontainer2').trigger("create");//refreashing dynamically
    $('#resultPage a').on('click', function(e) {
        e.preventDefault();
    });
}
;

function onBuild() {
    alert("onBuild");
}

function onBuild2() {
    alert("onBuild2");
}
$(document).on("swiperight", "li", function(event) {
    alert(result.results[$(this).index()].value);
    getCLU(result.results[$(this).index()].value);
});

var index = 0;
var removed = 0;
$(document).on("swipeleft", "li", function(event) {
    event.preventDefault();
    var projIndex = $(this).index();
    //var listitem = $(this),
            // These are the classnames used for the CSS transition
            //dir = event.type === "swipeleft" ? "left" : "right",
            // Check if the browser supports the transform (3D) CSS transition
            //transition = $.support.cssTransform3d ? dir : false;

    if (removed === length  -1) {
        removeFromList(projIndex);
        console.log("index:" + index);
        console.log("length:" + length);
        console.log("removed:" + removed);
        $("#resList2").append("<li  data-iconshadow=\"flase\"><a id=\"listWiki\" onclick=\"goToWiki(getValueZ())\" >" + "<span>" + "Dont Have A CLU? GO TO WIKI" + "</span></a></li>");
//        $("#listwiki").css({"height":"30px","padding-top":"25px"});
//         $("#resList2").listview("refresh");
        $("#resList2").append("<li data-icon=\"back\" data-iconpos=\"bottom\"><a id=\"listStartOver\" onclick=\"startOver( )\" >" + "<span>" + "Start Over" + "</span></a></li>");
//        $("#listStartOver").css({"height":"30px","padding-top":"25px"});
        $("#resList2").listview("refresh");
    } else {
        removeFromList(projIndex);
        removed++;
        appendToList();
        $("#resList2").listview("refresh");
        console.log("count:" + count);
        console.log("index:" + index);
        console.log("length:" + length);
        console.log("removed:" + removed);
        index++;
        console.log(resultsList);
    }

});

function getContext(i) {
    var action = "getContext(" + i + ")";
    if ($('#list' + i).attr("onClick") === action) {
        $('#list' + i).text(result.results[i].context);
        $('#list' + i).attr("onClick", "getValue(" + i + ")");
    } else {
        alert("iisadasd");
        alert($('#list' + i));
        $('#list' + i).text(result.results[i].value);
        $('#list' + i).attr("onClick", "getContext(" + i + ")");
    }

    $('#listcontainer2').html(resultsList);
    console.log(i);
    console.log(resultsList);
}


function getValue(i) {
    var pp = "getValue(" + i + ")";
    if ($('#list' + i).attr("onClick") === pp) {
        $('#list' + i).text(result.results[i].value);
        $('#list' + i).attr("onClick", "getContext(" + i + ")");
    }
    $('#listcontainer2').html(resultsList);
    console.log(i);
    console.log(resultsList);
}


function cutResults(res) {
    var newRes = res;
    newRes.results = newRes.results.splice(0, 3);
    return newRes;
}

function appendToList() {
    if (count !== length) {
        $("#resList2").append("<li><a onclick=\"getContext(" + count + ")\" id=\list" + count + ">" + "<span>" + result.results[count].value + "</span></a></li>");
        $("#list"+count).css({"height":"30px","padding-top":"25px"});
        //$("#resList2").listview("refresh");
        count++;
        console.log("count:" + count);
    }
}

function removeFromList(index) {
    console.log(index);
    $("#list" + index).remove();
    $("#list" + index).css("height",0);
   // $("#resList2").listview("refresh");
}

function change() {
    document.getElementById("idan").value = "asdasda";
}

function rateUs() {
    alert("Currently on build - soon be available")
}

function randomPage() {
    alert("Currently on build - soon be available")
}
function setValue() {
    $("name").val(getValueZ());
}

function allowDrop(ev)
{
    ev.preventDefault();
}

function drag(ev)
{
    ev.dataTransfer.setData("Text", ev.target.id);
}
function drop(ev)
{
    $('#name').val('');
    ev.preventDefault();
    var data = ev.dataTransfer.getData("Text");
    console.log(document.getElementById(data));
    var intValue = parseInt(data.match(/[0-9]+/)[0], 10);
    $('#name').val(result.results[intValue].value);
}


function startOver() {
    index = 0;
    count = 0;
    getCLU(getValueZ());
}

function getHistory() {
    $.mobile.changePage('#historyPage');
    historyList = document.getElementById("historyList");
    for (var i = 0; i < numberOfSearch; i++) {
        $(historyList).append("<li><a onClick=\"getCLU(historySearches[" + i + "])\">" + historySearches[i] + "</a></li>");
        console.log(historyList);
    }
}

function fullScreen(url) {
    var myWindow = window.open(url, "_self", 'scrollbars=yes,resizable=yes,fullscreen=yes');
}
