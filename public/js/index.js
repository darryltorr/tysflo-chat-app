var socket = io();

   socket.on('connect', function () {
       console.log('connected to server');

       
   });

   socket.on('disconnect', function () {
       console.log('Disconnected to server');
   });

   socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
      text: message.text,
      from: message.from,
      createdAt: formattedTime
    });
  
    jQuery('#messages').append(html);
  });

   

   jQuery('#message-form').on('submit', function (e) {
       e.preventDefault();

       socket.emit('createMessage', {
           from: 'user',
           text: jQuery('[name=message]').val()
       }, function (){

       });
   });