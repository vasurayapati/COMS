Ext.define('COMS.model.GenericLookupModel', {
	extend: 'Ext.data.Model',
	fields: [
		{ name: 'id', type: 'string'},
		{ name: 'name', type: 'string'},		// should this sometimes be "name" or "value"?
		{ name: 'description', type: 'string'},
		{ name: 'lookupid', type:'string'}
	],
	"proxy" : {
		"type" : "rest",
		"api" : {
			"read" : Ext.URLs.Lookups,
			"update" : Ext.URLs.Lookups,
			"destroy" : Ext.URLs.Lookups,
			"create" : Ext.URLs.Lookups
		},
		"reader" : {
			"type" : "json",
			"root" : "records",
			"successProperty" : "success",
			"messageProperty" : "message"
		}
	}
/**
	proxy: {
		type: 'rest',
		api: {
			read: Ext.URLs.Lookups
		},
		reader: {
			type: 'json',
			root : 'records',
			successProperty : 'success'
		}
	}
 **/
});