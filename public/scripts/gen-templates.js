this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};

this["Handlebars"]["templates"]["login/template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"W-login\">\n    <form action=\"/\" method=\"post\" class=\"w-login\">\n        <div>\n            <label>Email Address:</label>\n            <input type=\"text\" name=\"username\">\n        </div>\n        <div>\n            <label>Password:</label>\n            <input type=\"password\" name=\"password\">\n        </div>\n        <div>\n            <input type=\"submit\" value=\"Log In\">\n        </div>\n    </form>\n    <form action=\"/\" method=\"post\" class=\"w-signup\">\n        <div>\n            <label>Email Address:</label>\n            <input type=\"text\" name=\"username\">\n        </div>\n        <div>\n            <label>Password:</label>\n            <input type=\"password\" name=\"password\">\n        </div>\n        <div>\n            <input type=\"submit\" value=\"Sign Up\">\n        </div>\n    </form>\n</div>";
  });

this["Handlebars"]["templates"]["masthead/template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"W-masthead\">\n    <div class=\"w-logo\">Watchr</div>\n    <div class=\"w-signout\">Signout</div>\n    <div class=\"w-username\">";
  if (stack1 = helpers.username) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.username); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["search/template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"W-search\">\n    <form method=\"post\" action=\"/search\" class=\"w-form\">\n        <label>\n            <span>URL:</span>\n            <input type=\"text\" name=\"url\">\n        </label>\n        <label>\n            <span>Selector:</span>\n            <input type=\"text\" name=\"selector\">\n        </label>\n        <input type=\"submit\">\n    </form>\n    <div class=\"w-answer\"></div>\n</div>";
  });