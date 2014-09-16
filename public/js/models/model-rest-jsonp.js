/*
    If you are using the sample RESTFul services I published on GitHub, use the following URLs...

      - For the Node.js sample backend (available in https://github.com/ccoenraets/wtw-rest-nodejs)
        Use: http://localhost:3000/employees

      - For the PHP sample backend (available in https://github.com/ccoenraets/wtw-rest-php)
        Use: /wtw-rest-php/employees

 */

wtw.Employee = Backbone.Model.extend({

    urlRoot:"http://localhost:3000/employees",
//    urlRoot:"/wtw-rest-php/employees",

    initialize:function () {
        this.reports = new wtw.EmployeeCollection();
        this.reports.url = this.urlRoot + "/" + this.id + "/reports";
    }

});

wtw.EmployeeCollection = Backbone.Collection.extend({

    model: wtw.Employee,

    url:"http://localhost:3000/employees"
//    url:"/wtw-rest-php/employees"

});

var originalSync = Backbone.sync;
Backbone.sync = function (method, model, options) {
    if (method === "read") {
        options.dataType = "jsonp";
        return originalSync.apply(Backbone, arguments);
    }

};