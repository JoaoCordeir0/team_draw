var socket = io('');

// ---------------------------- //
// ---------- Sockets --------- //
socket.on('playerExists', function(namePlayer) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: 'info',
        title: 'O player ' + namePlayer + ' já existe!'
    })
})

socket.on('renderizePlayer', function(players) {
    $(".listPlayers").html('')

    let playerList = ''

    players.forEach(item => {
        playerList += '<li><span id="iconPlayer" style="background-color:' + item.color_player + ';"></span> ' + item.name_player[0].toUpperCase() + item.name_player.substring(1) + '</li>'
    });

    playerList += '<p>Total: ' + players.length + '</p>'

    $(".listPlayers").html('<ul>' + playerList + '</ul>')
})


// ---------------------------- //
// ---------- Funções --------- //
const generateColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

$("#name_player").on("keyup", function() {
    if ($("#name_player").val().length > 0) {
        $("#name_player").attr('aria-invalid', 'false')
    } else {
        $("#name_player").attr('aria-invalid', 'true')
    }

})

$("#formAddPlayer").submit(function(event) {
    event.preventDefault();

    let name_player = $('#name_player').val()

    if (name_player.length) {
        socket.emit('newPlayer', {
            name_player: name_player,
            color_player: generateColor(),
        })
    }

    $("#name_player").val('')
});