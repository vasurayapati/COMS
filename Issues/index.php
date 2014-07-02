<!doctype html>
<!--[if lt IE 7 ]> <html class="no-js ie6" lang="en"> <![endif]-->
<!--[if IE 7 ]>    <html class="no-js ie7" lang="en"> <![endif]-->
<!--[if IE 8 ]>    <html class="no-js ie8" lang="en"> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE">
        <title>GIT Issues for Chemotherapy Order Management System (COMS)</title>

<?php
require_once "..\app\session.php";
		$Deployment = "app.js";
		$Version = "js"; // Demo Server version
		$LibsVersion2 = "/libs/ExtJS_4.1.0";
		$LibsVersion = $LibsVersion2; // New Default Library <--- MWB - 6/29/2012 - Old Library Version


if ("High" == $_SESSION["BrowserMode"]) { ?>
        <link rel="stylesheet" id="COMS_Theme" type="text/css" <?php echo "href=\"$LibsVersion/resources/css/ext-all-access.css\"";?>>
        <link rel="stylesheet" id="COMS_Theme1" type="text/css" href="COMS-Access.css">
<?php 
}
else { ?>
        <link rel="stylesheet" id="COMS_Theme" type="text/css" <?php echo "href=\"$LibsVersion/resources/css/ext-all.css\"";?>>
        <link rel="stylesheet" id="COMS_Theme1" type="text/css" href="COMS.css">
<?php }?>

		<!-- All JavaScript at the bottom, except for Modernizr which enables HTML5 elements & feature detects -->
		<script src="/libs/modernizr-2.0.6.js"></script>
		<style>
			div#heading { margin: 1em; display:none; font-size: 110%; }
			#heading ul { margin: 1em; }
			#heading li { margin-left: 3em; list-style-type: disc; }
		</style>

	</head>
<body>
<div id="heading">
This display presents open items and is stratified into the following three groups:  
<ul>
<li><b>Product Backlog - PoC</b> (Proof of Concept) for the items originally identified by PoC COMS Stakeholders, deferred for higher priority concerns, and required for this current COMS project</li>
<li><b>Product Backlog - Prototype</b> COMS for functionality requested by the current group of Stakeholders</li>
<li><b>Defect Log</b> for application defects</li>
</ul>
To sort the lists within their respective categories, select the pull down menu for Issue Title and select "Sort Ascending".  The issue titles with an asterisk (*) are designated for development during the current sprint to be presented during the next COMS Demonstration.  After successful demonstration at this Stakeholder Review, these items will be closed and removed from the Backlogs and Defects display.   
</div>

<div id="GridPanel"></div>
<script type="text/javascript" <?php echo "src=\"$LibsVersion/ext-all-debug.js\"";?>></script>

<script>
Ext.onReady(function(){
	var heading = Ext.get("heading");
	heading.dom.style.display="block";
	var minWidth = Ext.getBody().getViewSize().width - 150;
	var minHeight = Ext.getBody().getViewSize().height - 200;
	if (minWidth < 0) {
		minWidth = 200;
	}
	if (minHeight < 0) {
		minHeight = 200;
	}
	var puWin = function(title, msg) {
		var bodyWin = Ext.create("Ext.window.Window", { 
			title: title,
			layout: "fit",
			html: msg,
			minWidth: minWidth,
			minHeight: minHeight,
			autoScroll: true,
			bodyPadding: '10',
			modal: true
		});
		bodyWin.show();
	}

    Ext.define('Issue', {
        extend: 'Ext.data.Model',
        fields: ['url', 'number', 'title', 'state', 'created_at', 'label', 'body'],
    });

    var store = Ext.create('Ext.data.Store', {
        autoLoad: true,
        model: "Issue",
        groupField: "label",
        proxy: {
            type: "rest",
            url: "/Git/ListIssues",
            reader: {
                type: "json",
                root: "records"
            }
        }
    });

    var grid = Ext.create('Ext.grid.Panel', {
        selType: 'rowmodel',
        title: 'Backlogs and Defects',
        store: store,
        margin: '25',
        frame: true,
		layout: "fit",
		features: [
        Ext.create('Ext.grid.feature.GroupingSummary', {
            id: 'groupSummary',
            groupHeaderTpl: '{name} ({rows.length} {[values.rows.length > 1 ? "Entries" : "Entry"]})'
        }) 
//		{
//            ftype: 'grouping'
//        }
		],
		listeners: {
			'cellclick': function(scope, td, cellIndex, record, tr, rowIndex, e, eOpts) {
				puWin(record.data.title, record.data.body);
				// Ext.Msg.alert(record.data.title, record.data.body);
			}
		},

        columns: [
            { text: 'Issue #', dataIndex: 'number', width:50, autoSizeColumn: true},
            { text: 'Issue Title', dataIndex: 'title', flex: 2, autoSizeColumn: true },
            { text: 'State', dataIndex: 'state', width:50, autoSizeColumn: true},
            { text: 'Opened on', dataIndex: 'created_at', autoSizeColumn: true, renderer: function(value) {
                    return value.substring(0, 10);
                }
            },
            { text: '', labelSeparator: '', dataIndex: 'label', hidden: true}
        ],
        renderTo: Ext.get("GridPanel")
    });

	Ext.EventManager.onWindowResize(function () {
        var tmpWidth = Ext.getBody().getViewSize().width - 50;
		var tmpHeight = Ext.getBody().getViewSize().height - 160;
        grid.setSize(tmpWidth, tmpHeight);
    });

		var tmpWidth = Ext.getBody().getViewSize().width - 50;
		var tmpHeight = Ext.getBody().getViewSize().height - 160;
        grid.setSize(tmpWidth, tmpHeight);

});
</script>
</body>
</html>


