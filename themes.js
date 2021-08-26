/// these are different mode themes
/// don't say anywhere about this pls 🙃


/* BLACK mode */

function blackMode () {
    console.log("Black mode is active or don`t)");
    $(".mode_button").css("background-color","blue");

    if (isStreamsSwapped) {
        isStreamsSwapped = false;
        document.getElementById("id_mode_button_swap_streams").style.background = "rgb(0,30,255)";
    } else {
        isStreamsSwapped = true;
        document.getElementById("id_mode_button_swap_streams").style.background = "rgba(236, 38, 103, 0.5)";
    }

    //let black = document.getElementsByClassName("mode_button");
    //black.style.backgroundColor = (black.style.backgroundColor === 'black') ? 'rgba(76, 175, 80, 0.5)' : 'black';
}

$(document).keydown(function (e) {
    if (e.which == 66) {
        blackMode();
    }
    return e;
});