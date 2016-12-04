$('#zdr').click(function getThemes() {
    const baseUrl = "https://baas.kinvey.com/appdata/kid_HJ1-7ACGx/themes";
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " +
        btoa(sessionStorage.username + ":" + sessionStorage.pass)
    };
    $.ajax({
        method: "GET",
        url: baseUrl,
        headers: kinveyAppAuthHeaders,
    }).then(function (result) {
        for(let theme of result){
            let div = $('<div>');
            div.addClass("theme");
            div.text(theme.title);
            $('#themes').append(div);
        }
    })
});