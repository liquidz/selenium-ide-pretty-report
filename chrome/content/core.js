(function(window, undefined){

    function PrettyReport(){
        this.title    = "Selenium IDE: Pretty Report";
        this.css_file = "resource://si_prettyreport/main.css";
        this.js_file  = "resource://si_prettyreport/main.js";
    };

    // PRIVATE FUNCTIONS >>>>>
    var resultEquals = function(result, command){
        return(command.result === result);
    };

    var typeEquals = function(type, command){
        return(command.type === type);
    };

    var isHeadingComment = function(command){
        return(command.value.indexOf('#') === 0);
    };
    // <<<<< PRIVATE FUNCTIONS

    // define function
    //  * isDoneCommand
    //  * isFailedCommand
    //  * isUndefinedCommand
    _.each(['Done', 'Failed', 'Undefined'], function(v){
        var name = "is" + v + "Command";
        PrettyReport.prototype[name] = _.partial(resultEquals, v.toLowerCase());
    });

    PrettyReport.prototype.isCommentCommand = _.partial(typeEquals, 'comment');

    PrettyReport.prototype.isHeadingCommand = function(command){
        return(_.every([PrettyReport.prototype.isCommentCommand, isHeadingComment], function(f){
            return(f(command));
        }));
    };

    PrettyReport.prototype.getCommandsTotalResult = function(commands){
        if(_.every(commands, this.isDoneCommand)){
            return('done');
        } else if(_.every(commands, this.isUndefinedCommand)){
            return('undefined');
        } else {
            return('failed');
        }
    };


    PrettyReport.prototype.groupTestCase = function(testcase){
        var init_val = {title: '(no title)', result: 'done', type: 'command', commands: []}
          , tmp      = _.clone(init_val)
          , result   = []
          ;

        // grouping
        _.each(testcase, _.bind(function(cmd){
            if(this.isHeadingCommand(cmd)){
                if(tmp.commands.length !== 0){
                    result.push(tmp);
                    tmp = _.extend(_.clone(init_val), {title: cmd.value, commands: []});
                }
                result.push({type: 'heading', title: cmd.value});
            } else if(this.isCommentCommand(cmd)){
                // normal comment
                if(tmp.commands.length === 0){
                    tmp.title = cmd.value;
                } else {
                    result.push(tmp);
                    tmp = _.extend(_.clone(init_val), {title: cmd.value, commands: []});
                }
            } else {
                // command
                tmp.commands.push(cmd);
            }
        }, this));

        if(tmp.commands.length !== 0){ result.push(tmp); }

        // add result
        result = _.map(result, _.bind(function(test){
            return(_.extend(test, { result: this.getCommandsTotalResult(test.commands) }));
        }, this));

        return(result);
    };

    PrettyReport.prototype.getTestCaseResultContent = function(testcase, no_summary){
        var title    = IDE.getTestCaseTitle(testcase)
          , tests    = _.map(IDE.collectTestCaseCommands(testcase), IDE.parseTestCase)
          , commands = _.filter(tests, function(x){ return(x.type === 'command'); })
          , summary  = SIPR.template.summary({
                title     : 'Test Case Summary'
              , result    : this.getCommandsTotalResult(commands)
              , done      : _.filter(commands, this.isDoneCommand).length
              , failed    : _.filter(commands, this.isFailedCommand).length
              , undefined : _.filter(commands, this.isUndefinedCommand).length
              , total     : commands.length})
          , data     = {
                title     : title
              , tests     : this.groupTestCase(tests)
              , summary   : (no_summary === undefined) ? summary : ""}
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
                title  : this.title
              , style  : ADDON.readFile(this.css_file)
              , script : ADDON.readFile(this.js_file)
              , body   : this.getTestCaseResultContent(IDE.getTestCase())
            })
        );
    };

    PrettyReport.prototype.exportTestSuiteResult = function(){
        var suite    = IDE.getTestSuite()
          , contents = _.map(suite, _.bind(function(test){
                return(this.getTestCaseResultContent(test.content, false)); }, this))
          , commands = _.chain(suite).reduce(function(res, test){
                return(res.concat(test.content.commands));
            }, []).filter(function(x){ return(x.type === 'command'); }).value()
          , summary  = SIPR.template.summary({
                title     : 'Test Suite Summary'
              , result    : this.getCommandsTotalResult(commands)
              , total     : commands.length
              , done      : _.filter(commands, this.isDoneCommand).length
              , failed    : _.filter(commands, this.isFailedCommand).length
              , undefined : _.filter(commands, this.isUndefinedCommand).length })
          , data     = { suite: contents, summary: summary }
          ;

        ADDON.writeFile(
            ADDON.openFileDialog("title")
          , SIPR.template.html({
                title  : this.title
              , style  : ADDON.readFile(this.css_file)
              , script : ADDON.readFile(this.js_file)
              , body   : SIPR.template.testsuite(data)
            })
        );
    };

    if(!window.SIPR){
        window.SIPR = new PrettyReport();
    }
}(window));
