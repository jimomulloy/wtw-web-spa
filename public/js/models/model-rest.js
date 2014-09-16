/*
    If you are using the sample RESTFul services I published on GitHub, use the following URLs...

      - For the Node.js sample backend (available in https://github.com/ccoenraets/wtw-rest-nodejs)
        Use: http://localhost:3000/employees

        If you are using this Node.js endpoint, the pages of the application must be served from the same domain/port (http://localhost:3000).
        If you want to serve the pages and the data from different domains/ports, use the JSONP adapter instead.

      - For the PHP sample backend (available in https://github.com/ccoenraets/wtw-rest-php)
        Use: /wtw-rest-php/employees

 */

wtw.Employee = Backbone.Model.extend({

    urlRoot:"/wtw-rest-php/employees",
//    urlRoot:"http://localhost:3000/employees",

    initialize:function () {
        this.reports = new wtw.EmployeeCollection();
        this.reports.url = this.urlRoot + "/" + this.id + "/reports";
    }

});

wtw.EmployeeCollection = Backbone.Collection.extend({

    model: wtw.Employee,

    url:"/wtw-rest-php/employees"
//    url:"http://localhost:3000/employees"

});