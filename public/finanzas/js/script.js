$(document).ready(function() {

  var today = new Date(); 
  var dd = today.getDate(); 
  var mm = today.getMonth()+1;//January is 0! 
  var yyyy = today.getFullYear(); 
  if(dd<10){dd='0'+dd}
  if(mm<10){mm='0'+mm}
  var ftoday = yyyy+'-'+mm+'-'+dd;
  // Get references to Firebase data cuf5PLsqRDHvGUgPEA4AulKRL 2Z8kNQAGQCKz1avqkgcYtAq1JoBYsVIhzXspYOkiAFQcntuTLd
  // var ref = new Firebase("https://fiery-heat-6165.firebaseio.com/finazas");
  var ref = new Firebase("https://appfliavelsal.firebaseio.com/finazas");
  // Get references to DOM elements
  var $tipo = $("#tip-ing-gasto");
  var $resp = $("#nom-ing-gasto");
  var $conc = $("#mot-ing-gasto");
  var $val = $("#val-ing-gasto");
  var $obs = $("#obs-ing-gasto");
  var $fec = $("#fec-ing-gasto");
  var $registerList = $("#registros");
  var $username = $("#username");
  var $insertButton = $("#ingresar");
  var $loginButtonCont = $("#loginButtonCont");
  var $logoutButton = $("#logoutButton");
  var $botonLoginNav = $("#botonLoginNav");
  var alertBox = $('#alert');
  var globalAuthData;
  // Add a new message to the message list
  function addMessage(username, tipo, resp, conc, val, obs, fec) {
    var calsetd = "danger";
    if(tipo === 'Ingreso'){
      calsetd = "success";
    }
    var el = $("<tr class='" + calsetd + "'><td class='text-center'>" + fec + "</td><td class='text-left'>" + conc + "</td><td class='text-right'>" + val + "</td><td class='hidden-xs text-center'>" + resp + "</td><td class='hidden-xs text-left'>" + obs + "</td><td class='hidden-xs hidden-sm text-center'>" + username + "</td></tr>");
    $registerList.prepend(el);
  }
  // Loop through the last ten messages stored in Firebase
  ref.on("child_added", function(snapshot) {
    var message = snapshot.val();

    // Escape unsafe characters
    var username = message.username.replace(/\</g, "&lt;");
    var tipo = message.tipo.replace(/\>/g, "&gt;");
    var resp = message.responsable.replace(/\>/g, "&gt;");
    var conc = message.concepto.replace(/\>/g, "&gt;");
    var val = message.valor.replace(/\>/g, "&gt;");
    var obs = message.observacion.replace(/\>/g, "&gt;");
    var fec = message.fecha.replace(/\>/g, "&gt;");

    addMessage(username, tipo, resp, conc, val, obs, fec);
  });
  // funcion que valida si un campo en el formulario esta vacio
  function validaCampo (campo) {
    var valorCampo = campo.val();
    if(valorCampo.length){
      return valorCampo;
    }
    else{
      swal({
          title: "Atención!",
          text: "Este campo no debe estar vacio.",
          type: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#F27474"
      });
      campo.focus();
      return false;
    }
  }
  // Listen for key presses on the new message input
  $insertButton.click(function (e) {
    // Get field values
    var tipo = validaCampo($tipo);
    var resp = validaCampo($resp);
    var conc = validaCampo($conc);
    var val = validaCampo($val);
    var obs = $obs.val();
    var fec = $fec.val();
    if(fec === ''){
      fec = ftoday;
    }
    var username = $username.val();
    if((tipo) && (resp) && (conc) && (val)){
      ref.push({
        tipo: tipo,
        responsable: resp,
        concepto: conc,
        valor: val,
        observacion: obs,
        fecha: fec,
        username: "@" + globalAuthData.twitter.username
      }, function(error) {
        if (error) {
          console.log("Error agregando nuevo registro:", error);
        }
      });
      // Reset new message input
      $tipo.val("");
      $resp.val("");
      $conc.val("");
      $val.val("");
      $obs.val("");
      $fec.val("");
    }
  });
  // Opciones para mostrar alertas
  function showAlert(opts) {
      var title = opts.title;
      var detail = opts.detail;
      var className = 'pull-right alert ' + opts.className;
      var imagen = opts.imagen;
      var botonNav = opts.botonNav;

      // alertBox.removeClass().addClass(className);
      // alertBox.children('#alert-title').text(' ' + title + ' ' + detail);
      $('#alert-img').attr({'src': imagen, 'title' : title + detail, 'alt' : title + detail});
      $('#botonLoginNav').html(botonNav);
  }
  // funcion que valida si hay un usuario registrado
  function userAuthTwitter () {
      ref.onAuth(function globalOnAuth(authData) {
          if (authData) {
            globalAuthData = authData;
            showAlert({
              title: ' Conectado como ',
              detail: authData.twitter.username,
              imagen: authData.twitter.profileImageURL,
              className: 'alert-info',
              botonNav: '<a id="loginButtonNav" class="btn btn-twitter"><span class="fa fa-twitter" style="float:none;position:relative;"></span>&nbsp;<span id="texto-twitter">Salir</span></a>'
            });
          } else {
            showAlert({
              title: 'Atención',
              detail: 'Usted no esta conectado.',
              imagen: './img/avatar.png',
              className: 'alert-danger',
              botonNav: '<a id="loginButtonNav" class="btn btn-twitter"><span class="fa fa-twitter" style="float:none;position:relative;"></span>&nbsp;<span id="texto-twitter">Login</span></a>'
            });
            window.location = "../";
          }
      });
  }
  userAuthTwitter();
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
  $("#loginButtonNav").on("click", clickAca);
  function clickAca(argument) {
    if ($("#texto-twitter").text() === 'Salir') {
      desconectarTwitter();
    }
    else{
      conectarTwitter();
    }
  }

  // Cuando se hace click sobre el boton regresar dentro del formulario de nuevo registro en finanzas
  $("#regresar").on("click", function () {
    window.location = "../";
  });
});
