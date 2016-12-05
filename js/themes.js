$('#themes-bar').click(function getThemes() {
    const baseUrl = "https://baas.kinvey.com/appdata/kid_HJ1-7ACGx/";
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " +
        btoa(sessionStorage.username + ":" + sessionStorage.pass)
    };
    $.ajax({
        method: "GET",
        url: baseUrl +"themes",
        headers: kinveyAppAuthHeaders,
    }).then(function (result) {
        $('#themes').find(".theme").remove();
        for(let theme of result){
            let div = $('<div>');
            div.addClass("theme");
            div.text(theme.title);
            $('#themes').append(div);
        }
    });
    $.ajax({
        method: "GET",
        url: baseUrl + "questions",
        headers: kinveyAppAuthHeaders,
    }).then(function (result) {
        $('#forumQuestions').find(".question").remove();
        for(let question of result){
            let div = $('<div>');
            div.addClass("question");
            div.text(question.title);
            $('#forumQuestions').append(div);
        }
    })
});