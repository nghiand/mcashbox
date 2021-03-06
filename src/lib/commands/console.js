var command = {
  command: 'console',
  description: 'Run a console with contract abstractions and commands available',
  builder: {},
  run: function (options, done) {
    process.env.CURRENT = 'console';
    const Config = require("../../components/Config");
    const Console = require("../console");
    const Environment = require("../environment");
    const TruffleError = require("@truffle/error");

    const McashWrap = require("../../components/McashWrap");
    const logErrorAndExit = require('../../components/McashWrap').logErrorAndExit;

    let config = Config.detect(options);

    if (!config.network && config.networks.development) {
      config.network = "development";
    }
    // init
    try {
      McashWrap(config.networks[config.network], {
        verify: true,
        log: options.log
      })
    } catch(err) {
      logErrorAndExit(console, err.message)
    }

    // This require a smell?
    const commands = require("./index");
    let excluded = [
      "console",
      "init",
      "watch",
      "serve"
    ];

    let available_commands = Object.keys(commands).filter(function (name) {
      return excluded.indexOf(name) === -1;
    });

    let console_commands = {};
    available_commands.forEach(function(name) {
      console_commands[name] = commands[name];
    });

    Environment.detect(config, function(err) {
      if (err) return done(err);

      let c = new Console(console_commands, config.with({
        noAliases: true
      }));
      c.start(done);
    });
  }
};

module.exports = command;
