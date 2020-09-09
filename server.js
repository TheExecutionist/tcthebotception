const Eris = require('eris');
const bot = new Eris(process.env.bot_token);   
var prefix = process.env.prefix
var owner_id = process.env.owner_discord_id
var bt_ids = []
 
bot.on('ready', () => {                             
    console.log('Bot ready!');    
    var canLogToDiscord = true
});
 
function unauth(level_required) { return '```patch\n- ERROR: INSUFFICIENT PERMISSION LEVEL\n- PERMISSION LEVEL ' + String(level_required) + ' IS REQUIRED```' }
function arg_error(required, submitted) { return '```patch\n- ERROR: INSUFFICIENT ARGUMENTS SUPPLIED\n- ' + String(required) + ' ARGUMENTS ARE REQUIRED```' }
 
function parse(input) {
  let out =  input.split(" "); 
  return out
}
 
bot.on('messageCreate', (msg) => {
  try {
    if (msg.content.startsWith(prefix + "select ")) {
      let sendError = true
      let lookfor = msg.content.split(prefix + "select ").pop()
      entities.forEach(function(element) {
        if (typeof element.sendMessage == "function" && element.name == lookfor) {
          sendError = false
          bot.createMessage(msg.channel.id, String(element.name + '\nTank: ' + element.label + '\nId: ' + element.id + '\nAlpha: ' + element.alpha + '\nColor: ' + element.blend.amount + '\nMax Health: '  + element.health.max + '\nCurrent Health: '  + element.health.amount + '\nIs Invulnerable: ' + element.invuln + '\nScore: ' + element.photo.score + '\nLevel: ' + element.skill.level));
        }
      })
      if (sendError) {
        bot.createMessage(msg.channel.id, "Was unable to find an entity by that name");
      }
    }
    if (msg.content == prefix + 'ping') {
      bot.createMessage(msg.channel.id, 'Pong!\n' + "\nRunning on glitch: " + process.env.ISONGLITCH + "\nDirectory: " + __dirname + "\nFile name: " + __filename);
    }
    if (msg.content.includes(prefix + 'help')) {
        bot.createMessage(msg.channel.id, '***COMMANDS*** \nPrefix: ' + prefix + '\n(No space after prefix when running command) \n \n**ping**  -  tells u if the server is running\n**kill** *<id>*  -  Kills a player (Authorization required)\n**broadcast** *<message>*  -  broadcasts a message (Authorization required)\n**query** *<internalname>*  -  returns some data about a tank (must use internal name)\n**select** *<name>*  -  returns some data about in-game users\n**players**  -  list in-game players\n**stat** *<id> <path to stat> <new value>*  -  modifies a stat (Authorization required)\n**define** *<id> <tank>*  -  Defines someone as a tank (Authorization required)');
    }
    if (msg.content.startsWith(prefix + 'kill ')) {
      if (msg.author.id == owner_id) {
        let sendError = true
        let lookfor = msg.content.split(prefix + "kill ").pop()
        console.log(lookfor)
        entities.forEach(function(element) {
          if (element.id == lookfor) {
            sendError = false
            element.destroy()
            bot.createMessage(msg.channel.id, "User killed.");
          }
        })
        if (sendError) {
          bot.createMessage(msg.channel.id, "Was unable to find an entity by the id: " + lookfor);
        }
      } else {
        bot.createMessage(msg.channel.id, unauth(3));
      }
    }
    if (msg.content.startsWith(prefix + 'eval')) {
      if (msg.author.id == owner_id) {
        var command = msg.content.split(prefix + "eval ").pop()
        console.log('new eval: ', command)
        var output = eval(command)
        bot.createMessage(msg.channel.id, "Evaluated. Output: " + output);
      } else {
        console.log("Unauthorized user", msg.author.username, "tried to eval")
        bot.createMessage(msg.channel.id, unauth(3));
      }
    }
    if (msg.content.startsWith(prefix + 'broadcast')) {
        if (bt_ids.includes(msg.author.id) || msg.author.id == owner_id) {
        sockets.broadcast(msg.content.split(prefix + "broadcast").pop() + " - " + msg.author.username)
        bot.createMessage(msg.channel.id, 'Message Broadcast!');
      } else {
        console.log("Unauthorized user", msg.author.username, "tried to broadcast")
        bot.createMessage(msg.channel.id, unauth(2));
      }
    }
    if (msg.content.startsWith(prefix + 'query')) {
        let output = ''
        var query = msg.content.split(prefix + "query ").pop()
        try {
          var botreturn = eval('Class.' + query);
          for (var key in botreturn) {
            if (output.length > 500) {console.log(output.length); bot.createMessage(msg.channel.id, output); output = ''}
            output += String(key) + ': ' + eval('Class.' + query + '.' + String(key)) + '\n'
            var returned = typeof eval('Class.' + query + '.' + String(key))
            if (returned == 'object') {
              for (var key2 in eval('Class.' + query + '.' + String(key))) {
                  if (key2 != 'remove') {
                    try {
                      output += "^ " + String(key2) + ': ' + eval('Class.' + query + '.' + String(key) + '[' + String(key2) + ']') + '\n'
                      var returned = typeof eval('Class.' + query + '.' + String(key) + '[' + String(key2) + ']')
                      var returnedobj = eval('Class.' + query + '.' + String(key) + '[' + String(key2) + ']')
                    } catch(err) {
                      output += "^ " + String(key2) + ': ' + eval('Class.' + query + '.' + String(key) + '.' + String(key2)) + '\n'
                      var returned = typeof eval('Class.' + query + '.' + String(key) + '.' + String(key2))
                      var returnedobj = eval('Class.' + query + '.' + String(key) + '.' + String(key2))
                    }
                    if (returned == 'object') {
                      for (var key3 in returnedobj) {
                        if (key3 != 'remove') {
                          try {
                            output += "^ ^ " + String(key3) + ': ' + eval('Class.' + query + '.' + String(key) + '[' + String(key2) + ']' + '[' + String(key3) + ']') + '\n'
                          } catch(err) {
                            try {
                              output += "^ ^ " + String(key3) + ': ' + eval('Class.' + query + '.' + String(key) + '[' + String(key2) + ']' + '.' + String(key3)) + '\n'
                            } catch(err) {
                              try {
                                output += "^ ^ " + String(key3) + ': ' + eval('Class.' + query + '.' + String(key) + '.' + String(key2) + '[' + String(key3) + ']') + '\n'
                              } catch(err) {
                                output += "^ ^ " + String(key3) + ': ' + eval('Class.' + query + '.' + String(key) + '.' + String(key2) + '.' + String(key3)) + '\n'
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          } catch(err) {
            bot.createMessage(msg.channel.id, String(err));
          }
        bot.createMessage(msg.channel.id, output);
      }
  if (msg.content == prefix + 'players') {
    let output = '`'
    entities.forEach(function(element) {
    if (element.name != '') {
        output += String(element.name + '  -  ' + element.id + '\n')
    }}) 
    output += '`'
    bot.createMessage(msg.channel.id, output)}
  if (msg.content.startsWith(prefix + 'stat ')) {
    if (bt_ids.includes(msg.author.id) || msg.author.id == owner_id) {
    let s_command = parse(msg.content)
    let s_lookForId = s_command[1]
    let s_statpath = s_command[2]
    let s_newvalueTemp = s_command.slice(3)
    let s_newvalue = ''
    s_newvalueTemp.forEach(function(element) {
      s_newvalue += element + ' '
    });
    console.log("New stat command: ", s_lookForId, s_statpath, s_newvalue, "Sent by:", msg.author.username, '(' + msg.author.id + ')')
    if (s_newvalue != '') { 
    entities.forEach(function(element) {
    if (element.id == s_lookForId && s_lookForId != "ALL") {
      try {
        eval('element' + s_statpath + ' = ' + s_newvalue)
      } catch(err) {
        eval('element' + s_statpath + ' = "' + s_newvalue + '"')
      }
      element.sendMessage("your stat " + s_statpath + ' has been changed to ' + s_newvalue)
      bot.createMessage(msg.channel.id, "Value set to " + String(eval('element' + s_statpath)));
    }})
  if (s_lookForId == "ALL" && msg.author.id == owner_id) {
    entities.forEach(function(element) {
      try {
        eval('element' + s_statpath + ' = ' + s_newvalue)
      } catch(err) {
        eval('element' + s_statpath + ' = "' + s_newvalue + '"')
      }
      element.sendMessage("your stat " + s_statpath + ' has been changed to ' + s_newvalue)
    })
  bot.createMessage(msg.channel.id, "Values set to " + s_newvalue);
  } else {
    if (s_lookForId == 'ALL') bot.createMessage(msg.channel.id, unauth(3))
  }} else {
    bot.createMessage(msg.channel.id, arg_error(3));
  }
  } else {
    bot.createMessage(msg.channel.id, unauth(2));
  }}
  if (msg.content.startsWith(prefix + 'define ')) {
    let printerror = true
    let command = parse(msg.content)
    let inputid = command[1]
    let inputclass = command[2]
    if (bt_ids.includes(msg.author.id)) {
    if (msg.author.id == owner_id) {
    if (Class[inputclass] != undefined) {
      entities.filter(r => r.id == inputid)[0].define(Class[inputclass])
      printerror = false
      bot.createMessage(msg.channel.id, 'Defined user as Class.' + inputclass);
    } else {
      bot.createMessage(msg.channel.id, inputclass + ' is not a valid tank');
      printerror = false
    }
    if (printerror) {
      bot.createMessage(msg.channel.id, "Couldn't find any users by the id: " + inputid);
    }
    } else {
      bot.createMessage(msg.channel.id, unauth(3));
    }
  } else {
    bot.createMessage(msg.channel.id, unauth(2));
  }}
} catch(err) { // log the error in chat
  bot.createMessage(msg.channel.id, String(err));
}});
 
bot.editStatus('online', {
  name: prefix + 'help for commands!',
  type: 0
});
 
bot.connect();
