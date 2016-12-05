function getThemes() {
    const baseUrl = "https://baas.kinvey.com/appdata/kid_HJ1-7ACGx/";
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " +
        btoa(sessionStorage.username + ":" + sessionStorage.pass)
    };
    $.ajax({
        method: "GET",
        url: baseUrl +"themes",
        headers: kinveyAppAuthHeaders
    }).then(function (result) {
        $('#themes').find(".theme").remove();
        $('#themes').find("br").remove();
        for(let theme of result){
            let div = $('<a href="#forum">');
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
        headers: kinveyAppAuthHeaders,
    }).then(function (result) {
        $('#forumQuestions').find(".question").remove();
        let counter = 0;
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
            //let table = $('<table  class="table forum table-striped">');
            let tr = $("<tr>\n");
            let icon;
            switch (counter){
                case 1:icon=typeOfTheme.music;break;
                case 2:icon=typeOfTheme.game;break;
                case 3:icon=typeOfTheme.school;break;
                case 4:icon=typeOfTheme.sport;break;
                case 0:icon=typeOfTheme.nature;break;
            }
            let tdShit = $('<td>');
            tdShit.append(div);
            tr.append($(`<td class="text-center">${icon}`))
                .append(tdShit)
                .append('<td class="text-center hidden-xs hidden-sm">comments</a></td>\n')
                .append('<td class="text-center hidden-xs hidden-sm">date</a></td>\n')
                .append('<td class="hidden-xs hidden-sm">by <a href="#">user that created this question</a></td>\n');
            //tr.append(div);
            $('#questionsTable').append(tr);
            counter++;
        }
    })
}
