/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function buildPageNative(res)
{
    $.mobile.changePage('#resultPage');
    var listValues = res;
    if (listValues !== null)
    {
         var listString = "<ul data-role='listview' id='resList'>";
        // Building each reminders record in the page
        for (var i = 0; i < listValues.results.length; i++) {
            listString += "<li><a onclick=\"onBuild();\" href=\"\">" +  listValues.results[i].value + "</a></li>";
        }
        listString += "</ul>";
    }
    console.log("listString=" + table);
    $('#resultPage').html();
    $('#listcontainer').html(listString);
    $('#listcontainer').trigger("create");//refreashing dynamically
    $('#resultPage a').on('click', function(e) {
        e.preventDefault();
        //	load(e.target.href);
    });
};

//function sendValueToServer(valInJson) {
//    console.log("Get Clue About" + valInJson.value);
//    event.preventDefault();
//    $.ajax({
//        type: "POST",
//        url: 'XXXXXXXXXXXXXXXXXXXX',
//        data: {
//           'json' : valInJson
//        },
//        success: function(response) {
//            console.log(response);
//            $.mobile.changePage('#ExistingReminders');
//            $('#ReminderContent').trigger('create');
//        }
//    });
//
//    return false;
//
//}
<!DOCTYPE html>
<html>
<body>

<p id="demo">Click the button to add elements to the array.</p>

<button onclick="myFunction()">Try it</button>

<script>
function myFunction()
{
var fruits = ["Banana", "Orange", "Apple"];
fruits.splice(0,1);
fruits.splice(2,0,"Lemon");
var x=document.getElementById("demo");
x.innerHTML=fruits;
}
</script>

</body>
</html>