const avatar =[
    "https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-512.png",
    "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png",
    "https://cdn1.iconfinder.com/data/icons/user-pictures/100/female1-512.png",
    "https://cdn0.iconfinder.com/data/icons/user-pictures/100/matureman1-512.png",
    "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/afro_woman_female_person-512.png",
    "https://cdn0.iconfinder.com/data/icons/user-pictures/100/maturewoman-3-512.png",
    "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/boy_person_avatar_kid-512.png"
];

module.exports = function(socket, userMap, io){
    socket.on("disconnect",async()=>{ 
        let updatedClient = [];
        let sockets = await io.fetchSockets();
        sockets.forEach(element =>{
            if(socket.id != element.id){
                updatedClient.push({id:element.id, name:userMap[element.id], image: avatar[Math.floor(Math.random() * avatar.length)]});
            }
        })
        // console.log(updatedClient);
        socket.broadcast.emit("clientUpdate", updatedClient); 
    });
}