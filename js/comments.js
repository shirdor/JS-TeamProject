function getComments(question) {
    const baseUrl = "https://baas.kinvey.com/appdata/kid_HJ1-7ACGx/";
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " +
        btoa(sessionStorage.username + ":" + sessionStorage.pass)
    };
    $('#share').click(function(event){event.preventDefault();addComment(question);});
    $.ajax({
        method: "GET",
        url: baseUrl + "comments",
        headers: kinveyAppAuthHeaders
    }).then(function (res) {
        $('.comment').remove();
        for (let c of res) {
            if (c.questionId == question._id) {
                let tr = $('<tr>');
                let tdComment = $('<td>');
                tdComment.text(c.content.content);
                tdComment.addClass('commentContent');
                // let commentId = ;

                let tdDate = $('<td>');
                tdDate.text(c.date);
                tdDate.addClass('commentDate');

                let tdUser = $('<td>');
                tdUser.text(c.username);
                tdUser.addClass("commentUser");

                let actions = $('<td>');
                if (c.username == sessionStorage.getItem('username')) {
                    let href = $('<a href="#questionsAndComments">')
                        .text("[Delete]")
                        .click(
                            deleteComment.bind(this, c, question)
                        );
                    actions.append(href);
                }

                tr.append(tdComment);
                tr.append(tdDate);
                tr.append(tdUser);
                tr.append(actions);
                tr.addClass('comment');
                $('#questionComments').prepend(tr);
            }
        }
    });

}
function deleteComment(comment,question) {
    const baseUrl = "https://baas.kinvey.com/appdata/kid_HJ1-7ACGx/";
    
    console.dir(comment._id);
    $.ajax({
        method: "DELETE",
        url: baseUrl + "comments/" + comment._id,
        headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`}

    }).then(function () {
        getComments(question);
        showInfo('You have deleted your comment')
    });

}
function addComment(q) {
    $('.comment').remove();
    const baseUrl = "https://baas.kinvey.com/appdata/kid_HJ1-7ACGx/";
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " +
        btoa(sessionStorage.username + ":" + sessionStorage.pass)
    };
    let date = new Date();

    let str = `${date.getDate()}-${1 + date.getMonth()}-${1900 + date.getYear()}`;
    let data={
        content:{content:$('#comment').val()},
        date:str,
        questionId:q._id,
        username: sessionStorage.getItem('username')
    };
    $.ajax({
        method: "POST",
        url: baseUrl +"comments",
        headers: {'Authorization': 'Kinvey '+ sessionStorage.getItem('authToken')},
        data: JSON.stringify(data),
        contentType: "application/json"
    }).then(function (event) {
        getComments(q);
        showInfo('Please reload the question')
    });
    $.ajax({
        method: "GET",
        url: "https://baas.kinvey.com/user/kid_HJ1-7ACGx/"+sessionStorage.getItem('userId'),
        headers: {'Authorization': 'Kinvey '+ sessionStorage.getItem('authToken')},
        success: profileUpdate
    });

    function profileUpdate(userData) {
        let num = userData.comment + 1;
        console.log(num);
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
        $('#comments').text(num);
        $('#questions').text(userData.question);
        let data = {
            "full_name": userData.full_name,
            "e_mail": userData.e_mail,
            "facebook": userData.facebook,
            "phone_number":userData.phone_number,
            "comment" : num,
            "question" : userData.question
        };
        $.ajax({
            method: "PUT",
            url: "https://baas.kinvey.com/user/kid_HJ1-7ACGx/"+sessionStorage.getItem('userId'),
            headers: {'Authorization': 'Kinvey '+ sessionStorage.getItem('authToken')},
            data: JSON.stringify(data),
            contentType: "application/json",
        });



    }
}