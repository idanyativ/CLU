/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var result = null;
var resultsList = null;
var threeRes = null;
var count = 0
var count2 = 0;
var other = null;
var length = 0;

function getCLU(value) {
    if (value === "") {
        alert("value cant be null");
    } else {
        var jsStr = '{"value" : value}';
        var jsObj = eval("(" + jsStr + ")");
//        var results = sendValueToServer(jsObj);
        result = localSend(jsObj);
        length = result.results.length;
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

function localSend(obj) {
    //post to server and get result as json
    var resultAsJson = '{"results":[{"value":"Footballer","context":"is a Brazilian footballer"},{"value":"Barcelona","context":"plays for La Liga club FC Barcelona"},{"value":"Winger","context":"play as a forward or winger"},{"value":"Santos","context":"Neymar joined Santos in 2003"},{"value":"Ronaldinho","context":"Ronaldinho states he will be the best in the world"}]}';
    var resultAsString = JSON.parse(resultAsJson);
    return resultAsString;
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
    //document.getElementById("resultSpeech").val = (getValue());
    var listValues = res;
    resultsList = document.getElementById("resList2");
    
    if (listValues !== null)
    {
//        $(resultsList).append("<ul data-role='listview' id='resList2'>");
        // Building each reminders record in the page
        for (var i = 0; i < 3; i++) {
            $(resultsList).append("<li><a draggable=\"true\" ondragstart=\"drag(event)\" onclick=\"getContext(" + i + ")\" data-iconshadow=\"false\" data-icon=\"false\" id=\list" + i + ">"  + result.results[i].value + "</a></li>");
            count++;
            console.log("count:" + count);
            //$(resultsList).css({"background-color": "yellow"}).append("<li><a onclick=\"getContext(" + i + ")\" id=\list" + i + ">" + "<span>" + listValues.results[i].value + "</span></a></li>");

            
            console.log(resultsList);
        }
        // $(resultsList).append("</ul>");
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

var index = 0;
$(document).on("swipeleft swiperight", "li", function(event) {
    var projIndex = $(this).index();
    var listitem = $(this),
            // These are the classnames used for the CSS transition
            dir = event.type === "swipeleft" ? "left" : "right",
            // Check if the browser supports the transform (3D) CSS transition
            transition = $.support.cssTransform3d ? dir : false;

    onBuild2();
////      var removeItemID = $(this).find('id');
////        alert(removeItemID);
//       // console.log($(this).find('id').context.attr('id'));
//        console.log($(this).find('id').context.outerText);
//        console.log($(this).find('id'));
    if(index===length-1){
       removeFromList(index);
       $("#resList2").append("<li data-iconshadow=\"flase\"><a onclick=\"goToWiki(getValue())\" >" + "<span>" + "Dont Have A CLU? GO TO WIKI"  + "</span></a></li>");
       $("#resList2").listview("refresh");
        $("#resList2").append("<li data-icon=\"back\"><a onclick=\"goToWiki(getCLU(getValue()))\" >" + "<span>" + "Start Over"  + "</span></a></li>");
    }else{
           appendToList();
    console.log("count:" + count);
    console.log("index:" + index);
    console.log("length:" + length);
    removeFromList(projIndex);
    index++; 
    console.log(resultsList);
    }

});

function getContext(i) {
    var action = "getContext("+ i +")";
    if($('#list'+i).attr("onClick") === action){
       alert($('#list'+i).attr("onClick"));
       $('#list'+i).text(result.results[i].context);
     $('#list'+i).attr("onClick","getValue("+i + ")");
    }else{
        alert("iisadasd");
        alert($('#list'+i));
        $('#list'+i).text(result.results[i].value);
     $('#list'+i).attr("onClick","getContext("+i + ")");
    }
    //$("#resList").find("list" + i).replaceWith("asdasd");
//     console.log($("#resList").find("list" + i).text("asdasd"));
//     $("#resList").find("list" + i).text("asdasd");
    //document.getElementById("list"+i).innerHTML = result.results[i].context;
   // $("#resList").find("list" + i).replaceWith("<li><a onclick=\"getValue(" + i + ")\" id=\list" + i + ">" + "<span>" + result.results[i].value + "</span></a></li>");
//  $(resultsList).css({"background-color": "yellow"}).append("<li><a onclick=\"getValue(" + i + ")\" id=\list" + i + ">" + "<span>" + result.results[i].value + "</span></a></li>");
    $('#listcontainer2').html(resultsList);
    //$('#listcontainer2').trigger("create");//refreashing dynamically
    console.log(i);
    console.log(resultsList);
    //$("li").text("Some new text.");
//   console.log(document.getElementById('list'  + i).value); 
//    alert(result.results[i].context);
}


function getValue(i) {
    var pp = "getValue("+ i +")";
    if($('#list'+i).attr("onClick") === pp){
       alert($('#list'+i).attr("onClick"));
       $('#list'+i).text(result.results[i].value);
     $('#list'+i).attr("onClick","getContext("+i + ")");
    }
    //$("#resList").find("list" + i).replaceWith("asdasd");
//     console.log($("#resList").find("list" + i).text("asdasd"));
//     $("#resList").find("list" + i).text("asdasd");
    //document.getElementById("list"+i).innerHTML = result.results[i].context;
   // $("#resList").find("list" + i).replaceWith("<li><a onclick=\"getValue(" + i + ")\" id=\list" + i + ">" + "<span>" + result.results[i].value + "</span></a></li>");
//  $(resultsList).css({"background-color": "yellow"}).append("<li><a onclick=\"getValue(" + i + ")\" id=\list" + i + ">" + "<span>" + result.results[i].value + "</span></a></li>");
    $('#listcontainer2').html(resultsList);
    //$('#listcontainer2').trigger("create");//refreashing dynamically
    console.log(i);
    console.log(resultsList);
    //$("li").text("Some new text.");
//   console.log(document.getElementById('list'  + i).value); 
//    alert(result.results[i].context);
}


function cutResults(res) {
    var newRes = res;
    newRes.results = newRes.results.splice(0, 3);
    return newRes;
}

function appendToList() {
    if(count!==length){
            $("#resList2").append("<li><a onclick=\"getContext(" + count + ")\" id=\list"  + count + ">" + "<span>" + result.results[count].value + "</span></a></li>");
    $("#resList2").listview("refresh");
    count++;
    console.log("count:" + count);
    }
}

function removeFromList(index) {
    console.log(index);
    $("#list" + index ).remove();
    $("#resList2").listview("refresh");
}

function change(){
    document.getElementById("idan").value = "asdasda";
}

function rateUs(){
    alert("Currently on build - soon be available")
}

function randomPage(){
    alert("Currently on build - soon be available")
}
//window.onload = setValue();
function setValue(){
    $("name").val(getValueZ());
}

function allowDrop(ev)
{
ev.preventDefault();
}

function drag(ev)
{
ev.dataTransfer.setData("Text",ev.target.id);
}
function drop(ev)
{
 $('#name').val('');
ev.preventDefault();
var data=ev.dataTransfer.getData("Text");
console.log(document.getElementById(data));
var intValue = parseInt(data.match(/[0-9]+/)[0], 10);
$('#name').val(result.results[intValue].value);
//alert(data);
//console.log(ev.target); 
//ev.target.appendChild(document.getElementById(data));
}