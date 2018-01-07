var expect = require('expect');


var {generateMeassage} = require('./message');

describe('generateMessage' , () =>{
    it('should generate correct message object', () =>{
        var from = 'Jen';
        var text = ' Some Message';
        var message = generateMeassage(from ,text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from,text});
    });
});