import $ from 'jquery';
import 'css/signin.css';
import 'dist/css/bootstrap.css';
import 'dist/js/bootstrap.min.js';

$(document).ready(function() {
    $("#form-signup").submit(() => {
        let formData = {};
        formData["username"] = $("#inputUsername").val();
        formData["password"] = $("#inputPassword").val();
        $.ajax({
            url: "/user",
            type: "POST",
            data: formData,
            success: (data) => {
                console.log(data);
                let success = data["result"];
                if (success == 1) {
                    console.log("succeed creating");
                    window.location.replace("/signin");
                }
            },
            error: (data) => {
                $("#alert-box").show();
            }
        });
        return false;
    });
});