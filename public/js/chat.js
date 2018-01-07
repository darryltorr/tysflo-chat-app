var socket = io();

function scrollToBottom () {
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child')
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
  
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
      messages.scrollTop(scrollHeight);
    }
  }

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
    scrollToBottom();

  });

   

   jQuery('#message-form').on('submit', function (e) {
       e.preventDefault();

       socket.emit('createMessage', {
           from: 'user',
           text: jQuery('[name=message]').val()
       }, function (){

       });
   });