Parse.initialize("3lJfd4T87rxDvs34BJcXEjO7tbJLAyQ4cN3XSwCv", "WInG2A7UMnpzeCH51SXB0pecsWWtmOKvjXyolLUm");

wtw.Employee = Parse.Object.extend({

    className: "employees",

    initialize: function() {
        this.reports = new wtw.ReportsCollection();
        this.reports.query = new Parse.Query(wtw.Employee).equalTo("managerId", this.id);
    }

});

wtw.EmployeeCollection = Parse.Collection.extend(({

    model: wtw.Employee,

    fetch: function(options) {
        console.log('custom fetch');
        if (options.data && options.data.name) {
            var firstNameQuery = new Parse.Query(wtw.Employee).contains("firstName", options.data.name);
            var lastNameQuery = new Parse.Query(wtw.Employee).contains("lastName", options.data.name);
            this.query = Parse.Query.or(firstNameQuery, lastNameQuery);
        }
        Parse.Collection.prototype.fetch.apply(this, arguments);

    }

}));

wtw.ReportsCollection = Parse.Collection.extend(({

    model: wtw.Employee

}));
