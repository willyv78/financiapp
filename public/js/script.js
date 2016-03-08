$(document).ready(function() {
    var ref = new Firebase("https://appfliavelsal.firebaseio.com");

    var $loginButtonNav = $("#loginButtonNav");
    var $loginButtonCont = $("#loginButtonCont");
    var $logoutButton = $("#logoutButton");
    var $botonLoginNav = $("#botonLoginNav");
    var $textotwitter = $("#texto-twitter");
    var alertBox = $('#alert');

    // Funcion que hace la conección con firebase y twitter
    function conectarTwitter () {
        ref.authWithOAuthPopup("twitter", function(error, authData) {
            if (error) {
                console.error("Error autenticando con Twitter:", error);
            }
            else{
                userAuthTwitter();
                $("#divInicio").load("./view/home.html");
            }
        });
    }

    // funcion que desconecta con firebase y twitter
    function desconectarTwitter () {
        ref.unauth();
    }

    // Login with Twitter when the login button is pressed
    $loginButtonNav.click(function() {
        if ($textotwitter.text() === 'Salir') {
            desconectarTwitter();
        }
        else{
            conectarTwitter();
        }
    });

    // Login with Twitter when the login button is pressed
    // $loginButtonCont.click(function() {
    //     ref.authWithOAuthPopup("twitter", function(error, authData) {
    //         if (error) {
    //             console.error("Error autenticando con Twitter:", error);
    //         }
    //         else{
    //             userAuthTwitter();
    //             $("#divInicio").load("./view/home.html");
    //         }
    //     });
    // });

    // Opciones para mostrar alertas
    function showAlert(opts) {
        var title = opts.title;
        var detail = opts.detail;
        var className = 'alert ' + opts.className;
        var imagen = opts.imagen;
        var botonNav = opts.botonNav;

        alertBox.removeClass().addClass(className);
        alertBox.children('#alert-title').text(' ' + title + '\n' + detail);
        $('#alert-img').attr('src', imagen);
        $('#texto-twitter').html(botonNav);
    }

    // funcion que valida si hay un usuario registrado
    function userAuthTwitter () {
        ref.onAuth(function globalOnAuth(authData) {
            if (authData) {
                showAlert({
                    title: ' Conectado como ',
                    detail: authData.twitter.username,
                    imagen: authData.twitter.profileImageURL,
                    className: 'alert-success',
                    botonNav: 'Salir'
                });
                $("#divInicio").load("./view/home.html");
                // console.log(authData);
            } else {
                showAlert({
                    title: 'Atención',
                    detail: 'Usted no esta conectado.',
                    imagen: './img/avatar.png',
                    className: 'alert-danger',
                    botonNav: 'Login con Twitter'
                });
                $("#divInicio").load("./view/login.html");
            }
        });
    }

    userAuthTwitter();

});
