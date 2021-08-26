/* Change color for stream */

function streamChangeColor() {
    console.log('changed');
    let ifx = document.getElementById("stream");
    let br = document.getElementById("br");
    let ct = document.getElementById("ct");
    let st = document.getElementById("st");

    /*ifx.style.webkitFilter = "brightness(" + br.value * 10 + "%) contrast(" + ct.value * 10 + "%) saturate(" + st.value * 10 + "%)";
    ifx.style.filter = "brightness(" + br.value * 10 + "%) contrast(" + ct.value * 10 + "%) saturate(" + st.value * 10 + "%)";*/
    /*brightness(" + br.value * 10 + "%) contrast(" + ct.value * 10 + "%)*/
    ifx.style.webkitFilter = "saturate(" + st.value * 10 + "%)";
    ifx.style.filter = " saturate(" + st.value * 10 + "%)";

    /*
    ifx.style.webkitFilter = "brightness(" + br.value * 10 + "%)";
    ifx.style.filter = "brightness(" + br.value * 10 + "%)";
    ifx.style.webkitFilter = "contrast(" + ct.value * 10 + "%)";
    ifx.style.filter = "contrast(" + ct.value * 10 + "%)";
    ifx.style.webkitFilter  = "saturate(" + st.value * 10 + "%)";
    ifx.style.filter = " saturate(" + st.value * 10 + "%)";
    */
}



/* ////////// reg_button_fire */

$(document).keydown(function (e) {
    if (e.which === 17 || e.which === 18) {
        ws.send("{\"comm\":[\"FUSE_R\"]}");
        $('#id_mode_button_fire').css({'background-color': 'rgba(236, 38, 103, 0.5)'});
        setTimeout(function () {
            $('#id_mode_button_fire').css({'background-color': 'rgba(76, 175, 80, 0.5)'});
        }, 1500);


    }
    return e;
});

$(document).keyup(function (e) {
    if (e.which === 17 || e.which === 18) {
        ws.send("{\"comm\":[\"FUSE_I\"]}");
    }
    return e;
})

/* ////////// Button Swap Streams */

let isRButtonNotDown = true;
$(document).keydown(function (e) {
    if (e.which == 82 && isRButtonNotDown) {
        isRButtonNotDown = false;
        onClickButtonSwapStreams();
    }
    return e;
});

$(document).keyup(function (e) {
    if (e.which == 82) {
        isRButtonNotDown = true;
        onClickButtonSwapStreams();
    }
    return e;
});


/*   Mouse Zoom   */
function onDownMouseWheel() {
    ws.send("bt:10000000000");
    //ws.send("{\"comm\":[\"GET_FCI_-1\"]}" );
}

function onUpMouseWheel() {
    ws.send("bt:00100000000");
    //ws.send("{\"comm\":[\"GET_FCI_+1\"]}" );
}


function streamZoom() {
    window.addEventListener('wheel', zoom);
    {
        function zoom(event) {
            // isFireCorrectionProcessed is in 'coordinates.js'
            if (isFireCorrectionProcessed) {
                console.log("impossible to do stream zooming when fire is processed");
                return;
            }
            event.deltaY < 0 ? onUpMouseWheel() : onDownMouseWheel();
        }
    }

    let scale = 1;
    const el = document.querySelector('div');
    window.onwheel = zoom;
}

function streamZoomOut() {
    window.addEventListener('wheel', zoom);
    {
        function zoom(event) {
        }
    }

    let scale = 1;
    const el = document.querySelector('div');
    window.onwheel = zoom;
}


/////// button shift + wheel






// });


//////  РИЧАГ .........
/*
document.addEventListener('DOMContentLoaded', function () {

    let joystick_red = document.getElementById("joystick_red"),
        knob = document.getElementById("knob"),
        target_x = joystick_red.clientWidth / 2 - knob.clientWidth / 2,
        target_y = joystick_red.clientHeight / 2 - knob.clientHeight / 2;

    let panSpan = document.getElementById("panValue"),
        tiltSpan = document.getElementById("tiltValue");

    knob.style.webkitTransform = "translate(" + target_x + "px, " + target_y + "px)";

    // update the position attributes
    let target = document.getElementById("knob");
    updatePositionAttributes(target, target_x, target_y);

    // target elements with the "draggable" class
    interact('.draggable')
        .draggable({
            inertia: false,
            // keep the element within the area of its parent
            restrict: {
                restriction: "parent",
                endOnly: false,
                elementRect: {top: 0, left: 0, bottom: 1, right: 1}
            },
            onmove: dragMoveListener,
            onend: function (event) {
                let target = event.target;
                TweenLite.to(target, 0.2, {
                    ease: Back.easeOut.config(1.7),
                    "webkitTransform": "translate(" + target_x + "px, " + target_y + "px)"
                });
                updatePositionAttributes(target, target_x, target_y);
                //panSpan.innerHTML = 0;
                //tiltSpan.innerHTML = 0;
            }
        });

    function dragMoveListener(event) {
        let target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        updatePositionAttributes(target, x, y);

        // update text display
        //panSpan.innerHTML = (x-button.clientWidth/4);
        //tiltSpan.innerHTML = (y-joystick.clientHeight/4);


        console.log((x <= 150 / 4) + " " + (x >= (150 * 3) / 4));

        isPDotP = (x <= 150 / 4);
        isPDotM = (x >= (150 * 3) / 4);

    }

    function updatePositionAttributes(element, x, y) {
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }

});
*/
