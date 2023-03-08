import { io } from "./http.js";

const limitPlayers = 100

let players = []
let sortitions = []

io.on('connection', socket => {

    console.log('New connection => ' + socket.id)

    // Adiciona um novo jogador no sorteio
    socket.on('newPlayer', data => {
        const playerInPlayers = players.find(pl => pl.socket_id === socket.id && pl.name_player === data.name_player)

        let number_player
        do {
            number_player = Math.floor(Math.random() * limitPlayers)
            const numberInPlayers = players.find(pl => pl.socket_id === socket.id && pl.number_player === number_player)

            if (!numberInPlayers) {
                break // Sai do laço
            }
        } while (true)

        if (playerInPlayers) {
            socket.emit('playerExists', data.name_player)
        } else {
            players.push({
                socket_id: socket.id,
                number_player: number_player,
                name_player: data.name_player,
                color_player: data.color_player
            })

            socket.emit('renderizePlayer', players.filter(sckt => sckt.socket_id === socket.id))
        }

        console.clear()
        console.log(players)
    })

    // Realiza o sorteio
    socket.on("InitSortition", qtdPerTeam => {
        const playersInSocket = players.filter(sckt => sckt.socket_id === socket.id);
        let qtdTeam = Math.ceil(playersInSocket.length / qtdPerTeam)

        // Verifica se é possível gerar pelo menos 2 equipes com a quantidae de jogadores informados e a quantidade por equipe
        if ((qtdPerTeam * 2) > playersInSocket.length) {
            socket.emit('error', 'Não é possivél sortear equipes de ' + qtdPerTeam + ' com ' + playersInSocket.length + ' jogadores!')
        } else {
            let index = 0
            for (let c = 1; c <= qtdTeam; c++) {
                for (let i = 1; i <= qtdPerTeam; i++) {
                    if (index < playersInSocket.length) {
                        let number
                        do {
                            number = Math.floor(Math.random() * limitPlayers)

                            if (sortitions.filter(num => num.socket_id === socket.id && num.number_player === number).length == 0) {
                                const playerSortition = playersInSocket.filter(ps => ps.number_player === number)

                                if (playerSortition.length > 0) {

                                    playerSortition.forEach(item => {
                                        sortitions.push({
                                            socket_id: socket.id,
                                            team_player: c,
                                            number_player: item.number_player,
                                            name_player: item.name_player,
                                            color_player: item.color_player,
                                        })
                                    });

                                    break // Sai do laço de busca
                                }
                            }
                        } while (true)
                    }
                    index += 1
                }
            }

            socket.emit('resultSortition', {
                sortitions: [...sortitions].filter(sckt => sckt.socket_id === socket.id),
                qtdTeam: qtdTeam,
            });

            // Deleta o resultado do sorteio
            [...sortitions].forEach(() => {
                sortitions = sortitions.filter(sckt => sckt.socket_id !== socket.id);
            });
        }
    })

    // Detela todos os jogadores que o usuário utilizou quando ele se desconectar do App
    socket.on("disconnect", () => {
        [...players].forEach(item => {
            players = players.filter(sckt => sckt.socket_id !== socket.id);
        });
    });
})