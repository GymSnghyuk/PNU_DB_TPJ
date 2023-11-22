// 중복확인 창 열기

function open_dup_window(){
    gsWin = window.open("register/dup_chk", "_blank", "popup=1");
    value_id = gsWin.document.getElementById("dup_id")
    }