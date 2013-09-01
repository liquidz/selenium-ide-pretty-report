(function(window, undefined){
    function IDE(){}

    // PRIVATE FUNCTION >>>>>
    var parseComment = function(src){
        if(src.match(/<!--\s*(.+?)\s*-->/)){
            return({type: "comment", value: RegExp.$1});
        }
        return(src);
    };

    var parseCommand = function(src){
        if(src.match(/<td>(.+?)<\/td>\s*<td>(.*?)<\/td>\s*<td>(.*?)<\/td>\s*/)){
            return({type: "command", command: RegExp.$1, target: RegExp.$2, value: RegExp.$3});
        }
        return(src);
    };
    // <<<<< PRIVATE FUNCTION

    IDE.prototype.expandRollupRules = function(cmd){
        var rollup = null;
        if(cmd.isRollup && cmd.isRollup()){
            var rule = Editor.rollupManager.getRollupRule(cmd.target);
            if(rule !== null){
                rollup = {
                    name        : rule.name
                  , description : rule.description
                  , args        : rule.args
                  , commands    : rule.getExpandedCommands(cmd.value)
                };
            }
        }
        return(rollup);
    };

    IDE.prototype.collectTestCaseCommands = function(testcase){
        return(testcase.commands.reduce(function(res, cmd){
            return(res.concat(cmd));
        }, []));
    };


    IDE.prototype.parseTestCase = function(cmd){
        var src = getSourceForCommand(cmd)
          , res = null
          ;

        if(src.indexOf("<!--") !== -1){
            res = parseComment(src);
        } else {
            res = parseCommand(src);
        }

        // rollup
        res.rollup = IDE.prototype.expandRollupRules(cmd);
        if(res.rollup){
            res.rollup.commands = res.rollup.commands.map(IDE.prototype.parseTestCase);
        }
        // result
        res.result = (cmd.result !== undefined) ? cmd.result : "undefined";
        res.result = (res.result === 'passed')  ? 'done'     : res.result;

        return(res);
    };

    IDE.prototype.getTestCase = function(){
        return(window.editor.app.getTestCase());
    };

    IDE.prototype.getTestCaseTitle = function(testcase){
        if(testcase === undefined){
            testcase = this.getTestCase();
        }
        return(testcase.getTitle());
    };

    IDE.prototype.getTestSuite = function(){
        var app   = window.editor.app
          , suite = app.getTestSuite()
          ;

        return(suite.tests.map(function(test){
            if(!test.content){
                var t = app.getCurrentFormat().loadFile(test.getFile(), false);
                test.content = t;
            }
            test.content.commands = test.content.commands.map(function(x){
                x.result = (x.result === undefined) ? 'undefined' : x.result;
                x.result = (x.result === 'passed') ? 'done' : x.result;
                return(x);
            });
            return(test);
        }));
    };

    if(!window.IDE_UTIL){
        window.IDE = new IDE();
    }

}(window));
