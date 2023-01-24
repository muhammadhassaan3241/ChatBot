
const socket = io(); // Always place socket on top otherwise it won't initialize

socket.on("connect", () => {
  console.log('message client side');
});

// import SocketIOManager from "../../app";
function socketEmitter(nameSpace, data) {
  //event emitter function
  socket.emit(nameSpace, data);
}

// ---Form Start--- \\
const form = $("#chatForm"); // form
const textarea = $("#chat"); // message
const userId = $("#user-id"); // user id
// ---Form End--- \\

form.submit(async (e) => {
  e.preventDefault(); // prevent form from submit
  let data = {
    text: textarea.val(),
    id: userId.val(),
    socket: socket.id,
    room: Math.floor(Math.random() * 10000) + Date.now(),
  };

  if (textarea.val() !== "") {
    socketEmitter("privateMessage", data); // emitting event
    textarea.val(""); //reseting textarea
  }

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

socket.on("privateMessage", async (data) => {
  data.map((m) => {
    var html = ""; // displaying your friend's message
    var date = new Date.now();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours %= 12;
    hours = hours || 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    const time = `${hours}:${minutes} ${ampm}`;

    html += `<div class="message">         
           <img class="avatar-md" src="/img/avatars/avatar-female-5.jpg" data-toggle="tooltip"
             data-placement="top" title="Keith" alt="avatar" />
           <div class="text-main">
             <div class="text-group">
               <div class="text">
                 <p>${m.message}</p>
               </div>
             </div>
             <span>${time}</span>
           </div>
         </div>`;

    document.getElementById("chatbox").innerHTML += html;
  });
});

function changeChatView(messages, myID, time) {
  var messagess = messages;
  html = "";

  messagess.map((msg) => {
    console.log(msg);
    if (myID === msg.user) {
      html += `<div class="message me">
      <div class="text-main">
      <div class="text-group me">
      <div class="text me">
      <p>${msg}</p>
      </div>
      </div>
      <span>${time}</span>
      </div>
      </div>`;
    } else {
      html += `<div class="message">         
           <img class="avatar-md" src="/img/avatars/avatar-female-5.jpg" data-toggle="tooltip"
             data-placement="top" title="Keith" alt="avatar" />
           <div class="text-main">
             <div class="text-group">
               <div class="text">
                 <p>${msg.content}</p>
               </div>
             </div>
             <span>${msg.createdAt}</span>
           </div>
         </div>`;
    }
  });
  document.getElementById("chatbox").innerHTML = html;
}


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
      senderId: senderId.val(),
      senderName: senderName.val(),
      senderImage: senderImage.val(),
      senderLocation: senderLocation.val(),
    },
    receiver: {
      receiverId: receiverId.val(),
      receiverName: receiverName.val(),
      receiverImage: receiverImage.val(),
      receiverLocation: receiverLocation.val(),
    },
    socket: socket.id,
    message: `${senderName.val()} sent you a friend request`,
    room: Math.floor(Math.random() * 10000) + Date.now(),
    time: Date.now(),


  }
  // console.log(request);

  sendButton.click(function () {
    socketEmitter('sentNotification', request)
    alert('Your request has been sent')
    return false;
  })
})

socket.on('newFriendRequest', (data) => {
  console.log(data);
})