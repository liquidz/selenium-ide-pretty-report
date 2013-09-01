(function(window, undefined){

    function PrettyReport(){
        this.title    = "Selenium IDE: Pretty Report";
        this.css_file = "resource://si_prettyreport/main.css";
        this.js_file  = "resource://si_prettyreport/main.js";
    };

    PrettyReport.prototype.getCommandsTotalResult = function(commands){
        if(_.every(commands, _.partial(this.resultEquals, 'done'))){
            return('done');
        } else if(_.every(commands, _.partial(this.resultEquals, 'undefined'))){
            return('undefined');
        } else {
            return('failed');
        }
    };

    PrettyReport.prototype.isHeadingComment = function(s){
        return(s.indexOf('#') === 0);
    };

    PrettyReport.prototype.groupTestCase = function(testcase){
        var init_val = {title: '(no title)', result: 'done', type: 'command', commands: []}
          , heading  = []
          , tmp      = _.clone(init_val)
          , result   = []
          ;

        // grouping
        _.each(testcase, _.bind(function(cmd){
            if(cmd.type === 'comment'){
                if(this.isHeadingComment(cmd.value)){
                    heading = heading.concat({type: 'heading', title: cmd.value})
                } else {
                    if(tmp.commands.length === 0){
                        tmp.title = cmd.value;
                    } else {
                        result.push(tmp);
                        if(_.isEmpty(heading) === false){ result = result.concat(heading); heading = []; }
                        tmp = _.extend(_.clone(init_val), {title: cmd.value, commands: []});
                    }
                }
            } else {
                tmp.commands.push(cmd);
            }
        }, this));
        if(tmp.commands.length !== 0){
            result.push(tmp);
            if(_.isEmpty(heading) === false){ result = result.concat(heading); }
        }

        // add result
        result = _.map(result, _.bind(function(test){
            return(_.extend(test, { result: this.getCommandsTotalResult(test.commands) }));
        }, this));

        return(result);
    };

    PrettyReport.prototype.resultEquals = function(result, command){
        return(command.result === result);
    };

    self.foo = function(){
        var testcases = IDE_UTIL.collectTestCaseCommands(IDE_UTIL.getTestCase());
        var x = _.map(testcases, IDE_UTIL.parseTestCase);
        _.each(x, function(y){
            if(y.rollup){
                _.each(y.rollup.commands, function(c){
                    alert(c.command + ", " + c.target + ", " + c.value);
                });
            }
        });
    };

    PrettyReport.prototype.getTestCaseResultContent = function(testcase, no_summary){
        var title    = IDE_UTIL.getTestCaseTitle(testcase)
          , tests    = _.map(IDE_UTIL.collectTestCaseCommands(testcase), IDE_UTIL.parseTestCase)
          , commands = _.filter(tests, function(x){ return(x.type === 'command'); })
          , summary  = SIPR.template.summary({
                title: 'Test Case Summary'
              , result: this.getCommandsTotalResult(commands)
              , done:      _.filter(commands, _.partial(this.resultEquals, 'done')).length
              , failed:    _.filter(commands, _.partial(this.resultEquals, 'failed')).length
              , undefined: _.filter(commands, _.partial(this.resultEquals, 'undefined')).length
              , total: commands.length})
          , data     = {
                title:  title
              , tests:  this.groupTestCase(tests)
              , summary: (no_summary === undefined) ? summary : ""}
          ;

        // convert heading title
        _.map(data.tests, function(test){
            if(test.type === 'heading' && test.title.match(/^(#+)\s*(.+)$/)){
                test.title = SIPR.template.heading({
                    n: RegExp.$1.length
                  , value: RegExp.$2
                });
            }
            return(test);
        });

        return(SIPR.template.testcase(data));
    };

    PrettyReport.prototype.exportTestCaseResults = function(){
        ADDON.writeFile(
            ADDON.openFileDialog("title")
          , SIPR.template.html({
                title:  this.title
              , style:  ADDON.readFile(this.css_file)
              , script: ADDON.readFile(this.js_file)
              , body:   this.getTestCaseResultContent(IDE_UTIL.getTestCase())
            })
        );
    };

    PrettyReport.prototype.exportTestSuiteResult = function(){
        var suite    = IDE_UTIL.getTestSuite()
          , contents = _.map(suite, _.bind(function(test){
                return(this.getTestCaseResultContent(test.content, false)); }, this))
          , commands = _.chain(suite).reduce(function(res, test){
                return(res.concat(test.content.commands));
            }, []).filter(function(x){ return(x.type === 'command'); }).value()
          , summary  = SIPR.template.summary({
                title:      'Test Suite Summary'
              , result:     this.getCommandsTotalResult(commands)
              , total:      commands.length
              , done:       _.filter(commands, _.partial(this.resultEquals, 'done')).length
              , failed:     _.filter(commands, _.partial(this.resultEquals, 'failed')).length
              , undefined:  _.filter(commands, _.partial(this.resultEquals, 'undefined')).length })
          , data     = { suite: contents
                       , summary: summary }
          ;

        ADDON.writeFile(
            ADDON.openFileDialog("title")
          , SIPR.template.html({
                title: this.title
              , style:  ADDON.readFile(this.css_file)
              , script: ADDON.readFile(this.js_file)
              , body:   SIPR.template.testsuite(data)
            })
        );
    };

    if(!window.SIPR){
        window.SIPR = new PrettyReport();
    }
}(window));
