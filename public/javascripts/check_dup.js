// 중복확인 창 열기

function open_dup_window(){
    gsWin = window.open("register/dup_chk", "_blank", "width=600,height=400");
    value_id = gsWin.document.getElementById("dup_id")
    }