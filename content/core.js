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

    var getTestCaseResultContent = function(testcase, no_summary){
        var title    = IDE_UTIL.getTestCaseTitle(testcase)
          , tests    = _.map(IDE_UTIL.collectTestCaseCommands(testcase), IDE_UTIL.parseTestCase)
          , commands = _.filter(tests, function(x){ return(x.type === 'command'); })
          , summary  = SIPR.formatter.summary({
                title: 'Test Case Summary'
              , result: getCommandsTotalResult(commands)
              , done:      _.filter(commands, _.partial(resultEquals, 'done')).length
              , failed:    _.filter(commands, _.partial(resultEquals, 'failed')).length
              , undefined: _.filter(commands, _.partial(resultEquals, 'undefined')).length
              , total: commands.length})
          , data     = {
                title:  title
              , tests:  groupTestCase(tests)
              , summary: (no_summary === undefined) ? summary : ""}
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
          , contents = _.map(suite, function(test){
                return(getTestCaseResultContent(test.content, false)); })
          , commands = _.chain(suite).reduce(function(res, test){
                return(res.concat(test.content.commands));
            }, []).filter(function(x){ return(x.type === 'command'); }).value()
          , summary  = SIPR.formatter.summary({
                title:      'Test Suite Summary'
              , result:     getCommandsTotalResult(commands)
              , total:      commands.length
              , done:       _.filter(commands, _.partial(resultEquals, 'done')).length
              , failed:     _.filter(commands, _.partial(resultEquals, 'failed')).length
              , undefined:  _.filter(commands, _.partial(resultEquals, 'undefined')).length })
          , data     = { suite: contents
                       , summary: summary }
          ;

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
