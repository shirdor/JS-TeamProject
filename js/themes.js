function getThemes() {
    const baseUrl = "https://baas.kinvey.com/appdata/kid_HJ1-7ACGx/";
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " +
        btoa(sessionStorage.username + ":" + sessionStorage.pass)
    };
    let idsAndTitles=[];
    $.ajax({
        method: "GET",
        url: baseUrl +"themes",
        headers: kinveyAppAuthHeaders
    }).then(function (result) {
        $('#themes').find(".theme").remove();
        $('#themes').find("br").remove();
        for(let theme of result){
            let div = $('<span>');
            div.addClass("theme");
            div.attr('id', theme.title);
            div.text(theme.title);
            div.click(function () {
                        $('#questionsHeader').text(`${theme.title}`);
                    //    time to GET the questions from the datebase
                    }
            );
            $('#themes').append(div).append($('<br>'));
        }
    });
    $.ajax({
        method: "GET",
        url: baseUrl + "questions",
        headers: kinveyAppAuthHeaders
    }).then(function (result) {
        $('#forumQuestions').find(".question").remove();
        let typeSelect=['58442f0a101d805b6762b239','58442f1c101d805b6762b258','584430bb01bde1035e68b9bf','58459817d23505ed75c2386e','58442f1301bde1035e68a155'];
        let typeOfTheme = {
            music:'<i class="fa fa-music fa-2x text-primary"></i></td>',
            game:'<i class="fa fa-gamepad  fa-2x text-primary"></i>',
            school:'<i class="fa fa-graduation-cap fa-2x text-primary"></i>',
            nature:'<i class="fa fa-leaf fa-2x text-primary"></i>',
            sport:'<i class="fa fa-futbol-o fa-2x text-primary"></i>'
        };
        for(let question of result){
            let div = $('<a href="#questionsAndComments">');
            div.addClass("question");
            div.text(question.title);
            div.click(
                function () {
                    $('#questionsAndCommentsHeader').text(`${question.title}`);
                    $('#questionsAndCommentsHeaderBody').text('asam laino');
                }
            );
            let tr = $("<tr>\n");
            let icon;
            switch (question.themeId){
                case typeSelect[1]:icon=typeOfTheme.music;break;
                case typeSelect[4]:icon=typeOfTheme.game;break;
                case typeSelect[2]:icon=typeOfTheme.school;break;
                case typeSelect[0]:icon=typeOfTheme.sport;break;
                case typeSelect[3]:icon=typeOfTheme.nature;break;
            }

            let comments=question.comments;
            let date=question.date;
            idsAndTitles.push({"title":question.title, "id":question._id});
            let link=$((`<td class="hidden-xs hidden-sm" style="color: #fed136">by <a href ="#"id="profileLink" >${question.username}</a></td>\n`))
                .click(function(event){
                    event.preventDefault();
                    getProfile(question.authorId,question.authorAuthToken);
                });
            let tdShit = $('<td>');
            tdShit.append(div);
            tr.append($(`<td class="text-center">${icon}`))
                .append(tdShit)
                .append(`<td class="text-center hidden-xs hidden-sm" style="color: #fed136">${comments}</a></td>\n`)
                .append(`<td class="text-center hidden-xs hidden-sm" style="color: #fed136">${date}</a></td>\n`)
                .append(link);
            //tr.append(div);
            $('#questionsTable').prepend(tr);
        }

    });
    function getProfile(userId,userAuth) {
        $.ajax({
            method: "GET",
            url: "https://baas.kinvey.com/user/kid_HJ1-7ACGx/"+userId,
            headers: {'Authorization': 'Kinvey '+ userAuth}
        }).then(function (userInfo) {
            let userName=userInfo.full_name;
            let userPhone=userInfo.phone_number;
            let userEmail=userInfo.e_mail;
            let userFacebook=userInfo.facebook;
            $('#profile').hide();
            $('#searchedProfile').show();
            $('#profileZero').empty();
            $('#profileZero').append($('<h2>').text(userName));
            $('#profileOne').empty();
            $('#profileOne').html('<i class="fa fa-phone-square"></i> '+userPhone);
            $('#profileTwo').empty();
            $('#profileTwo').html('<i class="fa fa-envelope"></i> '+userEmail);
            $('#profileThree').empty();
            $('#profileThree').html('<i class="fa fa-facebook-official"></i> '+userFacebook);
            $('#profileSearchedComments').text(userInfo.comment);
            $('#profileSearchedQuestions').text(userInfo.question);
        })
    }
    $('#goNormal').click(function () {
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
    })
}

function createTheme() {
        $.ajax({
            method: "GET",
            url: "https://baas.kinvey.com/user/kid_HJ1-7ACGx/"+sessionStorage.getItem('userId'),
            headers: {'Authorization': 'Kinvey '+ sessionStorage.getItem('authToken')},
            success: profileUpdate,
        });

    function profileUpdate(userData) {
        let num = userData.question + 1;
        console.log(num)
        let userName=userData.full_name;
        let userPhone=userData.phone_number;
        let userEmail=userData.e_mail;
        let userFacebook=userData.facebook;
        $('#zero').empty();
        $('#zero').append($('<h2>').text(userName));
        $('#one').empty();
        $('#one').html('<i class="fa fa-phone-square"></i> '+userPhone);
        $('#two').empty();
        $('#two').html('<i class="fa fa-envelope"></i> '+userEmail);
        $('#three').empty();
        $('#three').html('<i class="fa fa-facebook-official"></i> '+userFacebook);
        $('#comments').text(userData.comment);
        $('#questions').text(num);
        let data = {
            "full_name": userData.full_name,
            "e_mail": userData.e_mail,
            "facebook": userData.facebook,
            "phone_number":userData.phone_number,
            "comment" : userData.comment,
            "question" : num
        };
        $.ajax({
            method: "PUT",
            url: "https://baas.kinvey.com/user/kid_HJ1-7ACGx/"+sessionStorage.getItem('userId'),
            headers: {'Authorization': 'Kinvey '+ sessionStorage.getItem('authToken')},
            data: JSON.stringify(data),
            contentType: "application/json",
            success: showInfo("You have changed your name successfully"),
        });
    }
    const baseUrl = "https://baas.kinvey.com/appdata/kid_HJ1-7ACGx/";
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " +
        btoa(sessionStorage.username + ":" + sessionStorage.pass)
    };
    let idsAndTitles=[];
    let typeSelect=['58442f0a101d805b6762b239','58442f1c101d805b6762b258','584430bb01bde1035e68b9bf','58459817d23505ed75c2386e','58442f1301bde1035e68a155'];

    let question = $('#text-add-question').val();
    let chosenTheme = $('#section-add-question option:selected').val();
    let icon;
    switch (chosenTheme){
        case "music":icon=typeSelect[1];break;
        case "games":icon=typeSelect[4];break;
        case "school":icon=typeSelect[2];break;
        case "sport":icon=typeSelect[0];break;
        case "nature":icon=typeSelect[3];break;
    }
    let date = new Date();

    let str = `${date.getDate()}-${1 + date.getMonth()}-${1900 + date.getYear()}`;

    let dataToAdd = {
        title: question,
        authorId: sessionStorage.getItem('userId'),
        themeId: icon,
        date: str,
        comments: 0,
        authorAuthToken: sessionStorage.getItem('authToken'),
        username: sessionStorage.getItem('username')
    };
    $.ajax({
        method: "POST",
        url: baseUrl +"questions",
        headers: {'Authorization': 'Kinvey '+ sessionStorage.getItem('authToken')},
        data: JSON.stringify(dataToAdd),
        contentType: "application/json"
    }).then(function (result) {
        getThemes();
    });
}

function showInfo(message) {
    $('#infoBox').text(message);
    $('#infoBox').show();
    setTimeout(function () {
        $('#infoBox').fadeOut();
    }, 3000);
}


