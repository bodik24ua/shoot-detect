let x0_clickCoord = -1;
let y0_clickCoord = -1;
let x1_clickCoord = -1;
let y1_clickCoord = -1;

let isFireCorrectionProcessed = false;

document.getElementById("stream").onclick = function (event) {
    if (!isFireCorrectionProcessed)
        return;
    event = event || window.Event;

    if (x0_clickCoord === -1) {
        x0_clickCoord = event.offsetX;
        y0_clickCoord = event.offsetY;
        document.getElementById("shootText").innerHTML="Місце влучання";
        document.getElementById("shootText").style.display="inline";
    } else {
        x1_clickCoord = event.offsetX;
        y1_clickCoord = event.offsetY;

        // todo some events
        let WIDTH = document.getElementById("stream").offsetWidth;
        let HEIGHT = document.getElementById("stream").offsetHeight;
        let DX = (x0_clickCoord - x1_clickCoord) / WIDTH;
        let DY = (y0_clickCoord - y1_clickCoord) / HEIGHT;
        let line = "{\"comm\":[\"FIX_FC:DX:" + (Math.round(DX * 10000) / 10000) + ":DY:" + (Math.round(DY * 10000) / 10000) + "\"]}"

        if (DX !== 0 || DY !== 0) {
            ws.send(line);
            // then request table again
            ws.send("{\"comm\":[\"GET_FCA\"]}");

        }

        console.log(line);

        document.getElementById("stream").style.cursor = "default";
        document.getElementById("table_check").checked = false;
        $(".table-content").css('display', 'none');

        isFireCorrectionProcessed = false;
        document.getElementById("changeText").innerHTML="Змінити";
        document.getElementById("shootText").innerHTML="";
        document.getElementById("shootText").style.display="none";
        x0_clickCoord = -1;
    }
};


function onMouseOverButtonTable() {
    if (!isFireCorrectionProcessed) {
        $(".table-content").css('display', 'block');
        $(".distInfo").css('display', 'none');
    }
}

function onMouseLeaveButtonTable() {
    if (!isFireCorrectionProcessed) {
        $(".table-content").css('display', 'none');
        $(".distInfo").css('display', 'block');
    }
}

function RegistrationModeIsOnTextAlarm() {
    let e = document.getElementById('shootText');
    e.innerHTML="Корекція увімкнена, Вимкніть, перед використанням Прицілки";
    e.style.display="inline";
    e.classList.add('shootTextAlarm');
}

function RegistrationModeIsOnTextAlarmClear() {
    let e = document.getElementById('shootText');
    e.innerHTML="";
    e.style.display="none";
    e.classList.remove('shootTextAlarm');
}

function SwappedStreamIsOnTextAlarm() {
    let e = document.getElementById('shootText');
    e.innerHTML="Камеру змінено, Змініть, перед використанням Прицілки";
    e.style.display="inline";
    e.classList.add('shootTextAlarm');
}

function SwappedStreamIsOnTextAlarmClear() {
    let e = document.getElementById('shootText');
    e.innerHTML="";
    e.style.display="none";
    e.classList.remove('shootTextAlarm');
}

function table_check() {
    if (!$("#table_check").prop("checked")) {
        document.getElementById("stream").style.cursor = "default";
        x0_clickCoord = -1;
        isFireCorrectionProcessed = false;
        document.getElementById("changeText").innerHTML = "Змінити";
        document.getElementById("shootText").innerHTML = "";
        document.getElementById("shootText").style.display = "none";
    } else {
        // check is fire correction mode, if enable alert should tell user about it
        if (isRegistrationMode) {
            RegistrationModeIsOnTextAlarm();
            console.log("Корекція увімкнена, Вимкніть, перед використанням Прицілки");
            clearTimeout(this.timeout1);
            clearTimeout(this.timeout2);
            this.timeout1 = setTimeout(RegistrationModeIsOnTextAlarmClear, 3000);
            document.getElementById("table_check").checked = false;
            return;
        }

        // check is swapped streams, if enabled alert should tell user about it
        if (isStreamsSwapped) {
            SwappedStreamIsOnTextAlarm();
            console.log("Камеру змінено, Поверніться до обраного режиму!");
            clearTimeout(this.timeout1);
            clearTimeout(this.timeout2);
            this.timeout2 = setTimeout(SwappedStreamIsOnTextAlarmClear, 3000);
            document.getElementById("table_check").checked = false;
            return;
        }

        // don't allow user to set fire correction mode
        // this done in other function in file 'app.js'

        // don't allow user to swap streams
        // this done in other function in file 'app.js'

        // don't allow user to do zooming
        // this done in other function in the file 'app.js'
        // and this done the other function in the file 'keyboardMouseKeys.js'

        // don't allow user to change pusuiting distance
        // thin done in other function in the file 'app.js'
        // this done in other function in the file 'WSADKeys.js'


        // fix table until done
        $(".table-content").css('display', 'block');

        //  update table and update index
        // this done on the end of double click in the 'onclick' function in the file 'coordinates.js

        document.getElementById("stream").style.cursor = "crosshair";
        isFireCorrectionProcessed = true;
        document.getElementById("shootText").classList.remove('shootTextAlarm');
        clearTimeout(this.timeout1);
        clearTimeout(this.timeout2);
        document.getElementById("changeText").innerHTML = "Корекція";
        document.getElementById("shootText").innerHTML = "Місце прицілювання";
        document.getElementById("shootText").style.display = "inline";
    }
}


//setTimeout(document.getElementById("stream").style.cursor="default", 5000);