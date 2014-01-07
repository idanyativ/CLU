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
var Val = null;

function getCLU(value) {
    Val = value;
    console.log("getCLu : " + value);
    if (value === "") {
        console.log("value cant be null");
    } else {
        var jsStr = "\{\"value\" :" + value + "}";
        // var jsObj = eval("(" + jsStr + ")");
        if(value.search(" ") !== -1){
            value.replace(" ","_");
        }
        sendValueToServer(value);
//        var obj = "\{\"value\":" + "\"" + value + "\"" + "}";
//        alert("\{\"value\":" + "\"" + value+ "\"" +"}"); 
        //result = sendValueToServer("\{\"value\" :" + "\" + value+ \" +\"}");
//         result = sendValueToServer(obj);
//        result = localSend(obj, value);

    }
}



function sendValueToServer(valInJson) {
    console.log("Get Clue About " + valInJson);
    event.preventDefault();
    $.ajax({
        type: "GET",
        url: 'http://noanimrodidan.milab.idc.ac.il/?q='+ valInJson,
        success: function(response) {
            console.log(response);
            result = response;
            length = result.results.length;
            if (result === null) {
                console.log("no results");
            } else {
                other = JSON.parse(JSON.stringify(result));
                threeRes = cutResults(other);
                buildPage(threeRes);
            }
        }
    });

    return false;
}

function localSend(obj, val) {
    var resultAsJson = null;
    //post to server and get result as json
    switch (val) {
        case "Retention" :
            resultAsJson = '{"results":[{"value":"Buisness Term","context":"AAA"},{"value":"Marketing","context":"BBB"},{"value":"customer service","context":"CCC"},{"value":"Consumer Behavior","context":"Retention is a term in customer behavior which indicate the lifetime of the user with the product"}]}';
            break;
        case "Consumer Behavior" :
            resultAsJson = '{"results":[{"value":"Consumer buying behavior","context":"AAA"},{"value":"Psychology, decision making","context":"BBB"},{"value":"Marketing service","context":"CCC"}]}';
            break;
        case "Neymar" :
            resultAsJson = '{"results":[{"value":"Footballer","context":"is a Brazilian footballer"},{"value":"Barcelona","context":"plays for La Liga club FC Barcelona"},{"value":"Winger","context":"play as a forward or winger"},{"value":"Santos","context":"Neymar joined Santos in 2003"},{"value":"Ronaldinho","context":"Ronaldinho states he will be the best in the world"}]}';
            break;
        default :
            resultAsJson = '{"results":[{"value":"Electrical engineering","context":"CCC"},{"value":"Thomas Edison","context":"BBB"},{"value":"Alternating current","context":"AAA"}]}';
    }
    console.log(resultAsJson);
    if (resultAsJson !== null) {
        var resultAsString = JSON.parse(resultAsJson);
        return resultAsString;
    } else {
        alert("result it null!");
    }
}

function goToWiki(value) {
    console.log(value);
    window.open("http://en.wikipedia.org/wiki/" + value, "_self")
}
function getValueZ() {
//    console.log(Val);
    return Val;
}


function buildPage(res)
{
    $.mobile.changePage('#resultPage');
    $('#resultSearch').val(getValueZ());
    var listValues = res;
    $("#resList2").empty();
    $("#img11").text("pic " + getValueZ() + " 1");
//    setPicText();
    resultsList = document.getElementById("resList2");
    if (listValues !== null)
    {
        // Building each reminders record in the page
        for (var i = 0; i < 3; i++) {
            // $(resultsList).append("<div><id\"=listcontainer\"" + 3*i);
//            $(resultsList).append("<li name=\"isd\" class=\"zoomProps\"><a onclick=\"getContext(" + i + ")\" data-iconshadow=\"false\"  data-icon=\"false\" id=\list" + i + ">" + result.results[i].value + "</a></li>");
            $(resultsList).append("<li><a  draggable=\"true\"  ondragstart=\"drag(event)\" onclick=\"getContext(" + i + ")\" data-iconshadow=\"false\"  data-icon=\"false\" id=\list" + i + ">" + result.results[i].value + "</a></li>");
            var color = setColor(i);
            $("#list" + i).css({"height": "30px", "text-align": "center", "color": "white", "background-color": color, "padding-top": "25px"});
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
    console.log(result.results[$(this).index()].value);
    getCLU(result.results[$(this).index()].value);
});

var index = 0;
var removed = 0;
$(document).on("swipeleft", "li", function(event) {
    event.preventDefault();
    var projIndex = $(this).index();

    //var listitem = $(this),
    // These are the classnames used for the CSS transition
    dir = event.type === "swipeleft" ? "left" : "right",
//             Check if the browser supports the transform (3D) CSS transition
            transition = $.support.cssTransform3d ? dir : false;
    console.log(transition);
    if (transition) {
        console.log(transition);
        $(this).removeClass("ui-btn-down-d").addClass(transition);
    }
    if (removed === length - 1) {
        removeFromList(projIndex);
        console.log("index:" + index);
        console.log("length:" + length);
        console.log("removed:" + removed);
        $("#resList2").append("<li  data-iconshadow=\"flase\"><a id=\"listWiki\" onclick=\"goToWiki(getValueZ())\" >"  + "Dont Have A CLU? GO TO WIKI" + "</a></li>");
        $("#listWiki").css({"height": "30px", "text-align": "center", "color": "white", "background-color": setColor(length + 1), "padding-top": "25px"});
        $("#resList2").append("<li data-icon=\"back\" data-iconpos=\"bottom\"><a id=\"listStartOver\" onclick=\"startOver( )\" >"  + "Start Over" + "</a></li>");
        $("#listStartOver").css({"height": "30px", "text-align": "center", "color": "white", "background-color": setColor(length + 2), "padding-top": "25px"});
        $("#resList2").listview("refresh");
    } else {
        removeFromList(projIndex);
        removed++;
        appendToList();
//         $('#resList2').trigger('create');
//        if ( $('#resList2').hasClass('ui-listview')) {
//    $('#resList2').listview('refresh');
//     } 
//else {
//    $('#resList2').trigger('create');
//     }
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
        $('#list' + i).css({"background-color": "white", "color": "#85C2FF"});
//        $("#resList2").listview("create");
    }
//    $('#listcontainer2').html(resultsList);
    console.log(i);
    console.log(resultsList);
}


function getValue(i) {
    var pp = "getValue(" + i + ")";
    if ($('#list' + i).attr("onClick") === pp) {
        $('#list' + i).text(result.results[i].value);
        $('#list' + i).attr("onClick", "getContext(" + i + ")");
        $('#list' + i).css({"background-color": setColor(i), "color": "white"});
//         $("#resList2").listview("create");
    }
//    $('#listcontainer2').html(resultsList);
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
        $("#resList2").append("<li><a onclick=\"getContext(" + count + ")\" id=\list" + count + ">"  + result.results[count].value + "</a></li>");
        var color = setColor(count);
        $("#list" + count).css({"height": "30px", "text-align": "center", "color": "white", "background-color": color, "padding-top": "25px"});
        count++;
        console.log("count:" + count);
    }
}

function removeFromList(index) {
    console.log(index);
    $("#list" + index).remove();
    $("#list" + index).css("height", 0);
    // $("#resList2").listview("refresh");
}

function change() {
    document.getElementById("idan").value = "asdasda";
}

function rateUs() {
    alert("Currently on build - soon be available")
}

function tellFriend() {
    alert("Currently on build - soon be available")
}

function randomPage() {
    getCLU("Nikola Tesla");
}
function setValue() {
    $("resultSearch").val(getValueZ());
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
    $('#resultSearch').val('');
    ev.preventDefault();
    var data = ev.dataTransfer.getData("Text");
    console.log(document.getElementById(data));
    var intValue = parseInt(data.match(/[0-9]+/)[0], 10);
    $('#resultSearch').val(result.results[intValue].value);
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

$("#resultTitle").text(getValueZ());

function setColor(i) {
    if (i % 2 === 0) {
        console.log(i + "=" + "blue");
        return "#3399FF";
    } else {
        console.log(i + "=" + "blueee");
    }
    return "#85C2FF";
}

function setPicText(){
    $("#img11").text("asdasd");
       var img1=document.getElementById(getValueZ());
    var img2=document.getElementById("img2");
    var ctx=img1.getContext("2d");
    ctx.clearRect(0,0,$('#resultPage').width(),$('#resultPage').height());
    ctx.font="10px Arial";
     ctx.fillText("pic " + getValueZ() + "1",80,80);
    ctx=img2.getContext("2d");
     ctx.clearRect(50,50,$('#resultPage').width(),$('#resultPage').height());
     ctx.font="10px Arial";
     ctx.fillText("pic " + getValueZ() + "2",80,80);
}
    
 