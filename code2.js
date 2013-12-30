// Global Variables:
var currentDist;
var currentPosition;
var pos;
var currLng;
var currLat;
var timerId = 0;

/**
 * When the user wish to add a new reminder, Initializing all the fields in the
 *  form, Updates default limit of time and setting relevant flags
 */	
function initAddReminder() {
    // Clears Form:
    cleanReminderForm();
    
    // Setting the reminderFlag
    setCookie("updateReminderId", 0, 1);
    
    // Updating the 'end date' time
    var newDate = new Date();

    // Getting tommorow's date
    newDate.setDate(newDate.getDate() + 1);

    // Converting from date to dateTime
    var dateString = newDate.toISOString();
    // Need a string in the form of: 'YYYY-MM-DDTHH:mm:ss' from 'YYYY-MM-DDTHH:mm:ss.sssZ'
    //  so we remove the last 5 chars
    dateString = dateString.substring(0, dateString.length - 5);

    // Setting the relevant element value
    document.getElementById('newReminderDate').value = dateString;
    
    // Showing the delete button for the "edit" action
    document.getElementById('deleteContainer').style.display="none";
    
    // Initializing the values in the "Select Location" combobox
    initSelectLocation();
    
}

function initSelectLocation() {
    var locationsList = null;
    var request = false;
    request = new XMLHttpRequest();

    if (request)
    {
        request.open("GET", "/locations");

        request.onreadystatechange = function()
        {
            if (request.readyState === 4 &&
                    request.status === 200) {
                locationsList = JSON.parse(request.responseText);
                if (locationsList !== null)
                {
                    var listString = "<option value=\"empty\">Select Location...</option>" +
                                     "<option value=\"fromMap\">New Location</option>"; //<!-- Loads Map -->
                          
                    // Creating a record for each location
                    for (var i = 0; i < locationsList.length; i++) {
                        listString += "<option value=\"" + locationsList[i].locationId + "\">" + locationsList[i].name + "</option>";
                    }
                }

                    

                console.log("listString=" + listString);
//                $('#favoriteLocation').html();
                $('#select_location').html(listString);
                //$('#newReminder').trigger("create");//refreashing dynamically
//                $('#favoriteLocation a').on('click', function(e) {
//                    e.preventDefault();
//                    //  load(e.target.href);
//                });
            }

        };
    }

    request.send(null);
}

/*
 * Prints message to the user that the wanted operation couldn't yet implemented
 */
function waitingForDB() {
    alert("This action will be supported only when DB will be available");
}

/*
 * When user wish to edit an existing reminder, this method loads all
 *  information of the relevant information from the DB and sets all the
 *  objects in the NewReminder page with the relevant values
 * @param {type} reminder - reminder ID
 */
function initEditReminder(id) {
    
    initSelectLocation();
    
    reminderObject = null;
    var request = false;
    request = new XMLHttpRequest();

    if (request)
    {
        request.open("GET", "/reminders/" + id);
        
        request.onreadystatechange = function()
        {
          if (request.readyState === 4 &&
                    request.status === 200) {
                reminderObject = JSON.parse(request.responseText);
                if (reminderObject !== null)
                {
                    document.getElementById('reminderTitle').value = reminderObject[0].title;
                    document.getElementById('select_location').value = reminderObject[0].locationLng;
                    document.getElementById('radius').value = reminderObject[0].alertRadius;
                    document.getElementById('Description').value = reminderObject[0].description;
                    document.getElementById('set_ringtone').value = reminderObject[0].soundAlert;
                    document.getElementById('newReminderDate').value = reminderObject[0].finishData;
                    // Saving lng and lat
                    setCookie("tmpLng", reminderObject[0].locationLng , 1);
                    setCookie("tmpLat", reminderObject[0].locationLat , 1);                    
                }
            }
        };

        request.send(null);
    }
    
    // Showing the delete button for the "edit" action
    document.getElementById('deleteContainer').style.display="block";
    
    // Sets id of the reminder to update
    setCookie("updateReminderId", id, 1);

    window.location = '#newReminder';
}


// get the exist reminders from database and creating the "ExistingReminders" page code
function getReminders()
{
    var remindersList = null;
    var request = false;
    request = new XMLHttpRequest();

    if (request)
    {
        request.open("GET", "/reminders");

        request.onreadystatechange = function()
        {
          if (request.readyState === 4 &&
                    request.status === 200) {
                remindersList = JSON.parse(request.responseText);
                if (remindersList !== null)
                {
                    var listString = "<ul data-role='listview' id='listDiv'>";
                    // Building each reminders record in the page
                    for (var i = 0; i < remindersList.length; i++) {
                        listString += "<li>" +
                                    "<div data-role=\"fieldcontain\">" +
                                        "<label for=\"reminder" + remindersList[i].reminderId + "_state\">" + remindersList[i].title + "</label>" +
                                        "<select name=\"reminder" + remindersList[i].reminderId + "_state\" id=\"reminder" + remindersList[i].reminderId + "_state\" " +
                                               "data-role=\"slider\" data-mini=\"true\" onchange=\"updateState(" + remindersList[i].reminderId + ")\">" +
                                            // Checking the initial state of the curr reminder's activity
                                            "<option value=\"off\"" + ((remindersList[i].active !== "on") ? " selected " : "") + ">Not Active</option>" +
                                            "<option value=\"on\"" + ((remindersList[i].active === "on") ? " selected " : "") + ">Active</option>" + 
                                        "</select>" +
                                        "<a href=\"javascript:initEditReminder('reminder" + remindersList[i].reminderId +"_id')\" id=\"reminder" + remindersList[i].reminderId + "_id\" " +
                                        "data-icon=\"edit\" onclick=\"initEditReminder('" + remindersList[i].reminderId +"')\" data-role=\"button\" data-mini=\"true\" data-inline=\"true\" data-theme=\"b\" class=\"editButton\">Edit</a>" +
                                    "</div>" +
                                    "</li>";

                    }
                    
                    listString +="</ul>";
                }
                
                // Saving the next id of the reminders
//                /r/if (remindersList.length > 0) {
                    //nextReminderId = parseInt(remindersList[remindersList.length - 1].reminderId) + 1;
                //}
                //else {
                    //nextReminderId = 1;
                //}

                console.log("listString=" + listString);
                $('#ExistingReminders').html();
                $('#existingReminders_content').html(listString);
                $('#existingReminders_content').trigger("create");//refreashing dynamically
                $('#ExistingReminders a').on('click', function(e) {
                    e.preventDefault();
                    //	load(e.target.href);
                });
            }
        };

        request.send(null);
    }
}

/* Updating activity state of a specific reminder */
function updateState(id) {
    console.log("updating activity state");
    event.preventDefault();
    $.ajax({
            url: "/reminders/active/" + id,
            type: "PUT",
            data: {
                    'active': $("#reminder" + id + "_state").val()
            }
        });
    return false;
}

/* When user click the "Send" button, we check if we need to add a new reminder
 *  or rather edit an existing one. we know so by checking the global reminder id variable
 */
function saveReminder() {
 
    // Validity check - making sure the title is filled with a value
    var title = document.getElementById("reminderTitle");
    if (title.value === "") {
        alert('Title must not be empty');
        title.focus();
        return(0); // Ends check
    }
    var remLocation = document.getElementById("select_location");
    
    var lng = getCookie("tmpLng");
    var lat = getCookie("tmpLat");
    
    // Making sure the lng a lat are set with a value
    if ( !lng || !lat) {
        alert('Must select location');
        remLocation.focus();
        return(0);
    }

    var reminderId = getCookie("updateReminderId");
    if (reminderId == 0) {
        addNewReminder(lng, lat);
    }
    else {
        updateReminder(reminderId, lng, lat);
    }
 
}

function addNewReminder(lng, lat) {
    console.log("Post a new reminder");
    event.preventDefault();
    $.ajax({
        type: "POST",
        url: '/reminders',
        data: {
            //'reminderId': nextReminderId,
            'title': $('#reminderTitle').val(),
            'locationLng': lng,
            'locationLat': lat,
            'alertRadius' : $('#radius').val(),
            'description': $('#Description').val(),
            'soundAlert': $('#set_ringtone').val(),
            'finishData': $('#newReminderDate').val() ,
            'active' : 'on'    
        },
        success: function(response) {
            console.log(response);
            $.mobile.changePage('#ExistingReminders');
            $('#ReminderContent').trigger('create');
        }
    });

    return false;

}

// Updates a specific reminder
function updateReminder(id, lng, lat) {
    console.log("updating reminder");
    event.preventDefault();
    $.ajax({
            url: "/reminders/" + id,
            type: "PUT",
            data: {
                    'reminderId': id,
                    'title': $('#reminderTitle').val(),
                    'locationLng': lng,
                    'locationLat': lat, 
                    'alertRadius': $('#radius').val(),
                    'description': $('#Description').val(),
                    'soundAlert': $('#set_ringtone').val(),
                    'finishData': $('#newReminderDate').val(),
                    'active': 'on'
            },
            success: function(data, textStatus, jqXHR) {
                    console.log("Post resposne:");
                    console.dir(data);
                    console.log(textStatus);
                    console.dir(jqXHR);
               $.mobile.changePage('#ExistingReminders');
                    $('#content').trigger('create');
            }
    });
    
    return false;
}

// Deletes a specific reminder (using global indicator)
function deleteReminder() {
    event.preventDefault();
    $.ajax({
            url: "/reminders",
            type: "DELETE",
            data: {
                    'reminderId': getCookie("updateReminderId")
            },
            success: function(data, textStatus, jqXHR) {
                    console.log("Post resposne:");
                    console.dir(data);
                    console.log(textStatus);
                    console.dir(jqXHR);
                    $.mobile.changePage('#ExistingReminders');

            }
    });

    return false;
}

// Gets location list and building the locations page according to it
function buildLocationsList()
{
    var locationsList = null;
    var request = false;
    request = new XMLHttpRequest();

    if (request)
    {
        request.open("GET", "/locations");

        request.onreadystatechange = function()
        {
            if (request.readyState === 4 &&
                    request.status === 200) {
                locationsList = JSON.parse(request.responseText);
                if (locationsList !== null)
                {
                    var listString = "<ul data-role='listview' id='listDiv'>";
                    // Creating a record for each location
                    for (var i = 0; i < locationsList.length; i++) {
                        listString += "<li>" +
                                    "<div data-role=\"fieldcontain\">" +
                                        "<label for=\"location" + locationsList[i].locationId + "\">" + locationsList[i].name + "</label>" +
                                        "<a href=\"javascript:deleteLocation('" + locationsList[i].locationId +"')\" id=\"location2" + locationsList[i].locationId + "\" " +
                                        "data-icon=\"minus\" onclick=\"deleteLocation('" + locationsList[i].locationId +"')\" data-role=\"button\" data-mini=\"true\" data-inline=\"true\" data-theme=\"b\" class=\"deleteButton\">Delete</a>" +
                                    "</div>" +
                                    "</li>";
                    }
                    
                    listString +="</ul>";
                }

                console.log("listString=" + listString);
                $('#favoriteLocation').html();
                $('#locations_content').html(listString);
                $('#favoriteLocation').trigger("create");//refreashing dynamically
                $('#favoriteLocation a').on('click', function(e) {
                    e.preventDefault();
                    //  load(e.target.href);
                });
            }

        };
    }

    request.send(null);
}

// Adds a new location to the favorite locations databaes
function addLocation(lng, lat) {
    
    // Making sure the user entered a name for the location
    var locationName = document.getElementById('locationName');
    if (locationName.value === "") {
        alert("Location name must not be empty");
        locationName.focus();
        return false;
    }
   
    console.log("Post a new location");
    event.preventDefault();
    $.ajax({
        type: "POST",
        url: '/locations',
        data: {
            //'locationId': nextLocationId,
            'name': $('#locationName').val(),
            'locationLng': lng, // Location cord yet to be implemented
            'locationLat': lat // Location cord yet to be implemented
        },
        success: function(response) {
            console.log(response);
            $.mobile.changePage('#favoriteLocation');
            $('#content').trigger('create');
        }
    });
    return false;

}

// Deletes favorite location by id
function deleteLocation(id)
{
    //event.preventDefault();
    $.ajax({
        url: "/locations",
        type: "DELETE",
        data: {
            'locationId': id
        },
        success: function(data, textStatus, jqXHR) {
            console.log("Post resposne:");
            console.dir(data);
            console.log(textStatus);
            console.dir(jqXHR);
            buildLocationsList();
            $.mobile.changePage('#favoriteLocation');
        },
        error: function() {
            alert("Invalid input");
        }

    });

    return false;

}

/**
 * Gets location by its ID, and sets it coords in the cookie
 */
function getLocationById(id) {

    locationObject = null;
    var request = false;
    request = new XMLHttpRequest();

    if (request)
    {
        request.open("GET", "/locations/" + id);
        
        request.onreadystatechange = function()
        {
          if (request.readyState === 4 &&
                    request.status === 200) {
                locationObject = JSON.parse(request.responseText);
                if (locationObject !== null)
                {
                    // Saving lng and lat
                    setCookie("tmpLng", locationObject[0].locationLng , 1);
                    setCookie("tmpLat", locationObject[0].locationLat , 1);                    
                }
            }
        };

        request.send(null);
    }

}

/***
 * Clears the screen of the "New/Edit Reminder after using it
 */
function cleanReminderForm() {
        document.getElementById('reminderTitle').value = "";
        document.getElementById('select_location').value = "";
        document.getElementById('radius').value = "";
        document.getElementById('Description').value = "";
        document.getElementById("set_ringtone").value = "Marimba";
        document.getElementById('newReminderDate').value = "";
    }

function fillReminderForm() {
        document.getElementById('reminderTitle').value = getCookie("remTitle");
        document.getElementById('radius').value = getCookie("remRadius");
        document.getElementById('Description').value = getCookie("remDesc");
        document.getElementById("set_ringtone").value = getCookie("remRingtone");
        document.getElementById('newReminderDate').value = getCookie("remDate");
}

function validateMail(address) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    return filter.test(address);
}

/*
 * Validating user Email and Password changing in the settings page.
 * If all valid, saves the information of the user to the DB.
 * (In the future, we'll write a similiar function for the login page
 *  which we didn't want to do now, while there's no user table.
 */
function checkSettings(existingUserFlag,mail,pass1,pass2) {
    // Validating E-Mail
    if (!validateMail(document.getElementById(mail).value)) {
        alert('Please provide a valid email address');
        email.focus();
        return(false); // Ends check
    }

    // Validating Password
    var password = document.getElementById(pass1);
    var password2 = document.getElementById(pass2);

    // Making sure the new password is valid
    if (password.value.length < 6) {
        alert("Password length must be at least 6 characters long");
        return(false); // Ends check
    }
    if (password.value !== password2.value) {
        alert("The passwords given are different, please try again.");
        return(false); // Ends check
    }

    if (existingUserFlag) {
        alert("Successfully change");
    } else {
        alert("New user successfully created");
    }
    return true;
}

/*
 * Ending session of the user and load the login page
 */
function logout() {
    // Will end session of the user and load the sign in page
    clearInterval(timerId);
    setCookie("email", "", 1);
    window.location = "#login";
}

// Checks User's login state. if didn't log in, moving him to the login screen
function checkLogin() {
    if (getCookie("email") === "") {
        alert("Please login first)");
        $.mobile.changePage('#login');
    }
}

$(document).ready(function()
{
    getLocation();
    
    // If the user wish to choose location from map, openning the map for him
    //  for now the user can really choose a location.
    $('#select_location').change(function() {
        if ($(this).find("option:selected").attr('value') === "fromMap") {
            setCookie("remTitle", document.getElementById('reminderTitle').value, 1);
            setCookie("remRadius", document.getElementById('radius').value, 1);
            setCookie("remDesc", document.getElementById('Description').value, 1);
            setCookie("remRingtone", document.getElementById('set_ringtone').value, 1);
            setCookie("remDate", document.getElementById('newReminderDate').value, 1);
            //setCookie("updateReminderId", updateReminderId, 1);
            
            window.location = "#mappage";
            /* need to refresh the page in order for the map to reload */
            location.reload();
        }
        else {
            if ($(this).find("option:selected").attr('value') !== "empty") {
                getLocationById($(this).find("option:selected").attr('value'));
            }
        }
    });
    
    //load it on page show
    $('#Login').on('pageshow', function() {
        clearInterval(timerId);
        formReset("loginForm");
    });
    //load it on page show
    $('#ExistingReminders').on('pageshow', function() {
        checkLogin();
        getReminders();
    });
    //load it on page show
    $('#newLocation').on('pageshow', function() {      
        checkLogin();
        location.reload();
    });
    //load it on page show
    $('#Settings').on('pageshow', function() {
        checkLogin();
    });
    //load it on page show
    $('#Help').on('pageshow', function() {
        checkLogin();
    });
    //load it on page show
    $('#About').on('pageshow', function() {
        checkLogin();
    });
    //load it on page show
    $('#Mappage').on('pageshow', function() {
        checkLogin();
    });
    // load it on page show
    $('#favoriteLocation').on('pageshow', function() {
        checkLogin();
        buildLocationsList();
    });
    // load it on page show
    $('#newReminder').on('pageshow', function() {
        
        // if updateReminderId is 0, than delete button is hidden
        if (getCookie("updateReminderId") == 0) {
            document.getElementById('deleteContainer').style.display="none";
        }
        
        checkLogin();
    });
    // load it on page show
    $('#mainpage').on('pageshow', function() {
        checkLogin();
        timerId = setInterval(mainFunction ,60000);
    });
});

// Sends an e-mail address by the user and checks if it exists
function recoverPassword(email)
{
    if (checkEmail(email)) {
        alert("Password was sent to your email address - soon...:)");
    } else {
        alert("Email not found");
    }
}

// Adds user to the database (after validating it)
function createUser(mail,pass1,pass2) {
    // Checking that the email and password are both valid before submitting to the server
    if (checkSettings(false,mail,pass1,pass2)) {
        console.log("Post a new user");
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: '/users',
            data: {
                'email': $('#signupmail').val(),
                'password': $('#signuppass1').val(),
                'defaultRadius' : true,
                'sound' : true,
                'lan' : "English",
                distUnit : "Km"
            },
            success: function(response) {
                console.log(response);
                $.mobile.changePage('#login');

                $('#login').trigger('create');
                formReset('signupForm');
            }
        });

        return false;

    }
}

// Reset a given form (with only text fields)
function formReset(form)
{
    document.getElementById(form).reset();
}

function checkEmail(email) {
    var status;
    if (!validateMail(email)) {
        return false;
    }
    //event.preventDefault();
    $.ajax({
        async: false,
        url: "/users/" + email,
        type: "GET",
        data: {
            'email': $('#email').val()
        },
        success: function(data, textStatus, jqXHR) {
            console.log("Post resposne:");
            console.log(data);
            console.log(textStatus);
            console.dir(jqXHR);
            if (data) {
                status = true;
            } else {
                status = false;
            }
        },
        error: function() {
            alert("error!");
        }

    });
    return status;
}

function validLogin(email, password) {
    if (checkEmail(email)) {
        $.ajax({
            url: '/users/' + email + '/' + password,
            type: "GET",
            data: {
                'email': $('#email').val()
                // 'password': $('#password').val()
            },
            success: function(data, textStatus, jqXHR) {
                console.log("Post resposne:");
                console.log(data);
                console.dir(data);
                console.log(textStatus);
                console.dir(jqXHR);
                if (data) {
                    setCookie("email", email, 1);
                    alert("Welcome");
                    $.mobile.changePage('#mainpage');
                    //timerId = setInterval(mainFunction ,60000);
                    formReset("loginForm");
                    getCookie("email");
                } else {
                    alert("Password or Email incorrect");
                }
            },
            error: function() {
                alert("Error");
            }

        });
        return false;
    } else {
        alert("Email is incorrect");
    }
}

function setCookie(param_name, value, exdays)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays===null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=param_name + "=" + c_value;
}

function getCookie(c_name)
{
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start === -1) {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start === -1) {
        c_value = null;
    }
    else
    {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end === -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start,c_end));
    }

    return c_value;
}


function mainFunction() {
    var remindersList = null;
    var request = false;
    var lng;
    var lat;
    var remindersLocation;
    var radius;
    request = new XMLHttpRequest();
    if (request)
    {
        request.open("GET", "/reminders");
        request.onreadystatechange = function() {
            if (request.readyState === 4 &&
                    request.status === 200)
            {
                remindersList = JSON.parse(request.responseText);
                getLocation();
                for (var i = 0; i < remindersList.length; i++) {
                    if (remindersList[i].active === "on") {
                         radius = remindersList[i].alertRadius;
                         lng = remindersList[i].locationLng;
                         lat = remindersList[i].locationLat;
                         remindersLocation = new google.maps.LatLng(lat, lng);
                        
                        rad = function(x) {return x*Math.PI/180;};

                        distHaversine = function(p1, p2) {
                          var R = 6371; // earth's mean radius in km
                          var dLat  = rad(currLat - lat);
                          var dLong = rad(currLng - lng);

                          var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                                  Math.cos(rad(lat)) * Math.cos(rad(currLat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
                          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                          var d = R * c;

                          return d.toFixed(3);
                        };
                        currentDist = distHaversine(pos, new google.maps.LatLng(currLat, currLng));

                        if (currentDist <= radius) {
                            var stop = confirm("You have a reminder!!\n"+ remindersList[i].description + "\npress ok to stop the reminder or cancel to continue");
                            if (stop == true)
                            {
                                document.getElementById('reminder' + remindersList[i].reminderId + '_state').value = "off";
                                updateState(i+1);
                                $.mobile.changePage('#mainpage');
                            }
                        }
                    }
                }
            }
        }
        ;
    }
    
    request.send(null);    
}

function getLocation()
{
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("Geolocation is not supported by this browser.");
    }
}
function showPosition(position)
{
    currLng = position.coords.longitude;
    currLat = position.coords.latitude;
    pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
}