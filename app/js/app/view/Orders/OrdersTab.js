// create reusable renderer
Ext.util.Format.comboRenderer = function (combo) {
	return function (value) {
		var record = combo.findRecord(combo.valueField, value);
		return record ? record.get(combo.displayField) : combo.valueNotFoundText;
	};
};

// create the combo instance
var combo = new Ext.form.ComboBox({
	typeAhead: true,
	triggerAction: "all",
	lazyRender: true,
	queryMode: "local",
	store: {
		fields: [{
			name: "orderstatus"
		}],
		data: [{
				orderstatus: "Ordered"
			}, {
				orderstatus: "In-Coordination"
			}, {
				orderstatus: "Cleared"
			}, {
				orderstatus: "Finalized"
			}, {
				orderstatus: "Dispensed"
			}, {
				orderstatus: "Administered"
			}, {
				orderstatus: "Cancelled"
			}

		]
	},
	displayField: "orderstatus"
});


Ext.define("COMS.view.Orders.OrdersTab", {
	extend: "Ext.grid.Panel",
	alias: "widget.OrdersTab", // Any references to this view should be for an xtype : "OrdersTab"
	name: "Orders Tab",
	margin: "0 10 10 10",
	autoScroll: "y",
	columnLines: true,
	width: 970, // Not used
	viewConfig: {
		stripeRows: true,
		height: 655,
		forceFit: true
	},
	store: "OrdersStore", // Since this is now a Grid, we need to get the name of our store

	plugins: [
		Ext.create("Ext.grid.plugin.CellEditing", {
			clicksToEdit: 1
		})
	],

	selType: "cellmodel",

	columns: [{
		header: "Name",
		dataIndex: "Last_Name",
		// width: 180,
		flex: 1,
		sortable: true,
		align: "center"
	}, {
		header: "Patient",
		dataIndex: "patientID",
		width: 60,
		sortable: true,
		align: "center",
		hidden: true
	}, {
		header: "Template",
		dataIndex: "templateID",
		width: 80,
		sortable: false,
		align: "center",
		editor: new Ext.form.TextField(),
		hidden: true
	}, {
		header: "OrderID",
		dataIndex: "orderid",
		width: 80,
		sortable: false,
		align: "center",
		editor: new Ext.form.TextField(),
		hidden: true
	}, {
		header: "Admin<br/>Day",
		dataIndex: "adminDay",
		width: 40,
		sortable: true,
		align: "center"
	}, {
		header: "Admin Date",
		dataIndex: "adminDate",
		width: 70,
		sortable: true,
		align: "center",
		hidden: true
	}, {
		header: "Type",
		dataIndex: "type",
		// width: 75,
			flex: 3,
		sortable: false,
		align: "center"
	}, {
		header: "Drug",
		dataIndex: "drug",
		// width: 100,
		flex: 2,
		sortable: true,
		align: "center"
	}, {
		header: "Dosage",
		dataIndex: "dose",
		width: 50,
		sortable: false,
		align: "center"
	}, {
		header: "Units",
		dataIndex: "unit",
		width: 50,
		sortable: false,
		align: "center"
	}, {
		header: "Route",
		dataIndex: "route",
		width: 50,
		sortable: false,
		align: "center"
	}, {
		header: "Fluid/<br/>Volume",
		dataIndex: "fluidVol",
		width: 50,
		sortable: false,
		align: "center"
	}, {
		header: "Flow<br/>Rate",
		dataIndex: "flowRate",
		width: 40,
		sortable: false,
		align: "center"
	}, {
		header: "Instructions",
		dataIndex: "instructions",
		width: 120,
		sortable: false,
		align: "center"
	}, {
		header: "Order Status",
		dataIndex: "orderstatus",
		width: 90,
		sortable: true,
		align: "center",
		editor: combo
	}
	],
	buttons: [{
		text: "Refresh"
	}, {
		text: "Edit",
		disabled: true
	}, {
		text: "Update Records"
	}],
	buttonAlign: "left"
});