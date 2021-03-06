(function(window, undefined){
    var _ = window.UOCHAN._;

    function PrettyReport(){
        this.title     = "Selenium IDE: Pretty Report";
        this.css_file  = "resource://si_prettyreport/main.css";
        this.js_file   = "resource://si_prettyreport/main.js";
        this.js_jquery = "resource://si_prettyreport/js/jquery/jquery-2.0.3.min.js";
    };

    // PRIVATE FUNCTIONS >>>>>

    var existy = function(x){ return(x !== null); };

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
                result.push({type: 'heading', title: cmd.value, id: _.uniqueId('heading')});
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

    PrettyReport.prototype.getSummary = function(title, commands){
        return(UOCHAN.PrettyReport.template.summary(
            _.extend(
                { title     : title
                , result    : this.getCommandsTotalResult(commands)
                , done      : _.filter(commands, this.isDoneCommand).length
                , failed    : _.filter(commands, this.isFailedCommand).length
                , undefined : _.filter(commands, this.isUndefinedCommand).length
                , total     : commands.length}
              , UOCHAN.PrettyReport.template.getCurrentTime()
            )
        ));
    };

    PrettyReport.prototype.getTestCaseResultContent = function(testcase, no_summary){
        var title    = UOCHAN.ide.getTestCaseTitle(testcase)
          , tests    = _.map(UOCHAN.ide.collectTestCaseCommands(testcase), UOCHAN.ide.parseTestCase)
          , commands = _.filter(tests, function(x){ return(x.type === 'command'); })
          , summary  = this.getSummary('Test Case Summary', commands)
          , data     = {
                title     : title
              , tests     : this.groupTestCase(tests)
              , summary   : (no_summary === undefined) ? summary : ""}
          ;

        //data.headings = _.filter(data.tests, function(t){
        //    return(t.type === 'heading')
        //});

        data.test = _.map(data.tests, function(test){
            if(test.type === 'heading' && test.title.match(/^(#+)\s*(.+)$/)){
                test.html = UOCHAN.PrettyReport.template.heading({
                    n    : RegExp.$1.length
                  , id   : test.id
                  , value: RegExp.$2
                });
            }
            return(test);
        });

        return(UOCHAN.PrettyReport.template.testcase(data));
    };

    PrettyReport.prototype.exportTestCaseResults = function(){
        UOCHAN.addon.writeFile(
            UOCHAN.addon.openFileDialog("title")
          , UOCHAN.PrettyReport.template.html5({
                title  : this.title
              , style  : UOCHAN.addon.readFile(this.css_file)
              , script : UOCHAN.addon.readFile(this.js_file)
              , body   : this.getTestCaseResultContent(UOCHAN.ide.getTestCase())
              , jquery : UOCHAN.addon.readFile(this.js_jquery)
            })
        );
    };

    PrettyReport.prototype.exportTestSuiteResult = function(){
        var suite    = UOCHAN.ide.getTestSuite()
          , contents = _.map(suite, _.bind(function(test){
                return(this.getTestCaseResultContent(test.content, false)); }, this))
          , commands = _.chain(suite).reduce(function(res, test){
                return(res.concat(test.content.commands));
            }, []).filter(function(x){ return(x.type === 'command'); }).value()
          , summary = this.getSummary('Test Suite Summary', commands)
          , data     = { suite: contents, summary: summary }
          ;

        UOCHAN.addon.writeFile(
            UOCHAN.addon.openFileDialog("title")
          , UOCHAN.PrettyReport.template.html5({
                title  : this.title
              , style  : UOCHAN.addon.readFile(this.css_file)
              , script : UOCHAN.addon.readFile(this.js_file)
              , body   : UOCHAN.PrettyReport.template.testsuite(data)
              , jquery : UOCHAN.addon.readFile(this.js_jquery)
            })
        );
    };

    if(!window.UOCHAN){
        window.UOCHAN = {};
    }
    if(!window.UOCHAN.PrettyReport){
        window.UOCHAN.PrettyReport = new PrettyReport();
    }
}(window));
