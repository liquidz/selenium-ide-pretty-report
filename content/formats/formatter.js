(function(window, undefined){

    var template = {
        html: ''
            + '<!DOCTYPE html><html><head>'
            + '  <meta charset="UTF-8" />'
            + '  <title>{{title}}</title>'
            + '</head><body>{{{body}}}</body></html>'
      , testcase: ''
            + '<div class="testcase">'
            + '  <table class="{{result}}"><caption>{{title}}</caption>'
            + '  <thead><tr><th>command</th><th>target</th><th>value</th></tr></thead>'
            + '  <tbody>'
            + '  {{#commands}}'
            + '    <tr class="{{result}}">'
            + '      <td>{{command}}</td><td>{{target}}</td><td>{{value}}</td>'
            + '    </tr>'
            + '  {{/commands}}'
            + '  </tbody></table>'
            + '</div>'
    };

    var self = {};

    self.html = function(title, body){
        return(Mustache.render(template.html, {title: title, body: body}));
    }

    self.testcase = function(data){
        return(Mustache.render(template.testcase, data));
    };

    if(!window.SIPR.formatter){
        window.SIPR.formatter = self;
    }
}(window));
