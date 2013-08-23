(function(window, undefined){

    var template = {
        html: ''
            + '<!DOCTYPE html><html><head>'
            + '  <meta charset="UTF-8" />'
            + '  <title>{{title}}</title>'
            + '</head><body>{{{body}}}</body></html>'
      , testcase: ''
            + '<div class="testcase">'
            + '  <p class="testcase-name">{{title}}</p>'
            + '  {{#tests}}'
            + '    <table class="testcase-commands {{result}}"><caption>{{title}}</caption>'
            + '    <thead><tr><th>command</th><th>target</th><th>value</th></tr></thead>'
            + '    <tbody>'
            + '    {{#commands}}'
            + '      <tr class="{{result}}">'
            + '        <td class="testcase-command">{{command}}</td>'
            + '        <td class="testcase-target">{{target}}</td>'
            + '        <td class="testcase-value">{{value}}</td>'
            + '      </tr>'
            + '    {{/commands}}'
            + '    </tbody></table>'
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
