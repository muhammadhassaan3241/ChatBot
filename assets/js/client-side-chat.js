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
    // let roomInfo = {
    //   roomId: split[0],
    //   friendId: split[1],
    //   socketId: split[2],
    //   mySocket: split[3],
    //   myId: split[4],
    // }
    console.log("before");
    const roomId = split[0];
    const friendId = split[1];
    const socketId = split[2];
    const mySocket = split[3];
    const myId = split[4];
    $.ajax({
      url: `http://localhost:8080/get-room-details?roomId=${roomId}&friendId=${friendId}&myId=${myId}`,
      type: 'GET',
      success: function (response) {
        console.log("The request was successful!");
        const friendData = response.roomDetails;
        friendData.map((a) => {
          console.log(a.friend);
        })
        var html = "";
        friendData.map((a) => {
          a.friend.map((b) => {
            html += ` <div class="col-md-12">
            <div class="inside">
                <a href="#"><img class="avatar-md" src="${b.image}" data-toggle="tooltip"
                        data-placement="top" alt="avatar"></a>
                <div class="status">
                    <i class="material-icons online">fiber_manual_record</i>
                </div>
                <div class="data">
                    <h5><a href="#">${b.firstName} ${b.lastName}</a></h5>
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
        })
        document.getElementById("chatTopBar").innerHTML = html;
      },
      error: function (error) {
        console.log("There was an error with the request.");
        console.log("after");
        console.log(error);
      }
    });
  });

  socket.on("roomId", (data) => {
    console.log("2");
    console.log(data);

    return
    let userInfo = data;
    var html = "";
    userInfo.map((u) => {
      html += ` <div class="col-md-12">
      <div class="inside">
          <a href="#"><img class="avatar-md" src="${u.image}" data-toggle="tooltip"
                  data-placement="top" alt="avatar"></a>
          <div class="status">
              <i class="material-icons online">fiber_manual_record</i>
          </div>
          <div class="data">
              <h5><a href="#">${u.firstName} ${u.lastName}</a></h5>
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

    // // // ---Form Start--- \\
    const form = $("#chatForm"); // form
    const textarea = $("#chatTextArea"); // message
    const userId = $("#user-id"); // user id
    // ---Form End--- \\
    form.submit(async (e) => {
      e.preventDefault(); // prevent form from submit
      let data = {
        text: textarea.val(),
        sender: userId.val(),
        receiver: userInfo.map((u) => { return u.id }),
        roomId: userInfo.map((u) => { return u.room }),
      };

      if (textarea.val() !== "") {
        socketEmitter("privateMessage", data); // emitting event
        textarea.val(""); //reseting textarea
      }

      return
      var html = ""; // displaying your message
      html += `<div class="message me">
             <div class="text-main">
             <div class="text-group me">
             <div class="text me">
             <p>${data.text}</p>
             </div>
             </div>
             <span></span>
             </div>
             </div>`;

      document.getElementById("chatbox").innerHTML += html;
      return false;
    });
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

