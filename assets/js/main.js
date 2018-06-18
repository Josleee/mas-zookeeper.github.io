let le = ['/le/000', '/le/001', '/le/002', '/le/003', '/le/004'];
let box_width = 100;
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
        click_action(1, true);
    });

    $("#b2r").click(function () {
        click_action(2, true);
    });

    $("#b3r").click(function () {
        click_action(3, true);
    });

    $("#b1w").click(function () {
        click_action(1, false);
    });

    $("#b2w").click(function () {
        click_action(2, false);
    });

    $("#b3w").click(function () {
        click_action(3, false);
    });

    $("#btn-speed-less").click(function () {
        SENDING_TIME *= 4 / 3;
    });

    $("#btn-speed-reset").click(function () {
        SENDING_TIME = 2500;
    });

    $("#btn-speed-more").click(function () {
        SENDING_TIME *= 2 / 3;
    });
});

function click_action(num, is_read) {
    let running_time, conn;

    if (client_connections[num] !== -1) {
        console.log('Find connection');
        conn = client_connections[num];
        // Send read request to c1c

    } else {
        //Client is free
        let list_server = [1, 2, 3, 4, 5];
        shuffle(list_server);

        for (let i = 0; i < list_server.length; i++) {
            $('.cnn.c' + num + '.s' + list_server[i]).show();
            client_connections[num] = list_server[i];

            running_time = connect_reqs('c' + num, 's' + list_server[i]);
            conn = list_server[i];
            break;
        }
    }

    if (is_read) {
        setTimeout(function () {
            read_reqs('c' + num, 's' + conn);
        }, running_time);
    } else {
        setTimeout(function () {
            write_reqs('c' + num, 's' + conn);
        }, running_time);
    }
}

function write_reqs(scr, dst) {
    let write_id = Math.floor(random() * 100);
    let write_req = 'write_req_' + write_id;
    let write_ack = 'write_ack_' + write_id;
    let write_all_ack = 'write_ack_all_' + write_id;

    setTimeout(function () {
        reqs_msg(scr, dst, write_req)
    }, 0);

    if (leader != dst.slice(-1)) {
        setTimeout(function () {
            addKnowledge(dst, write_req);
            send_msg(dst, 's' + leader, write_req);
        }, SENDING_TIME + WAITING_TIME);
    }

    for (let i = 0; i < l_le.length; i++) {
        if (l_le[i] != leader) {
            setTimeout(function () {
                addKnowledge('s' + (leader), write_req);
                send_msg('s' + (leader), 's' + (l_le[i]), write_req);
            }, SENDING_TIME * 2 + WAITING_TIME * 2);
        }

        setTimeout(function () {
            addKnowledge('s' + l_le[i], write_req);
            send_msg('s' + l_le[i], 'd' + l_le[i], write_req);
        }, SENDING_TIME * 3 + WAITING_TIME * 3);

        setTimeout(function () {
            addKnowledge('d' + l_le[i], write_req);
            send_msg('d' + l_le[i], 's' + l_le[i], write_ack);
        }, SENDING_TIME * 4 + WAITING_TIME * 4);

        if (l_le[i] != leader) {
            setTimeout(function () {
                send_msg('s' + (l_le[i]), 's' + (leader), write_ack);
            }, SENDING_TIME * 5 + WAITING_TIME * 5);
        }

        setTimeout(function () {
            addKnowledge('s' + l_le[i], write_ack);
        }, SENDING_TIME * 5 + WAITING_TIME * 5);
    }

    if (leader != dst.slice(-1)) {
        setTimeout(function () {
            addKnowledge('s' + leader, write_all_ack);
            send_msg('s' + leader, dst, write_ack);
        }, SENDING_TIME * 6 + WAITING_TIME * 6);
    }

    setTimeout(function () {
        addKnowledge(dst, write_all_ack);
        send_msg(dst, scr, write_ack);
    }, SENDING_TIME * 7 + WAITING_TIME * 7);

    setTimeout(function () {
        addKnowledge(scr, write_all_ack);
    }, SENDING_TIME * 8 + WAITING_TIME * 8);

    return SENDING_TIME * 8 + WAITING_TIME * 8;
}

function heart_beat(scr, dst) {
    setTimeout(function () {
        send_msg(scr, dst, 'hb_req')
    }, 0);

    setTimeout(function () {
        addKnowledge(dst, 'hb_req');
        send_msg(dst, 'd' + dst.slice(-1), 'hb_req')
    }, SENDING_TIME + WAITING_TIME);

    setTimeout(function () {
        addKnowledge('d' + dst.slice(-1), 'hb_req');
        send_msg('d' + dst.slice(-1), dst, 'hb_ack')
    }, SENDING_TIME * 2 + WAITING_TIME * 2);

    setTimeout(function () {
        addKnowledge(dst, 'hb_ack');
        send_msg(dst, scr, 'hb_ack')
    }, SENDING_TIME * 3 + WAITING_TIME * 3);

    setTimeout(function () {
        addKnowledge(scr, 'hb_ack');
        send_msg(dst, scr, 'hb_ack')
    }, SENDING_TIME * 3 + WAITING_TIME * 3);

    return SENDING_TIME * 4 + WAITING_TIME * 4;
}

function connect_reqs(scr, dst) {
    setTimeout(function () {
        send_msg(scr, dst, 'conn_req')
    }, 0);

    setTimeout(function () {
        addKnowledge(dst, 'conn_req');
        send_msg(dst, scr, 'conn_ack')
    }, SENDING_TIME + WAITING_TIME);

    setTimeout(function () {
        addKnowledge(scr, 'conn_ack');
    }, SENDING_TIME * 2 + WAITING_TIME * 2);

    return SENDING_TIME * 2 + WAITING_TIME * 2;
}

function read_reqs(scr, dst) {
    let read_id = Math.floor(random() * 100);

    setTimeout(function () {
        send_msg(scr, dst, 'read_req_' + read_id)
    }, 0);

    setTimeout(function () {
        addKnowledge(dst, 'read_req_' + read_id);
        send_msg(dst, 'd' + dst.slice(-1), 'read_ack')
    }, SENDING_TIME + WAITING_TIME);

    setTimeout(function () {
        addKnowledge('d' + dst.slice(-1), 'read_req_' + read_id);
        send_msg('d' + dst.slice(-1), dst, 'data')
    }, SENDING_TIME * 2 + WAITING_TIME * 2);

    setTimeout(function () {
        addKnowledge(dst, 'data_' + read_id);
        send_msg(dst, scr, 'data')
    }, SENDING_TIME * 3 + WAITING_TIME * 3);

    setTimeout(function () {
        addKnowledge(scr, 'data_' + read_id);
    }, SENDING_TIME * 4 + WAITING_TIME * 4);

    return SENDING_TIME * 4 + WAITING_TIME * 4;
}

function random() {
    let d = new Date();
    let seed = d.getMilliseconds();
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function addKnowledge(item, msg) {
    if ($('#b' + item).html().split('<br>')[0] === 'K' + item.slice(0, 1) + '(' + msg + ')') {
        return;
    }

    $('#b' + item).html('K' + item.slice(0, 1) + '(' + msg + ')<br>' + $('#b' + item).html());
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
    text.setAttribute('x', -box_width / 2.3);
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

function send_msg(scr, dst, message) {
    if (dst.slice(0, 1) === 'd' || scr.slice(0, 1) === 'c') {
        reqs_msg(scr, dst, message);
        return;
    } else if (scr.slice(0, 1) === 'd' || dst.slice(0, 1) === 'c') {
        resp_msg(scr, dst, message);
        return;
    }

    if (scr.slice(-1) > dst.slice(-1)) {
        resp_msg(dst, scr, message);
    } else {
        reqs_msg(dst, scr, message);
    }
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

