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

    client.on('send-offer', ({toClientId, offer}) => {
        io.to(toClientId).emit('receive-offer', {
            offer,
            fromClientId: client.id
        })
    })

    client.on('send-answer', ({toClientId, answer}) => {
        io.to(toClientId).emit('receive-answer', {
            answer,
            fromClientId: client.id
        })
    })

    client.on('send-candidate', ({toClientId, candidate}) => {
        io.to(toClientId).emit('receive-candidate', {
            candidate,
            fromClientId: client.id
        })
    })

    client.on('disconnect', () => {
        client.broadcast.emit('client-disconnect', {
            clientId: client.id
        })
    })
})

server.listen(port, () =>
    console.log(`Server start at localhost:${port}`)
)