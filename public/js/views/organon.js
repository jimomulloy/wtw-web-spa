wtw.OrganonView = Backbone.View.extend({

    events : {
        "click #treeBtn" : "treeBtnClick"
    },

    configScreen : function() {
        $("#splitter").igSplitter({
            height : "700px",
            orientation : "horizontal",
            panels : [ {
                collapsible : false
            }, {
                collapsed : false,
                collapsible : true
            } ]
        });
        this.initTree();
        this.initGrid();
    },
    
    initTree : function() {
        var data = [ {
            label : 'node1',
            children : [ {
                label : 'child1'
            }, {
                label : 'child2'
            } ]
        }, {
            label : 'node2',
            children : [ {
                label : 'child3'
            } ]
        } ];

        $('#jstree').jstree({
            "core" : {
                "animation" : 0,
                "check_callback" : true,
                "themes" : {
                    "stripes" : true
                },
                'data' : {
                    'url' : function(node) {
                        return node.id === '#' ? '/jstree/data/ajax_demo_roots.json' : '/jstree/data/ajax_demo_children.json';
                    },
                    'data' : function(node) {
                        return {
                            'id' : node.id
                        };
                    }
                }
            },
            "types" : {
                "#" : {
                    "max_children" : 1,
                    "max_depth" : 4,
                    "valid_children" : [ "root" ]
                },
                "root" : {
                    "icon" : "/jstree/images/tree_icon.png",
                    "valid_children" : [ "default" ]
                },
                "default" : {
                    "valid_children" : [ "default", "file" ]
                },
                "file" : {
                    "icon" : "glyphicon glyphicon-file",
                    "valid_children" : []
                }
            },
            "themes" : {
                "theme" : "default",
                "url" : "/jstree/themes/default/style.css"
            },
            "plugins" : [ "ui", "html_data", "themes", "hotkeys", "contextmenu", "dnd", "search", "state", "types", "wholerow" ]

        });
        $('#jstree').on("changed.jstree", function(e, data) {
            console.log(data.selected);
        });

        $('#jqtree').tree({
            data : data
        });
    },

    initGrid : function() {
        // Data
        var populationData = [ {
            "CountryName" : "China",
            "1995" : 1216,
            "2005" : 1297,
            "2015" : 1361,
            "2025" : 1394
        }, {
            "CountryName" : "India",
            "1995" : 920,
            "2005" : 1090,
            "2015" : 1251,
            "2025" : 1396
        }, {
            "CountryName" : "United States",
            "1995" : 266,
            "2005" : 295,
            "2015" : 322,
            "2025" : 351
        }, {
            "CountryName" : "Indonesia",
            "1995" : 197,
            "2005" : 229,
            "2015" : 256,
            "2025" : 277
        }, {
            "CountryName" : "Brazil",
            "1995" : 161,
            "2005" : 186,
            "2015" : 204,
            "2025" : 218
        } ];

        // Grid
        $("#grid").igGrid({
            width : "100%",
            dataSource : populationData,
            autoGenerateColumns : false,
            columns : [ {
                key : "CountryName",
                headerText : "Country",
                width : "33.33%"
            }, {
                key : "2005",
                headerText : "2005",
                width : "33.33%"
            }, {
                key : "2015",
                headerText : "2015",
                width : "33.33%"
            } ],
            features : [ {
                name : "Sorting",
                columnSettings : [ {
                    columnKey : "2015",
                    currentSortDirection : "descending"
                } ]
            } ]
        });

        // Data Chart
        $("#chart").igDataChart({
            width : "100%",
            height : "300px",
            title : "Population per Country",
            subtitle : "Five largest projected populations for 2015",
            dataSource : populationData,
            axes : [ {
                name : "NameAxis",
                type : "categoryX",
                title : "Country",
                label : "CountryName"
            }, {
                name : "PopulationAxis",
                type : "numericY",
                minimumValue : 0,
                title : "Projected Population (Millions of People)",
            } ],
            series : [ {
                name : "2015Population",
                type : "column",
                xAxis : "NameAxis",
                yAxis : "PopulationAxis",
                valueMemberPath : "2015"
            } ]
        });
    },

    render : function() {
        this.$el.html(this.template());
        return this;
    },

    treeBtnClick : function() {
        console.log("Tree button clicked");
        $('#jstree').jstree(true).select_node('child_node_1');
        $('#jstree').jstree('select_node', 'child_node_1');
        $.jstree.reference('#jstree').select_node('child_node_1');
    }

});