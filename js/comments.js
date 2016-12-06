function getComments(question) {
    const baseUrl = "https://baas.kinvey.com/appdata/kid_HJ1-7ACGx/";
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " +
        btoa(sessionStorage.username + ":" + sessionStorage.pass)
    };
    $.ajax({
        method: "GET",
        url: baseUrl + "comments",
        headers: kinveyAppAuthHeaders,
    }).then(function (res) {
        for (let c of res){
            if(c.questionId == question._id){
                let tr = $('tr');
                let tdComment = $('td');
                tdComment.text(c.content);
                tdComment.addClass('commentContent');

                let tdDate = $('td');
                tdDate.text(c.date);
                tdDate.addClass('commentDate');

                let tdUser = $('td');
                $.get("https://baas.kinvey.com/user/kid_HJ1-7ACGx/" + c.authorId)
                    .then(function (user) {
                        tdUser.text(user.username)
                });

                tdUser.addClass("commentUser");
                tr.append(tdComment);
                tr.append(tdDate);
                tr.append(tdUser);
                tr.addClass('comment');
                $('#questionComments').append(tr);

            }
        }
    })
}