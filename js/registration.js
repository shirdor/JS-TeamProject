function startApp() {

    $('#warningBox, #errorBox').click(function () {
        $(this).fadeOut();
    });

    const baseUrl = 'https://baas.kinvey.com/';
    const appId = 'kid_HJ1-7ACGx';
    const appPass = '8370d0fa322f4ad5b9df1b787b3dad5b';
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " +
        btoa(appId + ":" + appPass)
    };

    if(sessionStorage.username){
        getThemes();
    }

    showBars();

    let current, next;
    let left, opacity, scale;
    let arr = [];
    $(".next").click(buttonNext);
    $(".register").click(registerUser);
    $('#btnLogin').click(loginClicked);
    $('#logout-bar').click(logoutClicked);
    $('#edit').click(editProfile);
    function buttonNext() {
        let field = $(this).parent().find('input');
        for (let el of field) {
            if ($(el).val() == 'Next' || $(el).val() == 'Register') {
            }
            else {
                arr.push($(el).val());
            }
        }

        current = $(this).parent();
        next = $(this).parent().next();

        next.show();
        current.animate({opacity: 0}, {
            step: function (now, mx) {
                scale = 1 - (1 - now) * 0.2;
                left = (now * 50) + "%";
                opacity = 1 - now;
                current.css({
                    'transform': 'scale(' + scale + ')',
                    'position': 'absolute'
                });
                next.css({'left': left, 'opacity': opacity});
            },
            duration: 1000,
            complete: function () {
                current.hide();
            },
            easing: 'easeInOutBack'
        });
    }


    function registerUser() {
        let field = $(this).parent().find('input');
        for (let el of field) {
            if ($(el).val() == 'Next' || $(el).val() == 'Register') {
            }
            else {
                arr.push($(el).val());
            }
        }
        let username = arr[0];
        let pass = arr[1];
        let passConfirmed = arr[2];
        let phoneNumber = arr[4];
        if (pass == passConfirmed && pass!="" && pass!=undefined && passConfirmed!="" && passConfirmed!=undefined
            && pass.length > 3 && username != '' && username != undefined && username.length > 3 && phoneNumber == Number) {
            let userData = {
                "username": arr[0],
                "password": pass,
                "full_name": arr[3],
                "phone_number":arr[4],
                "facebook":arr[5],
                "e_mail" :arr[6],
                "comment":0,
                "question":0
            };
            $.ajax({
                method: "POST",
                url: baseUrl + "user/" + appId + "/",
                headers: kinveyAppAuthHeaders,
                data: userData,
                success: registerSuccess,
                error: handleAjaxError
            });
        }
        else if(arr.filter(e=>e=='').length!=0){
            showError("You have not filled all boxes. Please reload and try again.");
        }
        else {
            showError("You have something wrong! Please reload and try again.");
            showWarning('Username and password must be with at least 4 characters, phone number must contains only numbers!');
        }
        function registerSuccess() {
            showInfo('User registration successful.');
            let regUsername = $('.registerUsername').val();
            let regPassword = $('.registerPassword').val();

            loginClicked(regUsername,regPassword);
        }
    }
    function saveAuthInSession(userInfo) {

        let userAuth = userInfo._kmd.authtoken;
        let userId = userInfo._id;
        sessionStorage.setItem('authToken', userAuth);
        sessionStorage.setItem('userId', userId);
    }
    function loginClicked(param1, param2) {
        let userData;
        if(param1&&param2){
            userData = {
                username: param1,
                password: param2
            };
            //console.log('asam bonak');
        }
        else {
            userData = {
                username: $('.login-form1 input[name=username]').val(),
                password: $('.login-form1 input[name=password]').val()
            };
            //console.log('asam 1');
        }
        sessionStorage.setItem("username", userData.username);
        sessionStorage.setItem("pass", userData.password);

        $.ajax({
            method: "POST",
            url: baseUrl + "user/" + appId + "/login",
            data: JSON.stringify(userData),
            headers: kinveyAppAuthHeaders,
            contentType: "application/json",
            success: loginSuccess,
            error: handleAjaxError
        });

        function loginSuccess(userInfo) {

            saveAuthInSession(userInfo);
            showInfo('User login successful.');
            profileUpdate(userInfo);
            showBars();
        }
            getThemes()
    }
    function x() {
        $.ajax({
            method: "GET",
            url: "https://baas.kinvey.com/user/kid_HJ1-7ACGx/"+sessionStorage.getItem('userId'),
            headers: {'Authorization': 'Kinvey '+ sessionStorage.getItem('authToken')},
            success: profileUpdate,
            error: handleAjaxError
        });
    }

    function logoutClicked() {
        sessionStorage.clear();
        $('.login-form1 input[name=username]').val('');
        $('.login-form1 input[name=password]').val('');
        showBars();
        showInfo('Logout successful');
    }

    function handleAjaxError(response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON &&
            response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        showError(errorMsg);
    }
    function showError(errorMsg) {
        $('#errorBox').text("Error: " + errorMsg);
        $('#errorBox').show();
    }
    function showInfo(message) {
        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(function () {
            $('#infoBox').fadeOut();
        }, 3000);
    }
    function showWarning(warningMessage) {
        $('#warningBox').text("Warning: " + warningMessage);
        $('#warningBox').show();
    }

    function showBars() {
        if (sessionStorage.getItem('authToken')) {
            // We have logged in user
            $('#questionsAndComments').show();
            $('#about').hide();
            $('#contact').hide();
            $('#profile').show();
            $('#about-bar').show();
            $('#login-bar').hide();
            $("#register-bar").hide();
            $("#themes-bar").show();
            $("#logout-bar").show();
            $('#forum').show();
            $('#profile-bar').show();
            $('#searchedProfile').hide();
            x();
        } else {
            // No logged in user
            $('#questionsAndComments').hide();
            $('#searchedProfile').hide();
            $('#about').show();
            $('#contact').show();
            $('#profile').hide();
            $('#services').hide();
            $('#about-bar').show();
            $('#login-bar').show();
            $("#register-bar").show();
            $("#themes-bar").hide();
            $("#logout-bar").hide();
            $('#forum').hide();
            $('#profile-bar').hide();
        }
    }
    function profileUpdate(obj) {
        let userName=obj.full_name;
        let userPhone=obj.phone_number;
        let userEmail=obj.e_mail;
        let userFacebook=obj.facebook;
        $('#zero').empty();
        $('#zero').append($('<h2>').text(userName));
        $('#one').empty();
        $('#one').html('<i class="fa fa-phone-square"></i> '+userPhone);
        $('#two').empty();
        $('#two').html('<i class="fa fa-envelope"></i> '+userEmail);
        $('#three').empty();
        $('#three').html('<i class="fa fa-facebook-official"></i> '+userFacebook);
        $('#comments').text(obj.comment);
        $('#questions').text(obj.question);
    }
    function editProfile() {
        $.ajax({
                    method: "GET",
                    url: "https://baas.kinvey.com/user/kid_HJ1-7ACGx/"+sessionStorage.getItem('userId'),
                    headers: {'Authorization': 'Kinvey '+ sessionStorage.getItem('authToken')},
                    success: updateProfile,
                    error: handleAjaxError
                });
        }

    function updateProfile(userData) {
        switch ($('#section').val().toString()) {
            case 'full_name':
            {
                let data = {
                    "phone_number": userData.phone_number,
                    "e_mail": userData.e_mail,
                    "facebook": userData.facebook,
                    "full_name":$('#changes').val(),
                    "comment" : userData.comment,
                    "question" : userData.question
                };
                $.ajax({
                    method: "PUT",
                    url: "https://baas.kinvey.com/user/kid_HJ1-7ACGx/"+sessionStorage.getItem('userId'),
                    headers: {'Authorization': 'Kinvey '+ sessionStorage.getItem('authToken')},
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: showBars("You have changed your name successfully"),
                    error: handleAjaxError
                });
                showBars()
            }break;
            case 'phone_number':
            {
                let data = {
                    "full_name": userData.full_name,
                    "e_mail": userData.e_mail,
                    "facebook": userData.facebook,
                    "phone_number":$('#changes').val(),
                    "comment" : userData.comment,
                    "question" : userData.question
                };
                $.ajax({
                    method: "PUT",
                    url: "https://baas.kinvey.com/user/kid_HJ1-7ACGx/"+sessionStorage.getItem('userId'),
                    headers: {'Authorization': 'Kinvey '+ sessionStorage.getItem('authToken')},
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: showBars("You have changed your name successfully"),
                    error: handleAjaxError
                });
                showBars()
            }break;
            case 'e_mail':
        {
            let data = {
                "full_name": userData.full_name,
                "phone_number": userData.phone_number,
                "facebook": userData.facebook,
                "e_mail":$('#changes').val(),
                "comment" : userData.comment,
                "question" : userData.question
            };
            $.ajax({
                method: "PUT",
                url: "https://baas.kinvey.com/user/kid_HJ1-7ACGx/"+sessionStorage.getItem('userId'),
                headers: {'Authorization': 'Kinvey '+ sessionStorage.getItem('authToken')},
                data: JSON.stringify(data),
                contentType: "application/json",
                success: showBars("You have changed your name successfully"),
                error: handleAjaxError
            });
            showBars()
        }break;
        case 'facebook_link':
        {
            let data = {
                "full_name": userData.full_name,
                "phone_number": userData.phone_number,
                "e_mail": userData.e_mail,
                "facebook":$('#changes').val(),
                "comment" : userData.comment,
                "question" : userData.question
            };
            $.ajax({
                method: "PUT",
                url: "https://baas.kinvey.com/user/kid_HJ1-7ACGx/"+sessionStorage.getItem('userId'),
                headers: {'Authorization': 'Kinvey '+ sessionStorage.getItem('authToken')},
                data: JSON.stringify(data),
                contentType: "application/json",
                success: showBars("You have changed your name successfully"),
                error: handleAjaxError
            });
            showBars()
        }break;
        }
        $('#changes').val('');
    }
}
