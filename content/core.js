(function(window, undefined){
    var self = {};

    self.title    = "Selenium IDE: Pretty Report";
    self.css_file = "resource://si_prettyreport/main.css";
    self.js_file  = "resource://si_prettyreport/main.js";

    var getCommandsTotalResult = function(commands){
        if(_.every(commands, _.partial(resultEquals, 'done'))){
            return('done');
        } else if(_.every(commands, _.partial(resultEquals, 'undefined'))){
            return('undefined');
        } else {
            return('failed');
        }
    };

    var groupTestCase = function(testcase){
        var init_val = {title: '(no title)', result: 'done', commands: []}
          , tmp      = _.clone(init_val)
          , result   = []
          ;

        // grouping
        _.each(testcase, function(cmd){
            if(cmd.type === 'comment'){
                if(tmp.commands.length === 0){
                    tmp.title = cmd.value;
                } else {
                    result.push(tmp);
                    tmp = _.extend(_.clone(init_val), {title: cmd.value, commands: []});
                }
            } else {
                tmp.commands.push(cmd);
            }
        });
        if(tmp.commands.length !== 0){ result.push(tmp); }

        // add result
        result = _.map(result, function(test){
            return(_.extend(test, { result: getCommandsTotalResult(test.commands) }));
        });

        return(result);
    };

    var resultEquals = function(result, command){
        return(command.result === result);
    };

    self.foo = function(){
        var suite = window.editor.app.getTestSuite();
        _.each(suite.tests, function(test){
            alert(test.getTitle());
        });
    };

    var getTestCaseResultContent = function(testcase, does_show_summary){
        var title    = IDE_UTIL.getTestCaseTitle(testcase)
          , tests    = _.map(IDE_UTIL.collectTestCaseCommands(testcase), IDE_UTIL.parseTestCase)
          , commands = _.filter(tests, function(x){ return(x.type === 'command'); })
          , data     = { title:  title
                       , result: getCommandsTotalResult(commands)
                       , tests:  groupTestCase(tests)
                       , does_show_summary: (does_show_summary === undefined) ? true : false
                       , count:  {
                           total:     commands.length
                         , done:      _.filter(commands, _.partial(resultEquals, 'done')).length
                         , failed:    _.filter(commands, _.partial(resultEquals, 'failed')).length
                         , undefined: _.filter(commands, _.partial(resultEquals, 'undefined')).length
                         }
                       }
          ;

        return(SIPR.formatter.testcase(data));
    };

    self.exportTestCaseResults = function(){
        IDE_UTIL.writeFile(
            IDE_UTIL.openFileDialog("title")
          , SIPR.formatter.html({
                title:  self.title
              , style:  ADDON_UTIL.readFile(self.css_file)
              , script: ADDON_UTIL.readFile(self.js_file)
              , body:   getTestCaseResultContent(IDE_UTIL.getTestCase())
            })
        );
    };

    self.exportTestSuiteResult = function(){
        var suite    = IDE_UTIL.getTestSuite()
          , contents = _.map(suite, function(test){ return(getTestCaseResultContent(test.content, false)); })
          , data     = { suite: contents
                       , result: 'foo'
                       , count: {
                           totla: 0
                         , done: 0
                         , failed: 0
                         , undefined: 0
                         }
                       }
          ;

        var commands = _.chain(suite).reduce(function(res, test){
            return(res.concat(test.content.commands));
        }, []).filter(function(x){ return(x.type === 'command'); }).value();

        data.result = get_commands_total_result(commands);
        data.count = {
            total: commands.length
          , done:  _.filter(commands, _.partial(resultEquals, 'done')).length
          , failed:  _.filter(commands, _.partial(resultEquals, 'failed')).length
          , undefined:  _.filter(commands, _.partial(resultEquals, 'undefined')).length
        };

        IDE_UTIL.writeFile(
            IDE_UTIL.openFileDialog("title")
          , SIPR.formatter.html({
                title: self.title
              , style:  ADDON_UTIL.readFile(self.css_file)
              , script: ADDON_UTIL.readFile(self.js_file)
              , body:   SIPR.formatter.testsuite(data)
            })
        );
    };

    if(!window.SIPR){
        window.SIPR = self;
    }
}(window));
