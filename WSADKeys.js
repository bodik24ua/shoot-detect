let isQ_ButtonPushed = false;
let isE_ButtonPushed = false;
let isW_ButtonPushed = false;
let isA_ButtonPushed = false;
let isS_ButtonPushed = false;
let isD_ButtonPushed = false;

let isUP_ButtonPushed = false;
let isDOWN_ButtonPushed = false;
let isRIGHT_ButtonPushed = false;
let isLEFT_ButtonPushed = false;
let isZERO_ButtonPushed = false;

let isANY_ButtonPushed = false;
let strButtonStatus


function set_keydown(key_code) {
    if (key_code === 'ArrowUp')
        isUP_ButtonPushed = true;
    else if (key_code === 'ArrowDown')
        isDOWN_ButtonPushed = true;
    else if (key_code === 'ArrowRight')
        isRIGHT_ButtonPushed = true;
    else if (key_code === 'ArrowLeft')
        isLEFT_ButtonPushed = true;
    else if (key_code === 'q' || key_code === 'Q' || key_code === 'й' || key_code === 'Й')
        isQ_ButtonPushed = true;
    else if (key_code === 'e' || key_code === 'E' || key_code === 'у' || key_code === 'У')
        isE_ButtonPushed = true;
    else if (key_code === 'w' ||  key_code === 'ц')
        isW_ButtonPushed = true;
    else if (key_code === 'W' || key_code === 'Ц'){
        for (sendctr = 0; sendctr < 10; sendctr++) {
            (ws.send(strButtonStatus));
            console.log(ws.send(strButtonStatus));
            isW_ButtonPushed = true;
        }
    }
    else if (key_code === 's' || key_code === 'і' || key_code === 'ы')
        isS_ButtonPushed = true;
    else if (key_code === 'S' || key_code === 'І' || key_code === 'Ы'){
        for (sendctr = 0; sendctr < 10; sendctr++) {
            (ws.send(strButtonStatus));
            console.log(ws.send(strButtonStatus));
            isS_ButtonPushed = true;
        }
    }
    else if (key_code === 'a' || key_code === 'ф')
        isA_ButtonPushed = true;
    else if (key_code === 'A' || key_code === 'Ф'){
        for (sendctr = 0; sendctr < 10; sendctr++) {
            (ws.send(strButtonStatus));
            console.log(ws.send(strButtonStatus));
            isA_ButtonPushed = true;
        }
    }
    else if (key_code === 'd' || key_code === 'в')
        isD_ButtonPushed = true;
    else if (key_code === 'D' || key_code === 'В'){
        for (sendctr = 0; sendctr < 10; sendctr++) {
            (ws.send(strButtonStatus));
            console.log(ws.send(strButtonStatus));
            isD_ButtonPushed = true;
        }
    }
    else if (key_code === '0')
        isZERO_ButtonPushed = true;

    if (isQ_ButtonPushed || isW_ButtonPushed || isE_ButtonPushed
        || isA_ButtonPushed || isS_ButtonPushed || isD_ButtonPushed
        || isUP_ButtonPushed || isDOWN_ButtonPushed || isLEFT_ButtonPushed
        || isRIGHT_ButtonPushed || isZERO_ButtonPushed)
        isANY_ButtonPushed = true;
}

function set_keyup(key_code) {
    if (key_code === 'ArrowUp')
        isUP_ButtonPushed = false;
    else if (key_code === 'ArrowDown')
        isDOWN_ButtonPushed = false;
    else if (key_code === 'ArrowRight')
        isRIGHT_ButtonPushed = false;
    else if (key_code === 'ArrowLeft')
        isLEFT_ButtonPushed = false;
    else if (key_code === 'q' || key_code === 'Q' || key_code === 'й' || key_code === 'Й')
        isQ_ButtonPushed = false;
    else if (key_code === 'e' || key_code === 'E' || key_code === 'у' || key_code === 'У')
        isE_ButtonPushed = false;
    else if (key_code === 'w' || key_code === 'W' || key_code === 'ц' || key_code === 'Ц')
        isW_ButtonPushed = false;
    else if (key_code === 's' || key_code === 'S' || key_code === 'і' || key_code === 'І' || key_code === 'ы' || key_code === 'Ы')
        isS_ButtonPushed = false;
    else if (key_code === 'a' || key_code === 'A' || key_code === 'ф' || key_code === 'Ф')
        isA_ButtonPushed = false;
    else if (key_code === 'd' || key_code === 'D' || key_code === 'в' || key_code === 'В')
        isD_ButtonPushed = false;
    else if (key_code === '0')
        isZERO_ButtonPushed = false;

    if (!(isQ_ButtonPushed || isW_ButtonPushed || isE_ButtonPushed
        || isA_ButtonPushed || isS_ButtonPushed || isD_ButtonPushed
        || isUP_ButtonPushed || isDOWN_ButtonPushed || isLEFT_ButtonPushed
        || isRIGHT_ButtonPushed || isZERO_ButtonPushed))
        isANY_ButtonPushed = false;
}
let tim;
function send_control_message() {
    if (isANY_ButtonPushed) {
        strButtonStatus = "bt:";

        strButtonStatus += isQ_ButtonPushed ? "1" : "0";
        strButtonStatus += isW_ButtonPushed ? "1" : "0";
        strButtonStatus += isE_ButtonPushed ? "1" : "0";
        strButtonStatus += isA_ButtonPushed ? "1" : "0";
        strButtonStatus += isS_ButtonPushed ? "1" : "0";
        strButtonStatus += isD_ButtonPushed ? "1" : "0";
        strButtonStatus += isUP_ButtonPushed ? "1" : "0";
        strButtonStatus += isDOWN_ButtonPushed ? "1" : "0";
        strButtonStatus += isLEFT_ButtonPushed ? "1" : "0";
        strButtonStatus += isRIGHT_ButtonPushed ? "1" : "0";
        strButtonStatus += isZERO_ButtonPushed ? "1" : "0";

        // isFireCorrectionProcessed is in 'coordinates.js'
        if (isFireCorrectionProcessed) {
            console.log("impossible to do stream ZOOMING and ROI CHANGING and CHANGE PURSUIT DISTANCE when fire is processed");
            return;
        }
        ws.send(strButtonStatus);
        if (isUP_ButtonPushed || isDOWN_ButtonPushed) {
            ws.send("{\"comm\":[\"GET_FCI\"]}");
        }
    }
}

//document.addEventListener("keydown", 16)
/*
$(document).keydown(function (e) {
        if (e.which == 16) {
            mouseOnDistInfo();
            console.log("EEEEE")
        }
        return e;
});


    $(document).keyup(function (e) {
        if (e.which == 16) {
            mouseOnDistInfo()
        }
        return e;

});


function upButtonPressed () {
    let isUpShiftButtonNotDown = true;
    $(document).keydown(function (e) {
        if (e.which == 16 && isRButtonNotDown) {
            isUpShiftButtonNotDown = false;
            console.log("upButtonPressed");
        }
        return e;
    });

    $(document).keyup(function (e) {
        if (e.which == 16) {
            isUpShiftButtonNotDown = true;
        }
        return e;
    });
}

 */

function scrollDistDOWN (){
   // document.addEventListener("keydown",function(e){if(e.shiftKey){
        console.log("scrollDistDOWN")
        ws.send('bt:00000010000');
        ws.send("{\"comm\":[\"GET_FCI\"]}");
      //  }});
        //ws.send(strButtonStatus);
        /*
        if (document.event.shiftKey === true)
            {
                console.log("16 is pressed");
                ws.send("{\"comm\":[\"GET_FCI\"]}");
            }
         */

        // if key is presed to do
        //isDOWN_ButtonPushed = false;
        //if (isDOWN_ButtonPushed) {
        //}
}


function scrollDistUP() {
    //document.addEventListener("keydown",function(e){if(e.shiftKey){
        console.log("scrollDistUP")
        ws.send('bt:00000001000');
        ws.send("{\"comm\":[\"GET_FCI\"]}");
        // }});
        //console.log("wheel UP");
        //isUP_ButtonPushed = false;
        //ws.send(strButtonStatus);
}



function mouseOnDistInfo(){
    console.log("Im here")

    $(document).keydown(function (e) {
        if (e.which == 16 ) {
            window.addEventListener('wheel', zoom);
            {
                function zoom(event) {
                    event.deltaY < 0 ? scrollDistDOWN() : scrollDistUP();
                }
            }
            window.onwheel = zoom;
            console.log("Shift is pressed!")
        }
        return e;
    });

    $(document).keyup(function (e) {
        if (e.which == 16) {
            streamZoom();

            console.log("Shift is Un pressed!!")
        }
        return e;
    });
}


$(document).keydown(function (e) {
    if (e.which == 27) {
        console.log("ESC is pressed");

        var element = document.getElementById("leftcol");
        element.style.display = (element.style.display == 'none') ? 'block' : 'none';
    }
    return e;
});

