let socket;

document.querySelector(".login-btn").addEventListener("click",async (ev)=>{
    ev.preventDefault();
    const name = document.querySelector(".name").value;
    if(name.trim() != ""){
        document.querySelector(".login").style.display="none";
        document.querySelector(".chat-app").classList.remove("chat-app");
        socket= io();

        socket.on('connect', () => {
            socket.emit("newuser", {socketId: socket.id, name:name});
        });
    
        socket.on("userAdded", ({msg, name, client})=>{
            document.querySelector(".users-list").innerHTML = "";
            let div = document.createElement("div");
            
            // client.forEach(element => {
            //     let user = `<div class="user">
            //                     <div class="user-avatar">
            //                         <img src=${element.image} alt="User Avatar">
            //                     </div>
            //                     <div class="user-info">
            //                         <h4>${element.name}</h4>
            //                         <p class="user-status online">Online</p>
            //                     </div>
            //                 </div>`;
            //     div.innerHTML += user;
            // });

            client.forEach(element => {
                let user = `<div class="user">
                                <div class="user-avatar">
                                    <img src=${element.image} alt="User Avatar">
                                </div>
                                <div class="user-info">
                                    <div>
                                        <h4>${element.name}</h4>
                                        <p class="user-status online">Online</p>
                                    </div>
                                    ${element.id == socket.id ? "<div>🟣</div>" : ""}
                                </div>
                            </div>`;
                div.innerHTML += user;
            });

            console.log(div);
            document.querySelector(".users-list").innerHTML = div.innerHTML;
            document.querySelector(".online-count").innerHTML = "&nbsp" + client.length;
        })
    
        socket.on("clientUpdate", (updatedClient)=>{
            console.log(updatedClient);
            document.querySelector(".users-list").innerHTML = "";
            let div = document.createElement("div");

            updatedClient.forEach(element => {
                let user = `<div class="user">
                                <div class="user-avatar">
                                    <img src=${element.image} alt="User Avatar">
                                </div>
                                <div class="user-info">
                                    <h4>${element.name}</h4>
                                    <p class="user-status online">Online</p>
                                </div>
                            </div>`;
                div.innerHTML += user;
            });

            document.querySelector(".users-list").innerHTML = div.innerHTML;
            document.querySelector(".online-count").innerHTML = updatedClient.length;
        })
    
        socket.on("messagereceived", ({message, name, socketId, time})=>{
            console.log("Time is:", time);
            document.querySelector(".send-message-value").value = "";
            let messageArea = document.querySelector(".messages");
            let chatContainer = document.createElement("div");
            let chat = document.createElement("div");
            chat.classList.add("chat");
    
            if(socket.id == socketId){
                chatContainer.innerHTML = `<div class="chat">
                                                <div class="chat-message">${message}</div>
                                                <div class="time">
                                                    <h4 class="chat-time">${time}</h4>     
                                                </div>
                                            </div>`;
                chatContainer.classList.add("right");
            }
            else{
                chatContainer.innerHTML = `<div class="chat">
                                                <div class="chat-header">
                                                    <h4 class="user-name">${name}</h4>
                                                </div>
                                                <div class="chat-message">${message}</div>
                                                <div class="time">
                                                    <h4 class="chat-time">${time}</h4>     
                                                </div>
                                            </div>`;
                chatContainer.classList.add("left");
            }
            messageArea.append(chatContainer);
        })
    }
})

document.querySelector(".send-message").addEventListener("submit",(e)=>{
    e.preventDefault();
    const message = document.querySelector(".send-message-value").value;
    if(message.trim() != ""){
        socket.emit("newmessage",{
            message:message,
            socketId:socket.id
        }) 
    }
})