$(document).ready(function () {

  const socket = io(); // Always place socket on top otherwise it won't initialize

  socket.on('connect', (socket) => {
    console.log("Socket Connected");
  });

  // import SocketIOManager from "../../app";
  function socketEmitter(nameSpace, data) {
    //event emitter function
    socket.emit(nameSpace, data);
  }

  // =============================================================================================
  // =============================================================================================
  // =============================================================================================
  // =============================================================================================

  // LOGIN SETTINGS

  const loginForm = $("#loginForm");
  const inputEmail = $("#inputEmail");
  const inputPassword = $("#inputPassword");
  loginForm.on("submit", function (e) {
    e.preventDefault();
    let formData = {
      email: inputEmail.val(),
      password: inputPassword.val(),
    }
    $.ajax({
      url: `http://localhost:8080/sign-in?email=${formData.email}&password=${formData.password}`,
      type: "POST",
      success: function (response) {
        console.log("The request was successful!");
        window.location.href = "http://localhost:8080/chat";
        return false
      },
      error: function (error) {
        console.log("There was an error with the request.");
        console.log(error);
      }
    })
  })

  // =============================================================================================
  // =============================================================================================
  // =============================================================================================
  // =============================================================================================

  // ROOM SETTINGS
  const selectedUser = $("#selectedUser");
  const user2_Id = $("#user2_Id");
  const newChatForm = $("#startNewChatForm");
  const startNewChatButton = $("#newChatButton");

  newChatForm.submit(async (e) => {
    e.preventDefault();
    let user1 = user2_Id.val();
    let user2 = selectedUser.val();
    console.log(user1, user2);
    startNewChatButton.click(function () {
      $.ajax({
        url: `http://localhost:8080/start-new-chat?mySelf=${user1}&friend=${user2}`,
        type: "GET",
        success: function (response) {
          console.log("The request was successful!");
          socket.emit('create-room', response.newRoom, user1)
          window.location.href = "http://localhost:8080/chat";
        },
        error: function (error) {
          console.log("There was an error with the request.");
          console.log(error);
        }
      })
      return false;
    })
  })



  $('.chatRoomId').click(function () {
    const data = $(this).attr('aria-valuetext');
    const split = data.split(",");
    var roomId = split[0];
    var friendId = split[1];
    var myId = split[2];

    let roomData = {
      me: myId,
      room: roomId,
    }
    $.ajax({
      url: `http://localhost:8080/get-room-details?roomId=${roomId}&friendId=${friendId}&myId=${myId}`,
      type: 'GET',
      success: function (response) {
        console.log("The request was successful!");
        socket.emit("join_room", roomData)
        const friendData = response.roomDetails;
        var html1 = "";
        var html2 = "";
        friendData.map((a) => {
          const friend = a.friend;
          const messages = a.messages;
          socket.emit("join-room", room)
          html1 += ` <div style="color:mediumseagreen;" class="col-md-12">
            <div  class="inside">
                <a href="#"><img class="avatar-md" src="${friend.image}" data-toggle="tooltip"
                        data-placement="top"></a>
                <div class="status">
                    <i class="material-icons online">fiber_manual_record</i>
                </div>
                <div class="data">
                    <h5><a href="#">${friend.firstName} ${friend.lastName}</a></h5>
                    
                    <span class="userStatus"><b>offline</b></span>

                </div>
                <button class="btn connect d-md-block d-none" name="1"><i
                        class="material-icons md-30">phone_in_talk</i></button>
                <button class="btn connect d-md-block d-none" name="1"><i
                        class="material-icons md-36">videocam</i></button>
                <button class="btn d-md-block d-none"><i class="material-icons md-30">info</i></button>
                <div class="dropdown">
                    <button class="btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i
                            class="material-icons md-30">more_vert</i></button>
                    <div class="dropdown-menu dropdown-menu-right">
                        <button class="dropdown-item connect" name="1"><i class="material-icons">phone_in_talk</i>Voice
                            Call</button>
                        <button class="dropdown-item connect" name="1"><i class="material-icons">videocam</i>Video
                            Call</button>
                        <hr>
                        <button class="dropdown-item"><i class="material-icons">clear</i>Clear History</button>
                        <button class="dropdown-item"><i class="material-icons">block</i>Block Contact</button>
                        <button class="dropdown-item"><i class="material-icons">delete</i>Delete Contact</button>
                    </div>
                </div>
            </div>
        </div>`

          messages.map((m) => {
            if (myId === m.sender) {
              html2 += `<div class="message me">
             <div class="text-main">
             <div class="text-group me">
             <div class="text me">
             <p>${m.content}</p>
             </div>
             </div>
             <span style="color:#000;">${m.createdAt}</span>
             </div>
             </div>`
            } else {
              html2 += `<div style="color:#000;" class="message">         
                  <img class="avatar-md" src="/img/avatars/avatar-female-5.jpg" data-toggle="tooltip"
                    data-placement="top" title="Keith" alt="avatar" />
                  <div class="text-main">
                    <div class="text-group">
                      <div style="background-color:#66FF99;" class="text">
                        <p>${m.content}</p>
                      </div>
                    </div>
                    <span>${m.createdAt}</span>
                  </div>
                </div>`
            }
          })

        })
        document.getElementById("chatbox").innerHTML += html2;
        document.getElementById("chatTopBar").innerHTML = html1;
      },
      error: function (error) {
        console.log("There was an error with the request.");
        console.log(error);
      }
    });

    const chatForm = $("#chatForm");
    const sender_fullname = $("#sender_fullname");
    const textMessage = $("#textMessage");
    const sender_id = $("#sender_id");
    const receiver_id = friendId;
    const room = roomId;

    chatForm.unbind("submit").bind("submit", function (event) {
      event.preventDefault();
      function formatAMPM(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";

        hours %= 12;
        hours = hours || 12;
        minutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${hours}:${minutes} ${ampm}`;
      }
      const roomDetails = {
        roomId: room,
        sender_fullname: sender_fullname.val(),
        textMessage: textMessage.val(),
        sender_id: sender_id.val(),
        receiver_id: receiver_id,
        createdAt: formatAMPM(new Date()),
      }
      if (textMessage.val() !== "") {
        socket.emit("privateMessage", roomDetails);
        textMessage.val("");
        textMessage.focus();
        $("#chatbox").scrollTop = $("#chatbox").scrollHeight;

        var html = '';
        html += `<div class="message me">
        <div class="text-main">
        <div class="text-group me">
        <div class="text me">
        <p>${roomDetails.textMessage}</p>
        </div>
        </div>
        <span>${roomDetails.createdAt}</span>
        </div>
        </div> `;
      }

      $(".discussionMessage").html(`<p class="discussionMessage">You: ${roomDetails.textMessage.substring(0, 20).concat("...")}</p>`)

      document.getElementById("chatbox").innerHTML += html;
    })
    return false;
  });


  $("#textMessage").on("keypress", function () {
    socket.emit('message_typing', "...")
  });
  $("#textMessage").on("keyup", function () {
    socket.emit('message_typing_stops', "")
  })
  socket.on("message_typing", (data) => {
    var html = "";
    html = `<div style="color:#000;" class="message typingMessage">
    <img class="avatar-md" src="dist/img/avatars/avatar-female-5.jpg" data-toggle="tooltip" data-placement="top"
        title="Keith" alt="avatar">
    <div class="text-main">
        <div class="text-group">
            <div style = "background-color:#66FF99;" class="text typing">
                <div class="wave">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </div>
            </div>
        </div>
    </div>
</div>`

    document.getElementById("chatbox").innerHTML = html;
  })
  socket.on("message_typing_stops", (data) => {
    $(".typingMessage").fadeOut(1000, function () { return })
  })
  // =============================================================================================
  // =============================================================================================
  // =============================================================================================
  // =============================================================================================

  // MESSAGE SETTINGS
  socket.on("privateMessage", (data) => {
    console.log(data);
    toastr.info("one new message", "Notification")

    var html1 = "";
    const message = data[data.length - 1];

    html1 += `<div style="color:#000;" 
              class="message">         
            <img class="avatar-md" src="/img/avatars/avatar-female-5.jpg" data-toggle="tooltip"
              data-placement="top" title="Keith" alt="avatar" />
            <div class="text-main">
              <div class="text-group">
                <div style = "background-color:#66FF99;"  class="text">
                  <p>${message.content}</p>
                </div>
              </div>
              <span>${message.createdAt}</span>
            </div>
          </div>`;
    document.getElementById("chatbox").innerHTML += html1;

    $('.discussionMessage').html(`<p class="discussionMessage">${message.content.substring(0, 20).concat("...")}</p>`)
  })


  // =============================================================================================
  // =============================================================================================
  // =============================================================================================
  // =============================================================================================


  // NOTIFICATION SETTINGS

  const senderId = $('#senderId');
  const senderName = $('#senderName');
  const senderImage = $('#senderImage');
  const senderLocation = $('#senderLocation');
  const receiverId = $('#receiverId');
  const receiverName = $('#receiverName');
  const receiverImage = $('#receiverImage');
  const receiverLocation = $('#receiverLocation');
  const notificationForm = $('#notificationForm');
  const sendButton = $('#sendRequest'); // send button

  notificationForm.submit(async (e) => {
    e.preventDefault();
    let request = {

      sender: {
        id: senderId.val(),
        name: senderName.val(),
        image: senderImage.val(),
        location: senderLocation.val(),
      },
      receiver: {
        id: receiverId.val(),
        name: receiverName.val(),
        image: receiverImage.val(),
        location: receiverLocation.val(),
      },
      socket: socket.id,
      message: `${senderName.val()} sent you a friend request`,
      time: Date.now(),


    }
    // console.log(request);

    sendButton.click(function () {
      socketEmitter('sentNotification', request)
      sendButton.replaceWith('<button class="btn button w-50" id="sendRequest" disabled>Friend Request Sent</button>')
      alert('Your request has been sent')
      return false;
    })
  })

  const requestButtons = $("#requestButtons");
  const acceptButton = $("#accept");
  const friend = $("#rId");

  acceptButton.click(function () {
    let name = {
      friend: friend.val(),
      socket: socket.id,
    }
    if (name) {
      requestButtons.html(`<div id="accepted"><p>You are now friends</p></div>`).attr('disabled', true)
      socketEmitter("acceptedRequest", name)
    }
  })
  socket.on('requestAccepted', (data) => {
    console.log(data);
  })

  socket.on("join_room", (data) => {
    $(".userStatus").html(` <span id="Status"><b>online</b></span>`)
  })




})



