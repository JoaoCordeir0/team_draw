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

socket.on('error', function(msg) {
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
        icon: 'error',
        title: msg
    })
})

socket.on('renderizePlayer', function(players) {
    $('.listPlayers').html('')

    let playerList = ''

    players.forEach(item => {
        playerList += '<li><span id="iconPlayer" style="background-color:' + item.color_player + ';"></span> ' + item.name_player + '</li>'
    });

    playerList += '<p>Total: ' + players.length + '</p>'

    $('.listPlayers').html('<ul>' + playerList + '</ul>')

    if (players.length >= 4) {
        $('#btnSortition').show()
    }
})

socket.on('resultSortition', function(data) {
    let resultSortition = ''

    for (let c = 1; c <= data.qtdTeam; c++) {
        resultSortition += '<ul> <b>Equipe ' + c + '</b>'
        data.sortitions.filter(team => team.team_player === c).forEach(item => {
            resultSortition += '<li>' + item.name_player + '</li>'
        });
        resultSortition += '</ul>'
    }

    $(".resultSortition").html(resultSortition)

    $('#resultSortition').show()
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

$('#name_player').on('keyup', function() {
    if ($('#name_player').val().length > 0) {
        $('#name_player').attr('aria-invalid', 'false')
    } else {
        $('#name_player').attr('aria-invalid', 'true')
    }

})

$('#formAddPlayer').submit(function(event) {
    event.preventDefault();

    let name_player = $('#name_player').val()

    if (name_player.length) {
        socket.emit('newPlayer', {
            name_player: name_player[0].toUpperCase() + name_player.substring(1),
            color_player: generateColor(),
        })
    }

    $('#name_player').val('')
});

$('#initSortition').click(function(event) {
    socket.emit('InitSortition', $('#qtdPerTeam').val())
})