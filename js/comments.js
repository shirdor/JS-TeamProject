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
            $('.comment').remove();
            for (let c of res){
                if(c.questionId == question._id) {
                    let tr = $('<tr>');
                    let tdComment = $('<td>');
                    tdComment.text(c.content.content);
                    tdComment.addClass('commentContent');

                    let tdDate = $('<td>');
                    tdDate.text(c.date);
                    tdDate.addClass('commentDate');

                    let tdUser = $('<td>');
                    tdUser.text(c.username);
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