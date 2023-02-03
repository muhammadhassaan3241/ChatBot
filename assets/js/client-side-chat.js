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


  const selectedUser = $("#selectedUser");
  const user2_Id = $("#user2_Id");
  const newChatForm = $("#startNewChatForm");
  const startNewChatButton = $("#newChatButton");


  newChatForm.submit(async (e) => {
    e.preventDefault();
    let user1 = user2_Id.val();
    let user2 = selectedUser.val();
    let users = {
      myself: user1,
      friend: user2,
    }
    console.log(users);
    startNewChatButton.click(function () {
      if (user2 === "") {
        alert('Please select a friend to talk')
        return false;
      } else {
        socket.emit('startNewChat', users)
        alert('new chat has been created')
        return false;
      }
    })
  })

  $('.chatRoomId').click(function () {
    const data = $(this).attr('aria-valuetext');
    const split = data.split(",");

    var roomId = split[0];
    var friendId = split[1];
    var myId = split[2];
    socket.emit("room", roomId)
    $.ajax({
      url: `http://localhost:8080/get-room-details?roomId=${roomId}&friendId=${friendId}&myId=${myId}`,
      type: 'GET',
      success: function (response) {
        console.log("The request was successful!");
        const friendData = response.roomDetails;
        var html = "";
        friendData.map((a) => {
          const friend = a.friend;
          html += ` <div class="col-md-12">
            <div class="inside">
                <a href="#"><img class="avatar-md" src="${friend.image}" data-toggle="tooltip"
                        data-placement="top" alt="avatar"></a>
                <div class="status">
                    <i class="material-icons online">fiber_manual_record</i>
                </div>
                <div class="data">
                    <h5><a href="#">${friend.firstName} ${friend.lastName}</a></h5>
                    
                    <span>Active now</span>

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
        })
        document.getElementById("chatTopBar").innerHTML = html;
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
      const roomDetails = {
        roomId: room,
        sender_fullname: sender_fullname.val(),
        textMessage: textMessage.val(),
        sender_id: sender_id.val(),
        receiver_id: receiver_id,
      }
      if (textMessage.val() !== "") {
        socket.emit("privateMessage", roomDetails);
      }
      textMessage.val("");
      return false;
    })
  });


  socket.on("privateMessage", (data) => {
    var html = "";

  })

  // socket.on("privateMessage", async (data) => {
  //   data.map((m) => {
  //     html += `<div class="message">         
  //          <img class="avatar-md" src="/img/avatars/avatar-female-5.jpg" data-toggle="tooltip"
  //            data-placement="top" title="Keith" alt="avatar" />
  //          <div class="text-main">
  //            <div class="text-group">
  //              <div class="text">
  //                <p>${m.content}</p>
  //              </div>
  //            </div>
  //            <span>${m.time}</span>
  //          </div>
  //        </div>`;

  //     document.getElementById("chatbox").innerHTML += html;
  //   });
  // });

  // function changeChatView(messages, myID) {
  //   var messagess = messages;
  //   html = "";

  //   messagess.map((msg) => {
  //     console.log(msg);
  //     if (myID === msg.sender) {
  //       html += `<div class="message me">
  //     <div class="text-main">
  //     <div class="text-group me">
  //     <div class="text me">
  //     <p>${msg}</p>
  //     </div>
  //     </div>
  //     <span>${time}</span>
  //     </div>
  //     </div>`;
  //     } else {
  //       html += `<div class="message">         
  //          <img class="avatar-md" src="/img/avatars/avatar-female-5.jpg" data-toggle="tooltip"
  //            data-placement="top" title="Keith" alt="avatar" />
  //          <div class="text-main">
  //            <div class="text-group">
  //              <div class="text">
  //                <p>${msg.content}</p>
  //              </div>
  //            </div>
  //            <span>${msg.createdAt}</span>
  //          </div>
  //        </div>`;
  //     }
  //   });
  //   document.getElementById("chatbox").innerHTML = html;
  // }

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
})



// const selectedUserChatRoom = $("#selectedUserChatRoom");
// const selectedRoom = $("#selectedRoom");

// selectedRoom.on("click", function () {
//   selectedUserChatRoom.show()
// })

