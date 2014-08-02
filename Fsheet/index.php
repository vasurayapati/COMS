<!doctype html>
<!--[if lt IE 7 ]> <html class="no-js ie6" lang="en"> <![endif]-->
<!--[if IE 7 ]>    <html class="no-js ie7" lang="en"> <![endif]-->
<!--[if IE 8 ]>    <html class="no-js ie8" lang="en"> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
	<head>
		<meta charset="utf-8">
		<META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE">
		<title>Flowsheet for Chemotherapy Order Management System (COMS)</title>

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
			.fSheet-editCell { background-color: yellow!important; font-weight: bold!important; }
		</style>

	</head>
<body>
<div id="heading"></div>

<div id="GridPanel" style="width:98%; margin: 10px auto;"></div>
<script type="text/javascript" src="/libs/ExtJS_4.1.0/ext-all-debug.js"></script>

<script>
	Ext.require([
		'Ext.grid.*',
		'Ext.data.*',
		'Ext.form.field.Number',
		'Ext.form.field.Date',
		'Ext.tip.QuickTipManager'
	]);


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
			bodyPadding: "10",
			modal: true
		});
		bodyWin.show();
	}


	var qs = window.location.search.substring(1);
	var PID = "";
	var PName = "";
	var theDataURI = "/NursingDoc/FlowsheetData" + "/";
	var theDesignURI = "/NursingDoc/FlowsheetFields" + "/";

	if ("" !== qs) {
		qs = "&" + qs;
		qs = qs.split("&");
		PID = qs[1].split("=");
		theDataURI += PID[1];
		theDesignURI += PID[1];
		PName = decodeURI(qs[2].split("=")[1]);
	}

	var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    });

	var makeModel = function(theFieldDefs) {
		Ext.define("Task", {
			extend: "Ext.data.Model",
			idProperty: "taskId",
			fields: theFieldDefs
		});
	};

	var makeStore = function(theFieldDefs, dfltPos, groupField, theData) {
		makeModel(theFieldDefs);
		var storeConfig = {
			model : "Task",
			groupField : groupField,
			autoLoad : true,
			CurPos : dfltPos,
			proxy : {
				type: "rest",
				url: theDataURI,
				reader: {
					type: "json",
					root: "records"
				}
			},
			listeners : {
				load: 
					function(theStore, records, success, eOpts) {
						unMask();
						var CurPos = this.CurPos;
						var grid = Ext.getCmp("FlowsheetGrid");
						if (CurPos) {
							grid.getSelectionModel().setCurrentPosition(CurPos);
						}
					}
			}
		}
		var theStore = Ext.create("Ext.data.Store", storeConfig);
		return theStore;
	};

	var makeGrid = function(theStore, theColumns) {
		var grid = Ext.create('Ext.grid.Panel', {
			id: "FlowsheetGrid",
			width: 800,
			height: 450,
			frame: true,
			margin: "10 auto 10 auto",
			title: 'Flowsheet for Patient ' + PName,
			iconCls: 'icon-grid',
			renderTo: "GridPanel",
			store: theStore,
			plugins: [cellEditing],
			selModel: {
				selType: 'cellmodel'
			},
			features: [{
				id: 'group',
				ftype: 'groupingsummary',
				groupHeaderTpl: '{name}',
				hideGroupedHeader: true,
				enableGroupingMenu: false
			}],
			columns: theColumns
		});
		var tmpWidth = Ext.getBody().getViewSize().width - 50;
		var tmpHeight = Ext.getBody().getViewSize().height - 160;
		grid.setSize(tmpWidth, tmpHeight);
	};

	var loadMask = function (msg) {
		if (!msg) {
			msg = "One moment please, loading data...";
		}

		Ext.getBody().mask(msg, "x-mask-loading").setHeight(1000 + Ext.getBody().getHeight());
	}

	var unMask = function () {
		Ext.getBody().unmask();
	}

	if ("" !== PID) {
		loadMask("Loading Flowsheet Data");
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
					bodyPadding: "10",
					modal: true
				});
				bodyWin.show();
			}

			Ext.Ajax.request({
				scope : this,
				// url : "/NursingDoc/FlowsheetFields" + "/" + "FC7C048A-19C2-E111-A7F5-000C2935B86F",
				url : theDesignURI,
				success : function( response ){
					var theResponse = Ext.JSON.decode(response.responseText);
					var theFields = theResponse.records.Fields;
					var theColumns = theResponse.records.Columns;
					var dfltPos = theResponse.records.dfltPos;
					theColumns[0].locked = true;
					var aStore = makeStore(theFields, dfltPos, "-", "");
					makeGrid(aStore, theColumns);
				},

				failure : function(  ) {
					unMask();
					alert("Attempt to load latest treatment data failed.");
				}
			});
		});



		Ext.EventManager.onWindowResize(function () {
			var tmpWidth = Ext.getBody().getViewSize().width - 50;
			var tmpHeight = Ext.getBody().getViewSize().height - 160;
			var grid = Ext.getCmp("FlowsheetGrid");
			grid.setSize(tmpWidth, tmpHeight);
		});
	}
</script>
</body>
</html>