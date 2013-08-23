(function(window, undefined){

    var template = {
        html: ''
            + '<!DOCTYPE html><html><head>'
            + '  <meta charset="UTF-8" />'
            + '  <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/pure/0.2.1/pure-min.css" />'
            + '  <link href="http://netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet" />'
            + '  <link rel="stylesheet" type="text/css" href="./main.css" />'
            + '  <title>{{title}}</title>'
            + '</head><body><div class="content">{{{body}}}</div>'
            + '<script type="text/javascript" src="./main.js"></script>'
            + '</body></html>'
      , testcase: ''
            + '<div class="testcase">'
            + '  <h2 class="testcase-name">{{title}}</h2>'
            + '  {{#tests}}'
            + '    <p class="{{result}}">'
            + '      {{#is_done}}<i class="icon-ok"></i>{{/is_done}}'
            + '      {{^is_done}}<i class="icon-remove"></i>{{/is_done}}'
            + '      {{title}}'
            + '      <table class="pure-table pure-table-striped testcase-commands">'
            + '      <thead><tr>'
            + '        <th class="testcase-result"></th>'
            + '        <th class="testcase-command">command</th>'
            + '        <th class="testcase-target">target</th>'
            + '        <th class="testcase-value">value</th>'
            + '      </tr></thead>'
            + '      <tbody>'
            + '      {{#commands}}'
            + '        <tr class="{{result}}">'
            + '          <td class="testcase-result">'
            + '            {{#is_done}}<i class="icon-ok"></i>{{/is_done}}'
            + '            {{^is_done}}<i class="icon-remove"></i>{{/is_done}}'
            + '          </td>'
            + '          <td class="testcase-command">{{command}}</td>'
            + '          <td class="testcase-target">{{target}}</td>'
            + '          <td class="testcase-value">{{value}}</td>'
            + '        </tr>'
            + '      {{/commands}}'
            + '      </tbody></table>'
            + '    </p>'
            + '  {{/tests}}'
            + '</div>'
    };

    var self = {};

    self.html = function(data){
        return(Mustache.render(template.html, data));
    }

    self.testcase = function(data){
        return(Mustache.render(template.testcase, data));
    };


    if(!window.SIPR.formatter){
        window.SIPR.formatter = self;
    }
}(window));
