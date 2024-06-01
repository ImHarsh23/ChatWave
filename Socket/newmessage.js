module.exports = function(socket, userMap, io){
    function getMessageTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;
        return formattedTime;
    }

    socket.on("newmessage", ({message, socketId})=>{
        io.emit("messagereceived", {message, name:userMap[socketId], socketId, time:getMessageTime()});
    })
}