$(document).ready(function() {

    let uinButton = $("#uinButton");
    let uinNumber = $("#uinNumber");

    uinButton.on("click", function() {

        if ( uinNumber.val().length === 25 || uinNumber.val().length === 20 ) {

            let linkServer  = "https://gospay.ru/api/uin/uinValidator.php" + "?UIN=" + uinNumber.val();
            let linkRead    = "https://gospay.ru/api/uin/file.js";

            $.ajax({
                method: "POST",
                async: false,
                url: linkServer,
            });

            //прячем ошибки корсов
            console.clear();

            $.ajax({
                method: "GET",
                async: false,
                url: linkRead,
                dataType: "script"
            });


        } else {
            Swal.fire({
                position: 'center',
                type: 'info',
                title: 'Ошибка',
                text: 'Количество символов в номере УИН должно быть 20 или 25',
                showConfirmButton: false,
                timer: 2000
            });
        }

    });

    console.log("\n%c  \n%c \n%c  by ❤ Alexey Akashkin ❤ \n\n vk.com/6level6  \n\n", "background: url(https://alexey-saransk.github.io/uin-validator/img/alexey.jpg) center center no-repeat;background-size:contain;font-size:100px;", "", "font-size:15px");


});
