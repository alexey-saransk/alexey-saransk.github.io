$(document).ready(function() {

    let uinButton = $("#uinButton");
    let uinNumber = $("#uinNumber");



    uinButton.on("click", function() {

        if ( uinNumber.val().length === 25 || uinNumber.val().length === 20 ) {

            let linkServer  = "https://gospay.ru/api/uin/uinValidator.php";

            var inGisGmp = {
                "uin" : uinNumber.val()
            };

            $.ajax({
                url: linkServer,
                type: 'POST',
                data: JSON.stringify(inGisGmp),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                async: true,
                beforeSend: function() {
                    uinButton.prop("disabled", true)
                },
                success: function(data) {
                    uinButton.prop("disabled", false);

                    if (data.code === "Y") {
                        Swal.fire(
                            'Валидный!',
                            'УИН №' + uinNumber.val() + ' ',
                            'success'
                        );
                    } else if (data.code === "N") {
                        Swal.fire(
                            'Не валидный!',
                            'УИН №' + uinNumber.val() + ' ',
                            'error'
                        );
                    } else {
                        Swal.fire(
                            '' + data.text +'',
                            'УИН №' + uinNumber.val() + ' ',
                            'error'
                        );
                    }

                }

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

    console.log("\n%c  \n%c \n%c  by 🙈 Alexey Akashkin 🙉 \n\n vk.com/6level6  \n\n", "background: url(https://raw.githubusercontent.com/alexey-saransk/alexey-saransk.github.io/master/uin-validator/img/alexey.jpg) center center no-repeat;background-size:contain;font-size:250px;", "", "font-size:15px");

});
