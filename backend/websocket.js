import { io } from "./http.js";

let players = [];

io.on('connection', socket => {

    console.log('New connection => ' + socket.id)

    socket.on('newPlayer', data => {
        const playerInPlayers = players.find(pl => pl.socket_id === socket.id && pl.name_player === data.name_player)

        let number_player
        let generatedNumber = false
        do {
            number_player = Math.floor(Math.random() * 100)
            const numberInPlayers = players.find(pl => pl.socket_id === socket.id && pl.number_player === number_player)

            if (!numberInPlayers) {
                generatedNumber = true
            }
        } while (!generatedNumber)

        if (playerInPlayers) {
            socket.emit('playerExists', data.name_player)
        } else {
            players.push({
                socket_id: socket.id,
                number_player: number_player,
                name_player: data.name_player,
                color_player: data.color_player
            })

            socket.emit('renderizePlayer', players)
        }

        console.clear()
        console.log(players)
    })

    socket.on("disconnect", () => {
        [...players].forEach(item => {
            players = players.filter(obj => obj.socket_id !== socket.id);
        });
    });
})