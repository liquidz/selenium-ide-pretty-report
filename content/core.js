(function(window, undefined){
    var self = {};

    self.title = "Selenium IDE: Pretty Report";

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
        var data = {
            title: IDE_UTIL.getTestCaseTitle()
          , tests: group_testcase(IDE_UTIL.getTestCase().map(IDE_UTIL.parseTestCase))
        };

        alert(
            SIPR.formatter.testcase(data)
            //SIPR.formatter.html("foo")
        );
    };


    self.exportTestCaseResults = function(){
        var file     = IDE_UTIL.openFileDialog("title")
          , title    = IDE_UTIL.getTestCaseTitle()
          , tests    = _.map(IDE_UTIL.getTestCase(), IDE_UTIL.parseTestCase)
          , commands = _.filter(tests, function(x){ return(x.type === 'command'); })
          , data     = { title:  title
                       , result: get_commands_total_result(commands)
                       , tests:  group_testcase(tests)
                       , count:  {
                           total:     commands.length
                         , done:      _.filter(commands, _.partial(result_equals, 'done')).length
                         , failed:    _.filter(commands, _.partial(result_equals, 'failed')).length
                         , undefined: _.filter(commands, _.partial(result_equals, 'undefined')).length
                       }
          }
          ;

        IDE_UTIL.writeFile(
            file
          , SIPR.formatter.html({
                title: title + " - " + self.title
              , body:  SIPR.formatter.testcase(data)
            })
        );
    };

    if(!window.SIPR){
        window.SIPR = self;
    }
}(window));
