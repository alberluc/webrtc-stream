const server = require('http').createServer()
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
})
const port = 3000

io.on('connection', async client => {

    const sockets = await io.fetchSockets();

    client.emit('init', {
        clientsIds: sockets.map(socket => socket.id).filter(socketId => socketId !== client.id)
    })

    client.broadcast.emit("client-join", {
        clientId: client.id,
    })

    client.on('send-offer', description => {
        client.broadcast.emit('receive-offer', {
            description,
            fromClientId: client.id
        })
    })

    client.on('send-answer', ({toClientId, description}) => {
        io.to(toClientId).emit('receive-answer', {
            description,
            fromClientId: client.id
        })
    })

    client.on('send-candidate', ({toClientId, candidate}) => {
        io.to(toClientId).emit('receive-candidate', {
            candidate,
            fromClientId: client.id
        })
    })
})

server.listen(port, () =>
    console.log(`Server start at localhost:${port}`)
)