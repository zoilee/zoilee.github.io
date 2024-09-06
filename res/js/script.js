function preloader(){
    'use strict';
    $('.preloader').delay(100).fadeOut(10);
}
//$(preloader);
$(document).ready(function(){
    //182ABE155539C3E8689C49DEF8972EBA6D2D9D74D2780484DAF9CE35E60FD7D10A38AD29797939AEFA38E061827D86A2

    $("#sendEmail").click(function(){
        const fromName = $("#fromName").val();
        const fromEmail = $("#fromEmail").val();
        const fromTel = $("fromTel").val();
        const subject = $("#subject").val();
        let body = $("#body").val();
        body = "<h1>"+ fromEmail + "님의 메일입니다. </h1><br>" + "전화번호 : " + fromTel + "<br><br>" + body;

        Email.send({
            SecureToken: "182ABE155539C3E8689C49DEF8972EBA6D2D9D74D2780484DAF9CE35E60FD7D10A38AD29797939AEFA38E061827D86A2",
            To : 'ohsj2337@naver.com',
            From : fromEmail,
            Subject : subject,
            Body: body
        }).then(
            message => { console.log("이메일이 전송되었습니다.");}
        ).catch()
            error => { console.log("이메일 전송이 실패했습니다.");}
        console.log(subject);
        console.log(body);
    });
});