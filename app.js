var wsAddress = document.location.host;
wsAddress = wsAddress.substring(0, wsAddress.length - 4);
wsAddress = "ws://" + wsAddress + "6789";
var websocket = new WebSocket(wsAddress);

var count = 0;

let audio = new Audio('https://upload.wikimedia.org/wikipedia/commons/3/36/Air_raid_alarm_in_China.ogg');

websocket.onmessage = function (event) {
    //console.log(count, event.data);
    //count++;
    showDataInJSON(event.data);

};

function myRound(number) {
    return (Math.round(number * 1000) / 1000);
}

function showDataInJSON(msgData) {
    let jsonDataParsed = JSON.parse(msgData);
    let div_phi = '<div class="div_phi">';
    div_phi += 'φ = ' + (Math.round((180 / Math.PI) * jsonDataParsed.phi * 100) / 100);
    div_phi += '</div>';
    document.getElementById('phi').innerHTML = div_phi;

    let div_a = '<div class="div_a">';
    div_a += 'A = ' + jsonDataParsed.A;
    div_a += '</div>';
    document.getElementById('a').innerHTML = div_a;

    let div_tetta = '<div class="div_o">';
    div_tetta += 'θ = ' + (Math.round((180 / Math.PI) * jsonDataParsed.tetta * 100) / 100);
    div_tetta += '</div>';
    document.getElementById('o').innerHTML = div_tetta;

    let div_s0 =  '<div class="gt">';
    div_s0 += 't0: ' + myRound(jsonDataParsed.t0) + '<br>' + 'A0: ' + myRound(jsonDataParsed.A0);
    div_s0 += '</div>';
    document.getElementById("zero").innerHTML = div_s0;

    let div_s1 =  '<div class="gt">';
    div_s1 += 't1: ' + myRound(jsonDataParsed.t1) + '<br>' + 'A1: ' + myRound(jsonDataParsed.A1);
    div_s1 += '</div>';
    document.getElementById("one").innerHTML = div_s1;

    let div_s2 =  '<div class="gt">';
    div_s2 += 't2: ' + myRound(jsonDataParsed.t2) + '<br>' + 'A2: ' + myRound(jsonDataParsed.A2);
    div_s2 += '</div>';
    document.getElementById("two").innerHTML = div_s2;

    let div_s3 =  '<div class="gt">';
    div_s3 += 't3: ' + myRound(jsonDataParsed.t3) + '<br>' + 'A3: ' + myRound(jsonDataParsed.A3);
    div_s3 += '</div>';
    document.getElementById("three").innerHTML = div_s3;

    //

    let kilograms = "rotate(" + (Math.round((180 / Math.PI) * jsonDataParsed.phi * 100) / 100) + "deg)"

    document.getElementById("arrow").style.transform = kilograms;

    function turnAlarm(){
        //set block to work
        console.log("turnAlarm");
        document.getElementById("alarmScr").style.display="block";
        audio.play();
    }

    setTimeout(turnAlarm(), 3000)

    function back(){
        console.log("back");
        document.getElementById("alarmScr").style.display="none";
        audio.stop();
    }

    setTimeout(back, 5000);

}




