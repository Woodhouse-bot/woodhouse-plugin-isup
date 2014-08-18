http = require('http');

module.exports = function() {

    this.name = 'isup';
    this.displayname = 'Is It Up?';
    this.description = 'Ask woodhouse to check if a website is up';

    this.init = function(){
        var self = this;
        this.listen('is (.+?) up\\?', function(from, interface, params){
            self.sendMessage('Let me just check...', interface, from);
            var options = {
                hostname: 'isup.me',
                path: '/' + params[0],
                headers: {
                    'user-agent': 'Woodhouse Bot - https://github.com/lukeb-uk/woodhouse'
                }
            },
            data = '';

            var req = http.request(options, function(res) {
                res.on('data', function (response) {
                    data += String(response);
                });

                res.on('end', function() {
                    var reply;

                    if (data.match('It\'s just you')) {
                        reply = params[0] + ' looks UP to me!'
                    } else if (data.match('It\'s not just you!')) {
                        reply = params[0] + ' looks DOWN to me!'
                    } else if (data.match('doesn\'t look like a site on the interwho')) {
                        reply = params[0] + ' doesn\'t seem to be a valid domain'
                    } else {
                        reply = params[0] + ' returned an error'
                    }

                    self.sendMessage(reply, interface, from);
                })
            })

            req.on('error', function(e) {
              console.log('problem with request: ' + e.message);
            });

            req.end();
        })
    }

    return this;
}
