function startApp() {
    showBars();
    const baseUrl = 'https://baas.kinvey.com/';
    const appId = 'kid_HJ1-7ACGx';
    const appPass = '8370d0fa322f4ad5b9df1b787b3dad5b';
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " +
        btoa(appId + ":" + appPass)
    };

    let current, next;
    let left, opacity, scale;
    let arr = [];
    $(".next").click(buttonNext);
    $(".register").click(registerUser);
    $('#btnLogin').click(loginClicked);
    $('#logout-bar').click(logoutClicked);

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
        let pass = arr[1];
        let passConfirmed = arr[2];
        if (pass == passConfirmed && pass!="" && pass!=undefined && passConfirmed!="" && passConfirmed!=undefined ) {
            let userData = {
                "username": arr[0],
                "password": pass,
                "full_name": arr[3],
                "phone_number":arr[4],
                "facebook":arr[5],
                "e-mail" :arr[6]
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
            showError("You have two different passwords. Please reload and try again.");
        }
        function registerSuccess(userInfo) {
            saveAuthInSession(userInfo);
            showInfo('User registration successful.');

        }
    }
    function saveAuthInSession(userInfo) {

        let userAuth = userInfo._kmd.authtoken;
        let userId = userInfo._id;
        sessionStorage.setItem('authToken', userAuth);
        sessionStorage.setItem('userId', userId);
    }
    function loginClicked() {

        let userData = {
            username: $('.login-form1 input[name=username]').val(),
            password: $('.login-form1 input[name=password]').val()
        };

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
            showBars();
        }
    }


    function logoutClicked() {
        sessionStorage.clear();
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
        setTimeout(function () {
            $('#infoBox').fadeOut();
        }, 3000);

    }
    function showInfo(message) {
        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(function () {
            $('#infoBox').fadeOut();
        }, 3000);
    }

    function showBars() {
        if (sessionStorage.getItem('authToken')) {
            // We have logged in user
            $('#about-bar').show();
            $("#themes-bar").show();
            $('#login-bar').hide();
            $("#register-bar").hide();
            $("#logout-bar").show();
        } else {
            // No logged in user
            $('#about-bar').show();
            $('#login-bar').show();
            $("#register-bar").show();
            $("#themes-bar").hide();
            $("#logout-bar").hide();
        }
    }
}
