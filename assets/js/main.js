let le = ['/le/000', '/le/001', '/le/002', '/le/003', '/le/004'];
let box_width = 80;
let box_height = 35;
let SENDING_TIME = 2500;
let WAITING_TIME = 500;
let leader = -1;
let id = 1;

let l_le = [];
let client_connections = {
    1: -1,
    2: -1,
    3: -1,
};
let server_connections = {
    1: -1,
    2: -1,
    3: -1,
    4: -1,
    5: -1,
};
$('.cnn, .scnn, .num-box').hide();
$('.d1, .d2, .d3, .d4, .d5').show();

let svg = document.getElementsByTagName('svg')[6];


$(document).ready(function () {
    //  When user clicks on tab, this code will be executed
    // let speed = $('#ex21').data('slider').options.value;

    $("#btn-reset").click(function () {
        $('.cnn, .scnn, .num-box').hide();
        $('.d1, .d2, .d3, .d4, .d5').show();
        le = ['/le/000', '/le/001', '/le/002', '/le/003', '/le/004'];
        $('.scnn').css('stroke', 'grey');
    });

    $("#btn-init").click(function () {
        shuffle(le);
        for (let i = 0; i < 5; i++) {
            $('#ns' + (i + 1)).text(le[i]);
        }
        l_le = analyse_label();
        leader = l_le[0];
        $('.scnn.s' + l_le[0]).fadeIn(2000);
        $('.num-box').fadeIn(2000);

    });

    $("#b1r").click(function () {
        let flag = 0
        if (client_connections[1] != -1) {
            console.log('Find connection');
            // Send read request to c1c

        } else {
            //Client is free
            let list_server = [1, 2, 3, 4, 5];
            shuffle(list_server);


            for (let i = 0; i < list_server.length; i++) {
                $('.cnn.c1.s' + list_server[i]).show();
                client_connections[1] = list_server[i];

                // (function () {
                // reqs_msg('c1', 's1', 'Alive');
                // myVar = setTimeout(arguments.callee, 5500);
                // setTimeout(function () {
                //     reqs_msg('c1', 's1', 'Alive');
                // }, 3500);
                // setInterval(function, 60000);
                // })();

                let running_time = connect_reqs('c1', 's' + list_server[i]);
                setTimeout(function () {
                    read_reqs('c1', 's' + list_server[i]);
                }, running_time);

                break;

                // setTimeout(function () {
                //     reqs_msg('c1', 's' + list_server[i], 'Con?')
                // }, 1000);
                // if (connect_server(1, list_server[i])) {
                //     client_connections[1] = list_server[i];
                //     setTimeout(function () {
                //         resp_msg('c1', 's' + list_server[i], 'Ack')
                //     }, 3500);
                //     //Request for the data
                //     setTimeout(function () {
                //         reqs_msg('c1', 's' + list_server[i], 'READ')
                //     }, 7000);
                //     //Talk to the database
                //     setTimeout(function () {
                //         reqs_msg('s' + list_server[i], 'd' + list_server[i], 'Data')
                //     }, 12000);
                //
                //     setTimeout(function () {
                //         resp_msg('c1', 's' + list_server[i], 'Done')
                //     }, 15500);
                //     // Close the connections
                //     setTimeout(function () {
                //         $('.cnn.' + 'c1' + '.' + 's' + list_server[i]).hide()
                //     }, 20000);
                //     client_connections[1] = -1;
                //     break;
                // }
                // else {
                //     client_connections[1] = -1;
                //     resp_msg('c1', 's' + list_server[i], 'NAck')
                //     continue;
                // }
            }
        }
    });

    $("#b2r").click(function () {
        if (client_connections[2] != -1) {
            console.log('Find connection');
            // Send read request to c1c

        } else {
            //Client is free
            let list_server = [1, 2, 3, 4, 5];
            shuffle(list_server);
            for (let i = 0; i < list_server.length; i++) {
                $('.cnn.c2.s' + list_server[i]).show();
                client_connections[2] = list_server[i];
                setTimeout(function () {
                    reqs_msg('c2', 's' + list_server[i], 'Con?')
                }, 1000);
                if (connect_server(2, list_server[i])) {

                    setTimeout(function () {
                        resp_msg('c2', 's' + list_server[i], 'Ack')
                    }, 3500);
                    //Request for the data
                    setTimeout(function () {
                        reqs_msg('c2', 's' + list_server[i], 'READ')
                    }, 7000);
                    //Talk to the database
                    setTimeout(function () {
                        reqs_msg('s' + list_server[i], 'd' + list_server[i], 'Data')
                    }, 12000);

                    setTimeout(function () {
                        resp_msg('c2', 's' + list_server[i], 'Done')
                    }, 15500);
                    // Close the connections
                    setTimeout(function () {
                        $('.cnn.' + 'c2' + '.' + 's' + list_server[i]).hide()
                        client_connections[2] = -1;
                    }, 20000);
                    break;
                } else {
                    //send nack
                    client_connections[2] = -1;
                    resp_msg('c2', 's' + list_server[i], 'NAck')
                    continue;
                }
            }
        }
    });


    $("#b3r").click(function () {
        if (client_connections[3] != -1) {
            console.log('Find connection');
            // Send read request to c1c

        } else {
            //Client is free
            let list_server = [1, 2, 3, 4, 5];
            shuffle(list_server);
            for (let i = 0; i < list_server.length; i++) {
                $('.cnn.c3.s' + list_server[i]).show();
                if (connect_server(3, list_server[i])) {
                    client_connections[3] = list_server[i];
                    setTimeout(function () {
                        reqs_msg('c3', 's' + list_server[i], 'Con?')
                    }, 1000);
                    setTimeout(function () {
                        resp_msg('c3', 's' + list_server[i], 'Ack')
                    }, 3500);

                    //Request for the data
                    setTimeout(function () {
                        reqs_msg('c3', 's' + list_server[i], 'READ')
                    }, 7000);
                    //Talk to the database
                    setTimeout(function () {
                        reqs_msg('s' + list_server[i], 'd' + list_server[i], 'Data')
                    }, 12000);

                    setTimeout(function () {
                        resp_msg('c3', 's' + list_server[i], 'Done')
                    }, 15500);
                    // Close the connections
                    setTimeout(function () {
                        $('.cnn.' + 'c3' + '.' + 's' + list_server[i]).hide()
                        client_connections[3] = -1;
                    }, 20000);
                    break;
                } else {
                    //negative ack
                    client_connections[3] = -1;
                    resp_msg('c3', 's' + list_server[i], 'NAck')
                    continue;
                }
            }
        }
    });

    $("#b1w").click(function () {
        if (client_connections[1] != -1) {
            console.log('Find connection');
            // Send read request to c1c

        } else {
            // Client is free
            let list_server = [1, 2, 3, 4, 5];
            shuffle(list_server);
            for (let i = 0; i < list_server.length; i++) {
                $('.cnn.c1.s' + list_server[i]).show();
                if (connect_server(1, list_server[i])) {
                    client_connections[1] = list_server[i];
                    setTimeout(function () {
                        reqs_msg('c1', 's' + list_server[i], 'Con?')
                    }, 1000);
                    setTimeout(function () {
                        resp_msg('c1', 's' + list_server[i], 'Ack')
                    }, 3500);
                    setTimeout(function () {
                        reqs_msg('c1', 's' + list_server[i], 'WRITE')
                    }, 7000);
                    //Talk to the Leader
                    if (list_server[i] != leader) {
                        setTimeout(function () {
                            server_talk('s' + list_server[i], 'reverse', 'WRITE')
                        }, 10500);
                    }
                    //leader Broadcast
                    setTimeout(function () {
                        leader_broadcast(list_server, 'WRITE')
                    }, 13500);
                    //server acks
                    setTimeout(function () {
                        leader_broadcast(list_server, 'Ack')
                    }, 18500);
                    //leader checks if sufficient server reply back
                    //if above true, then server broadcasts the write command
                    //all servers write data to the database
                    //
                    break;
                } else {
                    // server is busy, select another one
                    continue;
                }
            }
        }

    });
});


// if (message != 'NAck' && message != 'Done') {
//     (function () {
//         heartbeats(scr, dst, 'Alive')
//         myVar = setTimeout(arguments.callee, 5500);
//     })();
// } else {
//     clearTimeout(myVar);
// }

function connect_server(Cnum, Snum) {
//        check for existing connections and accept only if free.
    if (server_connections[Snum] == -1) {
        // Server is free
        server_connections[Snum] = Cnum;
        return true;
    }
    else {
        //Server is busy
        return false
    }
}

function server_talk(Snum, direction, message) {
    let local_id = id;
    id += 1;
    if (leader != -1) { // Do this only if there is a valid leader elected
        console.log("in talk to leader")
        console.log('.scnn.' + Snum + '.s' + leader)
        let path = anime.path('.scnn.' + Snum + '.s' + leader);
        let box = create_box(local_id, message);
        let motionPath = anime({
            targets: box,
            translateX: path('x'),
            translateY: path('y'),
            rotate: path('angle'),
            easing: 'linear',
            loop: 1,
            direction: direction,
            duration: SENDING_TIME,
//                direction: 'reverse',
            complete: function () {
                delete_box(local_id);
            }
        });
    } else {
        // There is no valid Leader
        console.log("Press Initialize!!!")
    }
}

function leader_broadcast(Snums, message) {
    // This method is for all types of broadcasts
    let count = 1;
    for (let i = 0; i < Snums.length; i++) {
        //Server check the database
        setTimeout(function () {
            reqs_msg('s' + Snums[i], 'd' + Snums[i], 'Data')
        }, 16000);
        if (Snums[i] != leader) {
            if (message == 'WRITE') {
                server_talk('s' + Snums[i], 'normal', message);
            } else if (message == 'Ack') {
                server_talk('s' + Snums[i], 'reverse', message)
            }
        }
    }
}


function connect_reqs(scr, dst) {
    setTimeout(function () {
        reqs_msg(scr, dst, 'conn_req')
    }, 0);

    setTimeout(function () {
        resp_msg(scr, dst, 'conn_ack')
    }, SENDING_TIME + WAITING_TIME);

    return SENDING_TIME * 2 + WAITING_TIME * 2;
}

function read_reqs(scr, dst) {
    setTimeout(function () {
        reqs_msg(scr, dst, 'read_req')
    }, 0);

    setTimeout(function () {
        reqs_msg(dst, 'd' + dst.slice(-1), 'read_ack')
    }, SENDING_TIME + WAITING_TIME);

    setTimeout(function () {
        resp_msg(dst, 'd' + dst.slice(-1), 'data')
    }, SENDING_TIME * 2 + WAITING_TIME * 2);

    setTimeout(function () {
        resp_msg(scr, dst, 'data')
    }, SENDING_TIME * 3 + WAITING_TIME * 3);

    return SENDING_TIME * 4 + WAITING_TIME * 4;
}

function create_box(id, ctn) {
    let rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    rect.setAttribute('x', -box_width / 2);
    rect.setAttribute('y', -box_height / 2);
    rect.setAttribute('width', box_width);
    rect.setAttribute('height', box_height);
    rect.setAttribute('fill', 'rgba(121,121,121,1)');
    rect.setAttribute('stroke-width', '0');
    rect.setAttribute('opacity', '1');
    rect.setAttribute('id', 'movingbox' + id);

    let text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    text.setAttribute('x', -box_width / 2.5);
    text.setAttribute('y', box_height / 5);
    text.setAttribute('width', box_width);
    text.setAttribute('height', box_height);
    text.setAttribute('fill', 'rgba(255,255,255,1)');
    text.setAttribute('stroke-width', '0');
    text.setAttribute('class', 'textbox');
    text.setAttribute('opacity', '1');
    text.setAttribute('id', 'textbox' + id);
    text.innerHTML = ctn;

    svg.appendChild(rect);
    svg.appendChild(text);

    return [rect, text]
}

function delete_box(id) {
    $("#movingbox" + id).remove();
    $("#textbox" + id).remove();
}

function reqs_msg(scr, dst, message) {
    let local_id = id;
    id += 1;

    let path = anime.path('.' + scr + '.' + dst + '.fo');
    let box = create_box(local_id, message);
    let motionPath = anime({
        targets: box,
        translateX: path('x'),
        translateY: path('y'),
        rotate: path('angle'),
        easing: 'linear',
        loop: 1,
        duration: SENDING_TIME,
        complete: function () {
            delete_box(local_id);
        }
    });
}

function resp_msg(scr, dst, message) {
    let local_id = id;
    id += 1;

    let path = anime.path('.' + scr + '.' + dst + '.ro');
    let box2 = create_box(local_id, message);
    let motionPath2 = anime({
        targets: box2,
        translateX: path('x'),
        translateY: path('y'),
        rotate: path('angle'),
        easing: 'linear',
        loop: 1,
        duration: SENDING_TIME,
        complete: function () {
            delete_box(local_id);
        }
    });
}

/**
 * Analyses and initializes labels.
 *
 * @returns {Array}
 */
function analyse_label() {
    let tmp = [];
    let c_le = le.slice();
    while (true) {
        let inv_count = 0;
        for (let i = 0; i < c_le.length; i++) {
            if ('invalid' == c_le[i]) {
                inv_count += 1;
            }
        }
        if (inv_count == c_le.length) {
            break;
        }

        let ms = 999;
        let ind = -1;
        for (let i = 0; i < c_le.length; i++) {
            if ('invalid' == c_le[i]) {
                continue;
            }

            if (ms >= parseInt(c_le[i].slice(-1))) {
                ms = parseInt(c_le[i].slice(-1));
                ind = i
            }
        }
        c_le[ind] = 'invalid';
        tmp.push(ind + 1);
    }

    for (let i = 1; i < tmp.length; i++) {
        $('.scnn.s' + tmp[i - 1] + '.s' + tmp[i]).fadeIn(2000);
        $('.scnn.s' + tmp[i - 1] + '.s' + tmp[i]).css('stroke', '#3d9aff');
    }
    return tmp;
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

