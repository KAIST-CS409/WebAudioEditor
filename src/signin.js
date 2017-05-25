import $ from 'jquery';
import 'dist/css/bootstrap.css';
import 'dist/js/bootstrap.min.js';
import 'css/signin.css';

$(document).ready(function() {
    $("#form-signin").submit(() => {
        let formData = {};
        formData["username"] = $("#inputUsername").val();
        formData["password"] = $("#inputPassword").val();
        $.ajax({
            url: "/signin",
            type: "POST",
            data: formData,
            success: (data) => {
                console.log(data);
                let success = data["result"];
                if (success == 1) {
                    console.log("succeed login");
                    window.location.replace("/");
                }
            },
            error: (data) => {
                console.log(data);
                $("#alert-box").show();
            }
        });
        return false;
    });
});