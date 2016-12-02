function startApp() {
    sessionStorage.clear();
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
        console.log(arr);
        let pass = arr[1];
        let passConfirmed = arr[2];

        if (pass == passConfirmed) {
            let userData = {
                username: arr[0],
                password: pass
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
        else {
            showError("You have two different passwords. Please reload the page and try again");
        }
        function registerSuccess() {
            showInfo("Registration Successful")
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
    }
}