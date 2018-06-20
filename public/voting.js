
$(document).ready(function () {
    var socket = io();
    
    socket.on('updates', function(account) {
        $('#' + account.id + ' .likes').text(account.likes);
    });
    socket.on('movies', function(account) {
	    $(".movies").append("<li class='account' id='" + account.id + "'>" +
                "<span class='position'>" + ($( "li.account" ).length+1) + "</span>" +
                "<div class='vote'>" +
                    "<div class='btnVote'>" +
                        "<span class='btnLike'><i class='fa fa-plus fa-2x'></i></span>" +
                        "<span class='numVotes likes'>" + account.likes + "</span>" +
                    "</div>" +
                "</div>" +
                "<span class='title'>" + account.title + "</span></li>");
	});

    $('.movies').on('click', 'span.btnLike', function (e) {
        var accountId = $(this).parent('div').parent('div').parent('li')[0].id;
        $.ajax({
            type: 'PUT',
            url: '/account/like/' + accountId
        });
    });
    $('#form').on('submit', function (event) {
        event.preventDefault();
        var input = $('#title');
        var t = input.val();
        if(!t || t.trim().length === 0) {
            alert('Nom requis');
            return false;
        } else {
            $.ajax({
                type: 'POST',
                url: '/account',
                data: {
                    title: t
                },
                success: function(data) {
                    input.val('');
                }
            });
        }
    });
});
