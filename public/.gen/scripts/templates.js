this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};

this["Handlebars"]["templates"]["dashboard/template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"JS-search\"></div>\n<div class=\"JS-task-list\"></div>\n<div class=\"JS-gadget-list\"></div>";
  });

this["Handlebars"]["templates"]["format/template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <option value=\"";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.type); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.selected), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.type); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</option>\n        ";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return " selected";
  }

  buffer += "<div class=\"W-format-gadget\" data-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    <form action=\".\">\n    <select>\n        ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.options), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </select>\n    <input style=\"display: none\" type=\"text\" name=\"regex\" class=\"w-regex\" placeholder=\"Regular Expression\" value=\"";
  if (stack1 = helpers.regex) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.regex); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    <input style=\"display: none\" type=\"submit\" value=\"Apply\" disabled>\n    </form>\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["gadget-list/template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"W-gadget-list-container W-gadget-list\"></div>\n";
  });

this["Handlebars"]["templates"]["gadget/number"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return " w-failed";
  }

  buffer += "<div class=\"W-gadget W-gadget-number";
  stack2 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.meta)),stack1 == null || stack1 === false ? stack1 : stack1.failed), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">\n    <header>\n        <div class=\"w-stats\">\n            <span>First: <strong>";
  if (stack2 = helpers.currency) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.currency); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2);
  if (stack2 = helpers.first) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.first); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</strong></span>\n            <span>Latest: <strong>";
  if (stack2 = helpers.currency) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.currency); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2);
  if (stack2 = helpers.latest) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.latest); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</strong></span>\n            <span>Change: <strong>";
  if (stack2 = helpers.currency) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.currency); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2);
  if (stack2 = helpers.diff) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.diff); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</strong></span>\n            <span>Time: <strong>about ";
  if (stack2 = helpers.time) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.time); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</strong></span>\n        </div>\n        <div class=\"JS-settings\"></div>\n        <div class=\"w-title-text\">\n            <h1>";
  if (stack2 = helpers.title) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.title); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</h1>\n            <div class=\"w-meta\"><a href=\"";
  if (stack2 = helpers.url) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.url); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" target=\"_blank\">";
  if (stack2 = helpers.url) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.url); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</a></div>\n        </div>\n        <div class=\"w-format\"></div>\n    </header>\n    <div class=\"w-data-container\">\n        <div class=\"w-flot\"></div>\n        <div class=\"w-tooltip\"></div>\n    </div>\n</div>\n";
  return buffer;
  });

this["Handlebars"]["templates"]["gadget/string"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

function program1(depth0,data) {
  
  
  return " w-failed";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n            <li>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.date || (depth0 && depth0.date)),stack1 ? stack1.call(depth0, (depth0 && depth0.asof), options) : helperMissing.call(depth0, "date", (depth0 && depth0.asof), options)))
    + ": <strong>";
  if (stack2 = helpers.value) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.value); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</strong></li>\n            ";
  return buffer;
  }

  buffer += "<div class=\"W-gadget W-gadget-string";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.failed), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n    <header>\n        <div class=\"w-stats\">\n            <span>Stuff</span>\n        </div>\n        <div class=\"JS-settings\"></div>\n        <div class=\"w-title-text\">\n            <h1>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.title); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h1>\n            <div class=\"w-meta\"><a href=\"";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.url); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" target=\"_blank\">";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.url); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a></div>\n        </div>\n        <div class=\"w-format\"></div>\n    </header>\n    <div class=\"w-data-container\">\n        <ul>\n            ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.data), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </ul>\n    </div>\n</div>\n";
  return buffer;
  });

this["Handlebars"]["templates"]["login/template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"W-login\">\n    <form action=\"/\" method=\"post\" class=\"w-login\">\n        <div>\n            <label>Email Address:</label>\n            <input type=\"text\" name=\"username\">\n        </div>\n        <div>\n            <label>Password:</label>\n            <input type=\"password\" name=\"password\">\n        </div>\n        <div>\n            <input type=\"submit\" value=\"Log In\">\n        </div>\n    </form>\n    <form action=\"/\" method=\"post\" class=\"w-signup\">\n        <div>\n            <label>Email Address:</label>\n            <input type=\"text\" name=\"username\">\n        </div>\n        <div>\n            <label>Password:</label>\n            <input type=\"password\" name=\"password\">\n        </div>\n        <div>\n            <input type=\"submit\" value=\"Sign Up\">\n        </div>\n    </form>\n    <form action=\"/auth/google\" method=\"post\">\n        <input type=\"submit\" value=\"Sign in with google\">\n    </form>\n</div>";
  });

this["Handlebars"]["templates"]["masthead/template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"W-masthead-container W-masthead\">\n    <div class=\"w-logo\"><h1>Watchr.co</h1></div>\n    <div class=\"w-signout\">Signout</div>\n    <div class=\"w-username\">";
  if (stack1 = helpers.username) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.username); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n</div>\n";
  return buffer;
  });

this["Handlebars"]["templates"]["search/template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"W-search-container W-search\">\n    <form method=\"post\" action=\"/search\" class=\"w-form\">\n        <label>\n            <input type=\"text\" name=\"title\" placeholder=\"Name\" title=\"Please enter a name for this task\" required>\n        </label>\n        <label>\n            <input type=\"url\" name=\"url\" placeholder=\"URL\" title=\"You need to supply a valid URL to scrape\" required>\n        </label>\n        <label>\n            <input type=\"text\" name=\"css\" placeholder=\"Selector\" title=\"You need to supply a CSS selector\" required>\n        </label>\n        <label>\n            <input style=\"display: none\" type=\"text\" name=\"css\" placeholder=\"Regular Expression\" title=\"Optional: Apply a regular expression to the result\">\n        </label>\n        <input type=\"submit\" value=\"Test\" style=\"display: none\">\n        <input type=\"submit\" value=\"Add\">\n    </form>\n</div>\n";
  });

this["Handlebars"]["templates"]["settings/template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return " w-failed";
  }

function program3(depth0,data) {
  
  
  return "\n                Scrapping failed\n                ";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                ";
  if (stack1 = helpers.latest_result) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.latest_result); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n                ";
  return buffer;
  }

  buffer += "<div class=\"W-settings ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.failed), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n    <img src=\"/images/arrow_expand.svg\" class=\"svg W-icon-arrow_expand\" alt=\"Settings\" />\n    <img src=\"/images/icon_cogs.svg\" class=\"svg W-icon-cogs\" alt=\"Settings\" />\n    <div class=\"w-content\">\n        <form>\n            <header>Settings</header>\n            <label class=\"w-title\">\n                <span>Name</span>\n                <input type=\"text\" name=\"title\" value=\"";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.title); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" required>\n            </label>\n            <label class=\"w-url\">\n                <span>URL</span>\n                <input type=\"url\" name=\"url\" value=\"";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.url); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" title=\"You need to supply a valid URL to scrape\" required>\n            </label>\n            <label class=\"w-selector\">\n                <span>Selector</span>\n                <input type=\"text\" name=\"css\" value=\"";
  if (stack1 = helpers.css) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.css); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" title=\"You need to supply a CSS selector\" required>\n            </label>\n            <div class=\"w-result\">\n                ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.failed), {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            </div>\n            <div class=\"w-buttons\">\n                <input type=\"submit\" name=\"test\" value=\"Test\" disabled>\n                <input type=\"submit\" name=\"save\" value=\"Save\" disabled>\n            </div>\n        </form>\n    </div>\n</div>\n";
  return buffer;
  });

this["Handlebars"]["templates"]["task-list/template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div class=\"w-listitem";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.failed), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" data-id=\"";
  if (stack1 = helpers.task_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.task_id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.failed), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        <div class=\"w-title\">";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.title); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n        <div class=\"w-latest\">";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.value); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n        <div class=\"w-url\"><a href=\"";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.url); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" target=\"_blank\">";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.url); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a></div>\n        <div class=\"w-delete\">X</div>\n    </div>\n    ";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return " w-failed";
  }

function program4(depth0,data) {
  
  
  return "\n        <div class=\"w-failed-notification\">\n            FAILED\n        </div>\n        ";
  }

function program6(depth0,data) {
  
  
  return "\n    <div>Nada here</div>\n    ";
  }

  buffer += "<div class=\"W-task-list-container W-task-list\">\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.tasks), {hash:{},inverse:self.program(6, program6, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n";
  return buffer;
  });