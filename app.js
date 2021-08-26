/*$(document).ready(function () {
    function reorient(e) {
        var portrait = (window.orientation % 180 == 0);
        $("body > div").css("-webkit-transform", portrait ? "rotate(90deg)" : "");
    }
    window["onorientationchange"] = reorient;
    window.setTimeout(reorient, 0);
});*/

/*
$(document).keydown(function(e){
    if(e.which === 17 || e.which === 18){
        $('.id_mode_button_fire').show();
        setTimeout(function() {
            $('.id_mode_button_fire').hide();
        }, 3000);
    }
    return e;
});
*/


/*Change color button fire*/

$('input[type=checkbox]').each(function()
{
    this.checked = false;
});

function fire() {
    $('#id_mode_button_fire').css({'background-color': 'rgba(236, 38, 103, 0.5)'}, ws.send("{\"comm\":[\"FUSE_R\"]}"));
    setTimeout(function () {
        $('#id_mode_button_fire').css({'background-color': 'rgba(76, 175, 80, 0.5)'}, ws.send("{\"comm\":[\"FUSE_I\"]}"));
    }, 2000);
}

/*
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $('link[rel="stylesheet"]').attr('href','mob_app_view.css');
} else {
    $('link[rel="stylesheet"]').attr('href','app_view.css');
}
*/

var ColorDefault = "background-color': 'rgba(76, 175, 80, 0.5)";

let ws;
let html5VideoElement;
let webrtcPeerConnection;
let webrtcConfiguration;
let reportError;
let joyCtrlCamera;

let isPDotP = false;
let isPDotM = false;

let arr = [
    '{"type":"ice","data":{"candidate":"candidate:0 1 UDP 2122252543 f1e2609b-79e0-492c-a168-caf9974cfa79.local 54334 typ host","sdpMid":"video0","sdpMLineIndex":0,"usernameFragment":"c19644b3"}}',
    '{"type":"ice","data":{"candidate":"candidate:2 1 TCP 2105524479 f1e2609b-79e0-492c-a168-caf9974cfa79.local 9 typ host tcptype active","sdpMid":"video0","sdpMLineIndex":0,"usernameFragment":"c19644b3"}}',
    '{"type":"ice","data":{"candidate":"candidate:1 1 UDP 1686052863 192.168.1.111 54334 typ srflx raddr 0.0.0.0 rport 0","sdpMid":"video0","sdpMLineIndex":0,"usernameFragment":"c19644b3"}}',
    '{"type":"ice","data":{"candidate":"","sdpMid":"video0","sdpMLineIndex":0,"usernameFragment":"c19644b3"}}'
];

var showDist

var table = '';
var selectedTableRowIndex = -1;
var requestedTableRowIndex = -1;

let arrInx = 0;
let isRegistrationMode = false;
let isStreamsSwapped = false;

function onClickButtonRegFire() {
    // isFireCorrectionProcessed is in 'coordinates.js'
    if (isFireCorrectionProcessed) {
        console.log("impossible to change reg fire mode when fire is processed");
        return;
    }
    if (isRegistrationMode) {
        isRegistrationMode = false;
        document.getElementById("id_mode_button_reg_fire").style.background = "rgba(76, 175, 80, 0.5)";
        ws.send("{\"comm\":[\"N_REG_FIRE\"]}");
    } else {
        isRegistrationMode = true;
        document.getElementById("id_mode_button_reg_fire").style.background = "rgba(236, 38, 103, 0.5)";
        ws.send("{\"comm\":[\"REG_FIRE\"]}");
    }
}

function onClickButtonZoomPlus() {
    ws.send("bt:00100000000");
}

function onClickButtonZoomMinus() {
    ws.send("bt:10000000000");
}

function onClickButtonSwapStreams() {
    // isFireCorrectionProcessed is in 'coordinates.js'
    if (isFireCorrectionProcessed) {
        console.log("impossible to swap streams when fire is processed");
        return;
    }
    if (isStreamsSwapped) {
        isStreamsSwapped = false;
        document.getElementById("id_mode_button_swap_streams").style.background = "rgba(76, 175, 80, 0.5)";
        ws.send("{\"comm\":[\"SWP_STRM\"]}");
    } else {
        isStreamsSwapped = true;
        document.getElementById("id_mode_button_swap_streams").style.background = "rgba(236, 38, 103, 0.5)";
        ws.send("{\"comm\":[\"SWP_STRM\"]}");
    }
}

// const cheat_str = 'WMS *\r\nm=video 9 UDP/TLS/RTP/SAVPF 96\r\nc=IN IP4 0.0.0.0\r\na=recvonly\r\na=fmtp:96 profile-level-id=42e01f;level-asymmetry-allowed=1;packetization-mode=1\r\na=ice-pwd:79a44e7c9d548a4ef5470eb7ab8709d0\r\na=ice-ufrag:49401ce7\r\na=mid:video0\r\na=rtcp-fb:96 nack pli\r\na=rtcp-mux\r\na=rtcp-rsize\r\na=rtpmap:96 VP8/90000\r\na=setup:active\r\na=ssrc:2189315312 cname:{1ffb8d7e-786b-4e69-89ed-55563307c36d}\r\n"}'
// const cheat_str = 'WMS *\\r\\nm=video 9 UDP/TLS/RTP/SAVPF 96\\r\\nc=IN IP4 0.0.0.0\\r\\na=recvonly\\r\\na=fmtp:96 profile-level-id=42e01f;level-asymmetry-allowed=1;packetization-mode=1\\r\\na=ice-pwd:79a44e7c9d548a4ef5470eb7ab8709d0\\r\\na=ice-ufrag:49401ce7\\r\\na=mid:video0\\r\\na=rtcp-fb:96 nack pli\\r\\na=rtcp-mux\\r\\na=rtcp-rsize\\r\\na=rtpmap:96 VP8/90000\\r\\na=setup:active\\r\\na=ssrc:2189315312 cname:{1ffb8d7e-786b-4e69-89ed-55563307c36d}\\r\\n"}'

//
// function onLocalDescription(desc) {
//     console.info("Local description: " + JSON.stringify(desc));
//     if (JSON.stringify(desc).includes("VP8")) {
//         let descStrOk = JSON.stringify(desc);
//         const descStrArr = descStrOk.split("WMS");
//         const descStrNew = descStrArr[0] + cheat_str;
//         desc = JSON.parse(descStrNew);
//     }
//     // let isNotRunned = true;
//     webrtcPeerConnection.setLocalDescription(desc).then(function () {
//         console.info(JSON.stringify({type: "sdp", "data": webrtcPeerConnection.localDescription}));
//         // if (JSON.stringify(webrtcPeerConnection.localDescription).includes("VP8")) {
//         //     ws.send(cheat_str);
//         // } else {
//         ws.send(JSON.stringify({type: "sdp", "data": webrtcPeerConnection.localDescription}));
//         isNotRunned = false;
//         // }
//     }).catch(reportError);
//     // if (isNotRunned) {
//     //     ws.send("aaaaaaaaa: KKK?????????WTF????");
//     //     ws.send(JSON.stringify({type: "sdp", "data": desc}));
//     // }
// }

function onLocalDescription(desc) {
    console.log("Local description: " + JSON.stringify(desc));
    webrtcPeerConnection.setLocalDescription(desc).then(function () {
        ws.send(JSON.stringify({type: "sdp", "data": webrtcPeerConnection.localDescription}));
    }).catch(reportError);
}

function onIncomingSDP(sdp) {
    console.log("Incoming SDP: " + JSON.stringify(sdp));
    webrtcPeerConnection.setRemoteDescription(sdp).catch(reportError);
    webrtcPeerConnection.createAnswer().then(onLocalDescription).catch(reportError);
}

function onIncomingICE(ice) {
    let candidate = new RTCIceCandidate(ice);
    console.log("Incoming ICE: " + JSON.stringify(ice));
    webrtcPeerConnection.addIceCandidate(candidate).catch(reportError);
}

function onAddRemoteStream(event) {
    html5VideoElement.srcObject = event.streams[0];
    html5VideoElement.autoplay = true;
}

function onIceCandidate(event) {
    if (event.candidate == null)
        return;

    console.info("Sending ICE candidate out: " + JSON.stringify(event.candidate));
    //ws.send(JSON.stringify({"type": "ice", "data": event.candidate}));
    ws.send(arr[arrInx]);
    arrInx++;
}

function myRound(number) {
    return (Math.round(number * 10) / 10);
}

function onServerMessage(event) {
    console.log(event.data);
    if (event.data === "YOU_ARE_EXCESS")
        alert("You canNOT connect to the server, you are an excess client.\nPlease wait till you be able to connect!");

    if (event.data.includes("N_REG_FIRE")) {
        isRegistrationMode = false;
        document.getElementById("id_mode_button_reg_fire").style.background = "rgba(76, 175, 80, 0.5)";
    } else if (event.data.includes("REG_FIRE")) {
        isRegistrationMode = true;
        document.getElementById("id_mode_button_reg_fire").style.background = "rgba(236, 38, 103, 0.5)";
    }
    if (event.data.includes("N_SWP_STRM")) {
        isStreamsSwapped = false;
        document.getElementById("id_mode_button_swap_streams").style.background = "rgba(76, 175, 80, 0.5)";
    } else if (event.data.includes("SWP_STRM")) {
        isStreamsSwapped = true;
        document.getElementById("id_mode_button_swap_streams").style.background = "rgba(236, 38, 103, 0.5)";
    }

    if (event.data.includes("FCA")) {
        if (event.data.includes("NO")) {
            // request Fire Corrections Array again
            ws.send("{\"comm\":[\"GET_FCA\"]}");
        } else {
            $(document).ready(function() {
                var myJsonData = (event.data);

                var obj = $.parseJSON(myJsonData);
                var tblInx = 0
                table = '<table><thead><th class="gt">Дистанція</th><th class="gt">V</th><th class="gt">H</th></thead><tbody>';
                $.each(obj.FCA, function() {

                    table += '<tr class="row_' + tblInx +'"><td>' + this['d'] + '</td><td>' + myRound(this['v']) + '</td><td>' + myRound(this['h']) + '</td></tr>';
                    tblInx++;
                });
                table += '</tbody></table>';
                document.getElementById("datalist").innerHTML = table;
            });

            // timeout for get table data which will be selected field in table
            setTimeout(
                function () {
                    $("#datalist tr").click(function () {
                        // isFireCorrectionProcessed is in 'coordinates.js'
                        if (isFireCorrectionProcessed) {
                            console.log("impossible to change PURSUIT DISTANCE when fire is processed");
                            return;
                        }
                        let inx = this.className;
                        inx = inx.replace("row_", "");
                        inx = inx.replace(" selected", "");
                        if (requestedTableRowIndex !== inx) {
                            ws.send("{\"comm\":[\"SET_FCI:" + inx + "\"]}");
                            ws.send("{\"comm\":[\"GET_FCI\"]}");
                            requestedTableRowIndex = inx;
                            console.log("req inx " + requestedTableRowIndex);
                            console.log("inx" + inx);
                        }
                        // $(this).addClass('selected'); ws.send(jsonData.FCI);
                        // $(this).siblings().removeClass('selected');
                        // var value = $(this).find('tr:first').html();
                    })
                }, 500 );

            // request Fire Correction Index
            ws.send("{\"comm\":[\"GET_FCI\"]}");
        }
        return;
    }


    if (event.data.includes("FCI")) {
        let jsonData = JSON.parse(event.data);
        let index = jsonData.FCI;

        console.log('\n'+'\n'+'\n'+'\n'+'\n'+'\n'+'\n'+'\n' + "index: " + index + '\n'+'\n'+'\n'+'\n' +'\n'+'\n'+'\n'+'\n');
       // var tblRow = document.querySelector(".row_" + index);
       // tblRow.className = "row_" + index + " selected";

        // Write distance under buttons

        /*
        $(function() {
            $("#range").slider({
                orientation: "vertical",
                min: 0,
                max: 19,
                slide: function(event,range){
                    //document.getElementById('distanceWriteInfo').innerHTML=range.value;
                    $("#distanceWriteInfo").html(range.value+"00");
                    $("#distanceWritePrevInfo").html(range.value-1);
                    $("#distanceWriteNextInfo").html(range.value+1);
                    console.log(range.value);
                }});
            //$("#distanceWriteInfo").val($("#range").slider("value"));
        });
        */

        let obj = JSON.parse(event.data);
        document.getElementById('distanceWriteInfo').innerHTML=obj.FCI;
        document.getElementById('distanceWritePrevInfo').innerHTML=obj.FCI;
        document.getElementById('distanceWritePrev2Info').innerHTML=obj.FCI;
        document.getElementById('distanceWritePrev3Info').innerHTML=obj.FCI;
        //document.getElementById('distanceWritePrev3Info').innerHTML=obj.FCI;
        document.getElementById('distanceWriteNextInfo').innerHTML=obj.FCI;
        document.getElementById('distanceWriteNext2Info').innerHTML=obj.FCI;
        document.getElementById('distanceWriteNext3Info').innerHTML=obj.FCI;


        //  &nbsp;

        let _100 = 100;
        let _200 = 200;
        let _300 = 300;



        function WriteDistance() {
            let distanceWriteInfo = document.getElementById('distanceWriteInfo');
            let t = distanceWriteInfo.textContent
            if (t === '0') {
                distanceWriteInfo.innerHTML="100";
            }
            if (t === '1') {
                distanceWriteInfo.innerHTML="200";
            }
            if (t === '2') {
                distanceWriteInfo.innerHTML="300";
            }
            if (t === '3') {
                distanceWriteInfo.innerHTML="400";
            }
            if (t === '4') {
                distanceWriteInfo.innerHTML="500";
            }
            if (t === '5') {
                distanceWriteInfo.innerHTML="600";
            }
            if (t === '6') {
                distanceWriteInfo.innerHTML="700";
            }
            if (t === '7') {
                distanceWriteInfo.innerHTML="800";
            }
            if (t === '8') {
                distanceWriteInfo.innerHTML="900";
            }
            if (t === '9') {
                distanceWriteInfo.innerHTML="1000";
            }
            if (t === '10') {
                distanceWriteInfo.innerHTML="1100";
            }
            if (t === '11') {
                distanceWriteInfo.innerHTML="1200";
            }
            if (t === '12') {
                distanceWriteInfo.innerHTML="1300";
            }
            if (t === '13') {
                distanceWriteInfo.innerHTML="1400";
            }
            if (t === '14') {
                distanceWriteInfo.innerHTML="1500";
            }
            if (t === '15') {
                distanceWriteInfo.innerHTML="1600";
            }
            if (t === '16') {
                distanceWriteInfo.innerHTML="1700";
            }
            if (t === '17') {
                distanceWriteInfo.innerHTML="1800";
            }
            if (t === '18') {
                distanceWriteInfo.innerHTML="1900";
            }
            if (t === '19') {
                distanceWriteInfo.innerHTML="2000";
            }
        }
        WriteDistance();

        function WritePrevDist() {
            let distanceWritePrevInfo = document.getElementById('distanceWritePrevInfo');
            let t = distanceWritePrevInfo.textContent;

            if (t === '0') {
                distanceWritePrevInfo.innerHTML="100" - _100;
            }
            if (t === '1') {
                distanceWritePrevInfo.innerHTML="200" - _100;
            }
            if (t === '2') {
                distanceWritePrevInfo.innerHTML="300" - _100;
            }
            if (t === '3') {
                distanceWritePrevInfo.innerHTML="400" - _100;
            }
            if (t === '4') {
                distanceWritePrevInfo.innerHTML="500" - _100;
            }
            if (t === '5') {
                distanceWritePrevInfo.innerHTML="600" - _100;
            }
            if (t === '6') {
                distanceWritePrevInfo.innerHTML="700" - _100;
            }
            if (t === '7') {
               distanceWritePrevInfo.innerHTML="800" - _100;
            }
            if (t === '8') {
                distanceWritePrevInfo.innerHTML="900" - _100;
            }
            if (t === '9') {
                distanceWritePrevInfo.innerHTML="1000" - _100;
            }
            if (t === '10') {
                distanceWritePrevInfo.innerHTML="1100" - _100;
            }
            if (t === '11') {
                distanceWritePrevInfo.innerHTML="1200" - _100;
            }
            if (t === '12') {
                distanceWritePrevInfo.innerHTML="1300" - _100;
            }
            if (t === '13') {
                distanceWritePrevInfo.innerHTML="1400" - _100;
            }
            if (t === '14') {
                distanceWritePrevInfo.innerHTML="1500" - _100;
            }
            if (t === '15') {
                distanceWritePrevInfo.innerHTML="1600" - _100;
            }
            if (t === '16') {
                distanceWritePrevInfo.innerHTML="1700" - _100;
            }
            if (t === '17') {
                distanceWritePrevInfo.innerHTML="1800" - _100;
            }
            if (t === '18') {
                distanceWritePrevInfo.innerHTML="1900" - _100;
            }
            if (t === '19') {
                distanceWritePrevInfo.innerHTML="2000" - _100;
            }
        }
        WritePrevDist();

        function WritePrev2Dist() {
            let distanceWritePrev2Info = document.getElementById('distanceWritePrev2Info');
            let t = distanceWritePrev2Info.textContent;

            if (t === '0') {
                distanceWritePrev2Info.innerHTML="100" - _200;
            }
            if (t === '1') {
                distanceWritePrev2Info.innerHTML="200" - _200;
            }
            if (t === '2') {
                distanceWritePrev2Info.innerHTML="300" - _200;
            }
            if (t === '3') {
                distanceWritePrev2Info.innerHTML="400" - _200;
            }
            if (t === '4') {
                distanceWritePrev2Info.innerHTML="500" - _200;
            }
            if (t === '5') {
                distanceWritePrev2Info.innerHTML="600" - _200;
            }
            if (t === '6') {
                distanceWritePrev2Info.innerHTML="700" - _200;
            }
            if (t === '7') {
                distanceWritePrev2Info.innerHTML="800" - _200;
            }
            if (t === '8') {
                distanceWritePrev2Info.innerHTML="900" - _200;
            }
            if (t === '9') {
                distanceWritePrev2Info.innerHTML="1000" - _200;
            }
            if (t === '10') {
                distanceWritePrev2Info.innerHTML="1100" - _200;
            }
            if (t === '11') {
                distanceWritePrev2Info.innerHTML="1200" - _200;
            }
            if (t === '12') {
                distanceWritePrev2Info.innerHTML="1300" - _200;
            }
            if (t === '13') {
                distanceWritePrev2Info.innerHTML="1400" - _200;
            }
            if (t === '14') {
                distanceWritePrev2Info.innerHTML="1500" - _200;
            }
            if (t === '15') {
                distanceWritePrev2Info.innerHTML="1600" - _200;
            }
            if (t === '16') {
                distanceWritePrev2Info.innerHTML="1700" - _200;
            }
            if (t === '17') {
                distanceWritePrev2Info.innerHTML="1800" - _200;
            }
            if (t === '18') {
                distanceWritePrev2Info.innerHTML="1900" - _200;
            }
            if (t === '19') {
                distanceWritePrev2Info.innerHTML="2000" - _200;
            }
        }
        WritePrev2Dist();

        function WritePrev3Dist() {
            let distanceWritePrev3Info = document.getElementById('distanceWritePrev3Info');
            let t = distanceWritePrev3Info.textContent;

            if (t === '0') {
                distanceWritePrev3Info.innerHTML="100" - _300;
            }
            if (t === '1') {
                distanceWritePrev3Info.innerHTML="200" - _300;
            }
            if (t === '2') {
                distanceWritePrev3Info.innerHTML="300" - _300;
            }
            if (t === '3') {
                distanceWritePrev3Info.innerHTML="400" - _300;
            }
            if (t === '4') {
                distanceWritePrev3Info.innerHTML="500" - _300;
            }
            if (t === '5') {
                distanceWritePrev3Info.innerHTML="600" - _300;
            }
            if (t === '6') {
                distanceWritePrev3Info.innerHTML="700" - _300;
            }
            if (t === '7') {
                distanceWritePrev3Info.innerHTML="800" - _200;
            }
            if (t === '8') {
                distanceWritePrev3Info.innerHTML="900" - _300;
            }
            if (t === '9') {
                distanceWritePrev3Info.innerHTML="1000" - _300;
            }
            if (t === '10') {
                distanceWritePrev3Info.innerHTML="1100" - _300;
            }
            if (t === '11') {
                distanceWritePrev3Info.innerHTML="1200" - _300;
            }
            if (t === '12') {
                distanceWritePrev3Info.innerHTML="1300" - _300;
            }
            if (t === '13') {
                distanceWritePrev3Info.innerHTML="1400" - _300;
            }
            if (t === '14') {
                distanceWritePrev3Info.innerHTML="1500" - _300;
            }
            if (t === '15') {
                distanceWritePrev3Info.innerHTML="1600" - _300;
            }
            if (t === '16') {
                distanceWritePrev3Info.innerHTML="1700" - _300;
            }
            if (t === '17') {
                distanceWritePrev3Info.innerHTML="1800" - _300;
            }
            if (t === '18') {
                distanceWritePrev3Info.innerHTML="1900" - _300;
            }
            if (t === '19') {
                distanceWritePrev3Info.innerHTML="2000" - _300;
            }
        }
        WritePrev3Dist();

        function WriteNextDistance() {
            let distanceWriteNextInfo = document.getElementById('distanceWriteNextInfo');
            let t = distanceWriteNextInfo.textContent;

            if (t === '0') {
                distanceWriteNextInfo.innerHTML="100" - - _100;
            }
            if (t === '1') {
                distanceWriteNextInfo.innerHTML="200" - - _100;
            }
            if (t === '2') {
                distanceWriteNextInfo.innerHTML="300" - - _100;
            }
            if (t === '3') {
                distanceWriteNextInfo.innerHTML="400" - - _100;
            }
            if (t === '4') {
                distanceWriteNextInfo.innerHTML="500" - - _100;
            }
            if (t === '5') {
                distanceWriteNextInfo.innerHTML="600" - - _100;
            }
            if (t === '6') {
                distanceWriteNextInfo.innerHTML="700" - - _100;
            }
            if (t === '7') {
                distanceWriteNextInfo.innerHTML="800" - - _100;
            }
            if (t === '8') {
                distanceWriteNextInfo.innerHTML="900" - - _100;
            }
            if (t === '9') {
                distanceWriteNextInfo.innerHTML="1000" - - _100;
            }
            if (t === '10') {
                distanceWriteNextInfo.innerHTML="1100" - - _100;
            }
            if (t === '11') {
                distanceWriteNextInfo.innerHTML="1200" - - _100;
            }
            if (t === '12') {
                distanceWriteNextInfo.innerHTML="1300" - - _100;
            }
            if (t === '13') {
                distanceWriteNextInfo.innerHTML="1400" - - _100;
            }
            if (t === '14') {
                distanceWriteNextInfo.innerHTML="1500" - - _100;
            }
            if (t === '15') {
                distanceWriteNextInfo.innerHTML="1600" - - _100;
            }
            if (t === '16') {
                distanceWriteNextInfo.innerHTML="1700" - - _100;
            }
            if (t === '17') {
                distanceWriteNextInfo.innerHTML="1800" - -  _100;
            }
            if (t === '18') {
                distanceWriteNextInfo.innerHTML="1900" - - _100;
            }
            if (t === '19') {
                distanceWriteNextInfo.innerHTML="2000" - - _100;
            }
        }
        WriteNextDistance();


        //
        function WriteNext2Distance() {
            let distanceWriteNext2Info = document.getElementById('distanceWriteNext2Info');
            let t = distanceWriteNext2Info.textContent;

            if (t === '0') {
                distanceWriteNext2Info.innerHTML="100" - - _200;
            }
            if (t === '1') {
                distanceWriteNext2Info.innerHTML="200" - - _200;
            }
            if (t === '2') {
                distanceWriteNext2Info.innerHTML="300" - - _200;
            }
            if (t === '3') {
                distanceWriteNext2Info.innerHTML="400" - - _200;
            }
            if (t === '4') {
                distanceWriteNext2Info.innerHTML="500" - - _200;
            }
            if (t === '5') {
                distanceWriteNext2Info.innerHTML="600" - - _200;
            }
            if (t === '6') {
                distanceWriteNext2Info.innerHTML="700" - - _200;
            }
            if (t === '7') {
                distanceWriteNext2Info.innerHTML="800" - - _200;
            }
            if (t === '8') {
                distanceWriteNext2Info.innerHTML="900" - - _200;
            }
            if (t === '9') {
                distanceWriteNext2Info.innerHTML="1000" - - _200;
            }
            if (t === '10') {
                distanceWriteNext2Info.innerHTML="1100" - - _200;
            }
            if (t === '11') {
                distanceWriteNext2Info.innerHTML="1200" - - _200;
            }
            if (t === '12') {
                distanceWriteNext2Info.innerHTML="1300" - - _200;
            }
            if (t === '13') {
                distanceWriteNext2Info.innerHTML="1400" - - _200;
            }
            if (t === '14') {
                distanceWriteNext2Info.innerHTML="1500" - - _200;
            }
            if (t === '15') {
                distanceWriteNext2Info.innerHTML="1600" - - _200;
            }
            if (t === '16') {
                distanceWriteNext2Info.innerHTML="1700" - - _200;
            }
            if (t === '17') {
                distanceWriteNext2Info.innerHTML="1800" - - _200;
            }
            if (t === '18') {
                distanceWriteNext2Info.innerHTML="1900" - - _200;
            }
            if (t === '19') {
                distanceWriteNext2Info.innerHTML="2000" - - _200;
            }
        }
        WriteNext2Distance();

        function WriteNext3Distance() {
            let distanceWriteNext3Info = document.getElementById('distanceWriteNext3Info');
            let t = distanceWriteNext3Info.textContent;

            if (t === '0') {
                distanceWriteNext3Info.innerHTML="100" - - _300;
            }
            if (t === '1') {
                distanceWriteNext3Info.innerHTML="200" - - _300;
            }
            if (t === '2') {
                distanceWriteNext3Info.innerHTML="300" - - _300;
            }
            if (t === '3') {
                distanceWriteNext3Info.innerHTML="400" - - _300;
            }
            if (t === '4') {
                distanceWriteNext3Info.innerHTML="500" - - _300;
            }
            if (t === '5') {
                distanceWriteNext3Info.innerHTML="600" - - _300;
            }
            if (t === '6') {
                distanceWriteNext3Info.innerHTML="700" - - _300;
            }
            if (t === '7') {
                distanceWriteNext3Info.innerHTML="800" - - _300;
            }
            if (t === '8') {
                distanceWriteNext3Info.innerHTML="900" - - _300;
            }
            if (t === '9') {
                distanceWriteNext3Info.innerHTML="1000" - - _300;
            }
            if (t === '10') {
                distanceWriteNext3Info.innerHTML="1100" - - _300;
            }
            if (t === '11') {
                distanceWriteNext3Info.innerHTML="1200" - - _300;
            }
            if (t === '12') {
                distanceWriteNext3Info.innerHTML="1300" - - _300;
            }
            if (t === '13') {
                distanceWriteNext3Info.innerHTML="1400" - - _300;
            }
            if (t === '14') {
                distanceWriteNext3Info.innerHTML="1500" - - _300;
            }
            if (t === '15') {
                distanceWriteNext3Info.innerHTML="1600" - - _300;
            }
            if (t === '16') {
                distanceWriteNext3Info.innerHTML="1700" - - _300;
            }
            if (t === '17') {
                distanceWriteNext3Info.innerHTML="1800" - - _300;
            }
            if (t === '18') {
                distanceWriteNext3Info.innerHTML="1900" - - _300;
            }
            if (t === '19') {
                distanceWriteNext3Info.innerHTML="2000" - - _300;
            }
        }
        WriteNext3Distance();


        //remove not needed distance text

        function removePrevInfo () {
            let d = document.getElementById('distanceWritePrevInfo').textContent;
            if (d === '-200' || d === '-100' || d === '0'){
                document.getElementById('distanceWritePrevInfo').innerHTML='&nbsp;'
            }
        }
        removePrevInfo()

        function removePrev2Info () {
            let d = document.getElementById('distanceWritePrev2Info').textContent;
            if (d === '-200' || d === '-100' || d === '0'){
                document.getElementById('distanceWritePrev2Info').innerHTML='&nbsp;'
            }
        }
        removePrev2Info()

        function removePrev3Info () {
            let d = document.getElementById('distanceWritePrev3Info').textContent;
            if (d === '-200' || d === '-100' || d === '0'){
                document.getElementById('distanceWritePrev3Info').innerHTML='&nbsp;'
            }
        }
        removePrev3Info()

        function removeNextInfo () {
            let d = document.getElementById('distanceWriteNextInfo').textContent;
            if (d === '2100' || d === '2200' || d === '2300'){
                document.getElementById('distanceWriteNextInfo').innerHTML='&nbsp;'
            }
        }
        removeNextInfo()

        function removeNext2Info () {
            let d = document.getElementById('distanceWriteNext2Info').textContent;
            if (d === '2100' || d === '2200' || d === '2300'){
                document.getElementById('distanceWriteNext2Info').innerHTML='&nbsp;'
            }
        }
        removeNext2Info()


        function removeNext3Info () {
            let d = document.getElementById('distanceWriteNext3Info').textContent;
            if (d === '2100' || d === '2200' || d === '2300'){
                document.getElementById('distanceWriteNext3Info').innerHTML='&nbsp;'
            }
        }
        removeNext3Info()


        if (selectedTableRowIndex !== -1) {
            $(".row_" + selectedTableRowIndex).removeClass('selected');
        }
        selectedTableRowIndex = index;
        $(".row_" + index).addClass('selected');
        return;
    }

    let msg;

    try {
        msg = JSON.parse(event.data);
    } catch (e) {
        return;
    }

    if (!webrtcPeerConnection) {
        webrtcPeerConnection = new RTCPeerConnection(webrtcConfiguration);
        webrtcPeerConnection.ontrack = onAddRemoteStream;
        //webrtcPeerConnection.onicecandidate = onIceCandidate;
    }

    switch (msg.type) {
        case "sdp":
            onIncomingSDP(msg.data);
            break;
        case "ice":
            onIncomingICE(msg.data);
            break;
        default:
            break;
    }
}

function playStream(videoElement, configuration, reportErrorCB) {
    html5VideoElement = videoElement;
    webrtcConfiguration = configuration;
    reportError = (reportErrorCB != undefined) ? reportErrorCB : function (text) {
    };

    ws.addEventListener("message", onServerMessage);
}


function scheduled_sender() {
    ws.send("{\"comm\":[\"OK\"]}");
}

let isRunned = true;

function run_once() {
    if (isRunned) {
        ws.send(arr[0]);
        ws.send(arr[1]);
        ws.send(arr[2]);
        ws.send(arr[3]);
        isRunned = false;
    }
}

function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

let camCommCounter = 0;

function pDotJoystickScheduleSender() {
    if (isPDotP) {
        ws.send("{\"comm\":[\"PDOT_P\"]}");
    }
    if (isPDotM) {
        ws.send("{\"comm\":[\"PDOT_M\"]}");
    }
}

function joystickScheduleSender() {
    let movStr = "bt:";

    switch (joyCtrlCamera.GetDir()) {
        case "C":
            return;
        case "N":
            movStr += "01000000000";
            break;
        case "NE":
            movStr += "01000100000";
            break;
        case "E":
            movStr += "00000100000";
            break;
        case "SE":
            movStr += "00001100000";
            break;
        case "S":
            movStr += "00001000000";
            break;
        case "SW":
            movStr += "00011000000";
            break;
        case "W":
            movStr += "00010000000";
            break;
        case "NW":
            movStr += "01010000000";
            break;
    }
    camCommCounter++;
    if (camCommCounter == 1) {
        ws.send(movStr);
        camCommCounter = 0;
    }
}


$(function begin() {
    document.addEventListener('keydown', (e) => {
        if (!e.repeat) {
            set_keydown(e.key);
            send_control_message();
        } else {
            send_control_message();
        }
    });

    document.addEventListener('keyup', (e) => {
        set_keyup(e.key);
    });


    ws = new WebSocket('ws://' + document.location.host + '/chart', ['string', 'foo']);
    let vidstream = document.getElementById("stream");
    // let config = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};
    // let config = {'iceServers': [{'urls': 'stun:192.168.1.131:3478'}]};
    let config = {'iceServers': []};

    ws.onopen = function () {
        setTimeout(run_once, 2000);

        console.log('onopen');
    };

    ws.onclose = function () {
        console.log('onclose');
    };

    ws.onerror = function (error) {
    };

    playStream(vidstream, config, function (errmsg) {
        console.error(errmsg);
    });

    setInterval(pDotJoystickScheduleSender, 30);


});

/*
let isMob = !detectMob();
console.info("isMob: " + isMob);

if (!isMob) {
    joyCtrlCamera = new JoyStick('joyCtrlCamera');

    setInterval(joystickScheduleSender, 30);

} else {
    document.getElementById("idButtonZoomMinus").style.visibility = "hidden";
    document.getElementById("idButtonZoomPlus").style.visibility = "hidden";
}
//let messageSender = setInterval(scheduled_sender, 100);
*/




//joyRCamera = new JoyStick('joyRCamera');

//setInterval(joystickScheduleSender, 30);
/*
$('#zoomslider').slider({
    slide: function(event,ui){
        setzoomspeed(ui.value)
    },

    stop: function(event,ui) {
        $('#zoomslider').slider("value",0);
        setzoomspeed(0);
    },
    min:-20,
    max:20,
    value:0
});

 */



'use strict';

(function() {
    var body = document.body;
    var burgerMenu = document.getElementsByClassName('b-menu')[0];
    var burgerContain = document.getElementsByClassName('b-container')[0];
    var burgerNav = document.getElementsByClassName('b-nav')[0];

    burgerMenu.addEventListener('click', function toggleClasses() {
        [body, burgerContain, burgerNav].forEach(function (el) {
            el.classList.toggle('open');
        });
    }, false);
})();