(function () {
    "use strict";
    document.addEventListener( 'deviceready', onDeviceReady, false );

    function onDeviceReady() {
        document.getElementById('login').addEventListener('click', login, false);
        document.getElementById('guestLogin').addEventListener('click', guestLogin, false);
        document.getElementById('createAccountLink').addEventListener('click', createAccountLink, false);
        document.getElementById('createAccountBtn').addEventListener('click', createAccount, false);

        //Bottom Navigation Tabs
        $(document).delegate('[data-role="navbar"] a', 'click', function () {
            $(this).addClass('ui-btn-active');
            $('.tab-content').hide();
            $('#' + $(this).attr('data-href')).show();

            if ($("#liveTab").is(':visible')) {
                $(".ui-header .ui-title").text("Live Features");
                $("#events, #weekly, #moods, #map, #settings").removeClass("ui-btn-active");
            }
            else if ($("#eventsTab").is(':visible')) {                
                $(".ui-header .ui-title").text("Events");
                $("#live, #weekly, #moods, #map, #settings").removeClass("ui-btn-active");
            }
            else if ($("#weeklyTab").is(':visible')) {               
                $(".ui-header .ui-title").text("Weekly Deals");
                $("#live, #events, #moods, #map, #settings").removeClass("ui-btn-active");
            }
            else if ($("#moodsTab").is(':visible')) {
                $(".ui-header .ui-title").text("Moods");
                $("#live, #weekly, #events, #map, #settings").removeClass("ui-btn-active");
            }
            else if ($("#mapTab").is(':visible')) {
                $(".ui-header .ui-title").text("Map");
                $("#live, #weekly, #moods, #events, #settings").removeClass("ui-btn-active");
            }
            else if ($("#settingsTab").is(':visible')) {
                $(".ui-header .ui-title").text("Settings");
                $("#live, #weekly, #moods, #map, #events").removeClass("ui-btn-active");
            }
            return false;
        });

        //Panel Navigation Tabs
        $(document).delegate('[data-role="panel"] a', 'click', function () {
            $('#live, #events, #weekly, #moods, #map, #settings').removeClass('ui-btn-active');
            $('.tab-content').hide();
            $('#' + $(this).attr('data-href')).show();

            if ($("#recentTab").is(':visible')) {
                $(".ui-header .ui-title").text("Recent Visits");
            }
            else if ($("#conciergeTab").is(':visible')) {
                $(".ui-header .ui-title").text("Concierge");
            }
            else if ($("#contactTab").is(':visible')) {
                $(".ui-header .ui-title").text("Contact Us");
            }
            else if ($("#aboutTab").is(':visible')) {
                $(".ui-header .ui-title").text("About Us");
            }
            else if ($("#logoutTab").is(':visible')) {
                $(".ui-header .ui-title").text("Logout");
            }
            else if ($("#manageRestaurantTab").is(':visible')) {
                $(".ui-header .ui-title").text("Manage Profile");
            }
            else if ($("#createRestaurantTab").is(':visible')) {
                $(".ui-header .ui-title").text("Create Profile");
            }
            $("[data-role=panel]").panel("close");
            return false;
        });

        //Loading Spinner
        $(document).on({
            ajaxSend: function () {
                loading('show');
            },
            ajaxStart: function () {
                loading('show');
            },
            ajaxStop: function () {
                loading('hide');
            },
            ajaxError: function () {
                loading('hide');
            }
        });

        function loading(showOrHide) {
            setTimeout(function(){
                $.mobile.loading(showOrHide);
            }, 1); 
        }   
    }
})();

function login() {
    if ($("#loginEmail").val().length === 0 && $("#loginPassword").val().length === 0) {
        emptyLoginFieldsAlert();
        return;
    }
    else if ($("#loginEmail").val().length === 0) {
        emailAlert();
        return;
    }   
    else if ($("#loginPassword").val().length === 0) {
        passwordAlert();
        return;
    }
    else  {
        var dat = {
            email: $('#loginEmail').val(),
            password: $('#loginPassword').val()
        };

        var params = JSON.stringify(dat);

        $.ajax({
            url: 'https://bdaltx93vd.execute-api.us-east-1.amazonaws.com/prod/login', 
            type: "POST", 
            contentType: 'application/json',
            dataType: 'json', 
            data: params, 
            success: function (result) {
                        if (result.errorMessage) {
                            navigator.notification.alert(
                                result.errorMessage,
                                null,
                                'Login unsuccessful',
                                'ok'
                            );
                        }
                        else {
                            setTimeout(function () { $.mobile.changePage('#mainPage', { transition: "flip" }); }, 50);
                            $("#live").addClass('ui-btn-active ui-state-persist');
                            $("#map").removeClass('ui-btn-active ui-state-persist');
                            $('.tab-content').hide();
                            $("#liveTab").show();
                            $(".pagetitle").text("Live Features");
                            $("#live, #events, #weekly, #moods, #settings, #recent, #concierge, #logout, #manageRestaurant, #createRestaurant").removeClass('ui-disabled');
                        }
                     },
            error: function (xhr, resp, text) {
                        navigator.notification.alert(
                            'Please enter a valid email address and password',
                            null,
                            'Login unsuccessful',
                            'ok'
                        );
                   }
        });      
    }
}

function guestLogin() {
    setTimeout(function () { $.mobile.changePage('#mainPage', { transition: "flip" }); }, 50);
    $("#live").removeClass('ui-btn-active ui-state-persist');
    $("#map").addClass('ui-btn-active ui-state-persist');
    $('.tab-content').hide();
    $("#mapTab").show();
    $(".pagetitle").text("Map");
    $("#live, #events, #weekly, #moods, #settings, #recent, #concierge, #logout, #manageRestaurant, #createRestaurant").addClass('ui-disabled');
}

function createAccount() {
    if ($("#createEmail").val().length === 0 && $("#createName").val().length === 0 && $("#createPassword").val().length === 0 &&
        $("#confirmPassword").val().length === 0) {
        emptyCreateFieldsAlert();
        return;
    }
    else if ($("#createEmail").val().length === 0) {
        emailAlert();
        return;
    }
    else if (isValidEmailAddress($("#createEmail").val()) === false) {
        invalidEmailAlert();
        return;
    }
    else if ($("#createName").val().length === 0) {
        nameAlert();
        return;
    }
    else if ($("#createName").val().length < 2 || $("#createName").val().length > 15) {
        nameLengthAlert();
        return;
    }
    else if ($("#createPassword").val().length === 0) {
        passwordAlert();
        return;
    }
    else if ($("#createPassword").val().length < 5 || $("#createPassword").val().length > 15) {
        passwordLengthAlert();
        return;
    }
    else if ($("#confirmPassword").val().length === 0) {
        confirmPasswordAlert();
        return;
    }
    else {
        var password = $('#createPassword').val();
        var confirmPassword = $('#confirmPassword').val();
        if (password !== confirmPassword) {
            navigator.notification.alert(
                'Passwords do not match',
                null,
                'Please double check information',
                'ok'
            );
            return;
        }
        else {
            var dat = {
                email: $('#createEmail').val(),
                name: $('#createName').val(),
                password: $('#createPassword').val()
            };

            var params = JSON.stringify(dat);

            $.ajax({
                url: 'https://bdaltx93vd.execute-api.us-east-1.amazonaws.com/prod/createaccount',
                type: "POST",
                contentType: 'application/json',
                dataType: 'json',
                data: params,
                success: function (result) {
                            if (result.errorMessage) {
                                navigator.notification.alert(
                                    result.errorMessage,
                                    null,
                                    'Account creation error',
                                    'ok'
                                );
                            }
                            else {
                                navigator.notification.alert(
                                    'Please login with your username and password',
                                    null,
                                    'Account successfully created',
                                    'ok'
                                );
                                $.mobile.changePage('#loginPage', { transition: "flip" });
                            }                   
                         },
                error: function (xhr, resp, text) {
                            navigator.notification.alert(
                                'Account not created',
                                null,
                                'Error',
                                'ok'
                            );
                       }
            });
        }
    }
}

function emptyLoginFieldsAlert() {
    navigator.notification.alert(
        'Please enter your login information',
        null,
        'Missing email and password',
        'ok'
    );
}

function emptyCreateFieldsAlert() {
    navigator.notification.alert(
        'Please enter all required information',
        null,
        'Missing fields',
        'ok'
    );
}

function emailAlert() {
    navigator.notification.alert(
        'Please enter a valid email address',
        null,
        'Missing email address',
        'ok'
    );
}

function nameAlert() {
    navigator.notification.alert(
        'Please enter your name',
        null,
        'Missing name',
        'ok'
    );
}

function nameLengthAlert() {
    navigator.notification.alert(
        'Name must be between 2 and 15 characters',
        null,
        'Invalid name length',
        'ok'
    );
}

function passwordAlert() {
    navigator.notification.alert(
        'Please enter a valid password',
        null,
        'Missing password',
        'ok'
    );
}

function passwordLengthAlert() {
    navigator.notification.alert(
        'Password must be between 5 and 15 characters',
        null,
        'Invalid password length',
        'ok'
    );
}

function confirmPasswordAlert() {
    navigator.notification.alert(
        'Please enter a valid password',
        null,
        'Missing confirmed password',
        'ok'
    );
}

function isValidEmailAddress(email) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(email);
}

function invalidEmailAlert() {
    navigator.notification.alert(
        'Please enter a valid email address',
        null,
        'Invalid email address',
        'ok'
    );
}

function createAccountLink() {
    $.mobile.changePage('#createAccountPage', { transition: "flip" });
}