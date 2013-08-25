(function(window, undefined){
    var self = {};

    self.title    = "Selenium IDE: Pretty Report";
    self.css_file = "resource://si_prettyreport/main.css";
    self.js_file  = "resource://si_prettyreport/main.js";

    var and_result = function(r1, r2){
        return((r1 === 'undefined' || r1 === 'failed') ? r1 : r2);
    };

    var get_commands_total_result = function(commands){
        if(_.every(commands, _.partial(result_equals, 'done'))){
            return('done');
        } else if(_.every(commands, _.partial(result_equals, 'undefined'))){
            return('undefined');
        } else {
            return('failed');
        }
    };

    var group_testcase = function(testcase){
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
            return(_.extend(test, { result: get_commands_total_result(test.commands) }));
        });

        return(result);
    };

    var result_equals = function(result, command){
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
                       , result: get_commands_total_result(commands)
                       , tests:  group_testcase(tests)
                       , does_show_summary: (does_show_summary === undefined) ? true : false
                       , count:  {
                           total:     commands.length
                         , done:      _.filter(commands, _.partial(result_equals, 'done')).length
                         , failed:    _.filter(commands, _.partial(result_equals, 'failed')).length
                         , undefined: _.filter(commands, _.partial(result_equals, 'undefined')).length
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
              , style:  ADDON_UTIL.read_file(self.css_file)
              , script: ADDON_UTIL.read_file(self.js_file)
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
          , done:  _.filter(commands, _.partial(result_equals, 'done')).length
          , failed:  _.filter(commands, _.partial(result_equals, 'failed')).length
          , undefined:  _.filter(commands, _.partial(result_equals, 'undefined')).length
        };

        IDE_UTIL.writeFile(
            IDE_UTIL.openFileDialog("title")
          , SIPR.formatter.html({
                title: self.title
              , style:  ADDON_UTIL.read_file(self.css_file)
              , script: ADDON_UTIL.read_file(self.js_file)
              , body:   SIPR.formatter.testsuite(data)
            })
        );
    };

    if(!window.SIPR){
        window.SIPR = self;
    }
}(window));
