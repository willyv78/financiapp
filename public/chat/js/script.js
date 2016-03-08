$(document).ready(function() {
  // Get references to Firebase data appfliavelsal
  // var ref = new Firebase("https://fiery-heat-6165.firebaseio.com/chat");
  var ref = new Firebase("https://appfliavelsal.firebaseio.com/chat");

  // Get references to DOM elements
  var $username = $("#username");
  var $newMessage = $("#newMessage");
  var $messageList = $("#messageList");
  var $loginButton = $("#loginButton");
  var $loggedInText = $("#loggedInText");
  var $logoutButton = $("#logoutButton");
  var date = new Date();
  // var datenow = getfulldate;

  // Add a new message to the message list
  function addMessage(username, text, fecha) {
    fechamin = new Date(fecha);
    var el = $("<li class='list-group-item'><b>" + username + ":</b> " + text + "<br><div style='text-align:right;'>" + fechamin + "</div></li>");
    $messageList.append(el);
  }

  // Loop through the last ten messages stored in Firebase
  ref.on("child_added", function(snapshot) {
    var message = snapshot.val();

    // Escape unsafe characters
    var username = message.username.replace(/\>/g, "&gt;");
    var text = message.text.replace(/\>/g, "&gt;");
    var fecha = message.fecha.replace(/\>/g, "&gt;");
    addMessage(username, text, fecha);
  });

  // Listen for key presses on the new message input
  $newMessage.keypress(function (e) {
    // Get field values
    var username = $username.val();
    var text = $newMessage.val().trim();

    // Save message to Firebase when enter key is pressed
    if (e.keyCode == 13 && text.length) {
      ref.push({
        username: "@" + globalAuthData.twitter.username,
        text: text,
        fecha: date.toString()
      }, function(error) {
        if (error) {
          console.log("Error agregando nuevo mensaje:", error);
        }
      });

      // Reset new message input
      $newMessage.val("");
    }
  });

  // Listen for changes in auth state and show the appropriate buttons and messages
  var globalAuthData;
  ref.onAuth(function(authData) {
    globalAuthData = authData;

    if (authData) {
      // User logged in
      $loginButton.hide();
      $logoutButton.show();
      $loggedInText.text("Registrado como " + authData.twitter.displayName);
      $newMessage.prop("disabled", false);
    } else {
      // User logged out
      $loginButton.show();
      $logoutButton.hide();
      $loggedInText.text("");
      $newMessage.prop("disabled", true);
    }
  });

  // Login with Twitter when the login button is pressed
  $loginButton.click(function() {
    ref.authWithOAuthPopup("twitter", function(error, authData) {
      if (error) {
        console.error("Error autenticando con Twitter:", error);
      }
    });
  });

  // Logout when the logout button is pressed
  $logoutButton.click(function() {
    ref.unauth();
  });
  // Cuando se hace click sobre el boton regresar dentro del formulario de nuevo registro en finanzas
  $("#regresar").on("click", function () {
    window.location = "../";
  });
});
