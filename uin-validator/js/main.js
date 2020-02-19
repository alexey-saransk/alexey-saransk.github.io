$(document).ready(function() {

    let uinButton = $("#uinButton");
    let uinNumberText = $("#uinNumber");

    uinButton.on("click", function() {

        if ( uinNumberText.val().length === 25 || uinNumberText.val().length === 20 ) {

            let linkServer = "https://gospay.ru/api/uin/uinValidator.php";

            var inPHPValidator = {
                "uin" : uinNumberText.text(),
            };

            $.ajax({
                url: linkServer,
                type: 'POST',
                data: JSON.stringify(inPHPValidator),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                async: true,
                beforeSend: function() {
                    uinButton.prop("disabled", true);
                    //StartSearch(uinButton);
                },
                success: function(data) {
                    //StopSearch(uinButton);
                    uinButton.prop("disabled", false);

                    if (data.text === 'Y' && data.code === 'Y') {

                        //что-то нашли по УИН валидный
                        Swal.fire({
                            title: '👌 ✔ 👍',
                            html: data.text,
                            type: 'warning',
                            position: 'center',
                        });

                    } else {

                        //УИН номер не валидный
                        Swal.fire({
                            title: 'Ошибка',
                            html: data.text,
                            type: 'warning',
                            position: 'center',
                        });

                    }

                },

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

});