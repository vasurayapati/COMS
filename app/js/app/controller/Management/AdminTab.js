Ext.define('COMS.controller.Management.AdminTab', {
    extend : 'Ext.app.Controller',
    stores : [ 'LookupStore', "GlobalStore", "UsersStore", "ActiveWorkflowsStore", 'IVFluidType', 'MedDocs', 'DischargeInstruction', 'ClinicInfo', 'MedRisks', 'DiseaseStaging'],
    views : [ 
		'Management.AdminTab',
		'Management.AddLookups',
		'Management.SelectLookups',
		'Management.EditLookup',
		'Management.DeleteTemplate', 
		'Management.Globals',
		'Management.SelectGlobals',
		'Management.Users',
		'Management.ActiveWorkflows', 
		'Management.MedsNonRounded',
		'Management.RoundingRules',
		'Management.MedicationHolds',
		'Management.IV_Fluid_Types', 
		'Management.CheckCombo',
<<<<<<< HEAD
=======
		// 'Management.Meds',
>>>>>>> c9b7783a07de42db6a9bffa8044fb045a06334ca
		'Management.Buttons',
		'Management.MedicationDocumentation',
		'Management.ClinicInfo',
		'Management.DischargeInstructionManagement',
		'Management.MedRisks'
	],
    models : ['LookupTable','LookupTable_Templates', 'IVFluidType'],
    refs: [
    {
        ref: 'Lookup', 
        selector: 'AdminTab AddLookups'
    },
    {
        ref: 'LookupGrid', 
        selector: 'AdminTab AddLookups grid'
    },
    {
        ref: 'Globals', 
        selector: 'AdminTab Globals grid'
    },	
    {
        ref: 'MedsNonRounded', 
        selector: 'AdminTab MedsNonRounded grid'
    },	
    {
        ref: 'Users', 
        selector: 'AdminTab Users grid'
    },	
    {
        ref: 'ActiveWorkflows', 
        selector: 'AdminTab ActiveWorkflows grid'
    },	
    {
        ref: 'RemoveLookup', 
        selector: 'AdminTab AddLookups button[title=\"RemoveLookup\"]'
    }, 
    {
        ref: 'EditLookup', 
        selector: 'AdminTab AddLookups button[title=\"EditLookup\"]'
    },

    {
        ref: 'Template', 
        selector: 'AdminTab DeleteTemplate'
    },
    {
        ref: 'TemplateGrid', 
        selector: 'AdminTab DeleteTemplate grid'
    },
    {
        ref: 'RemoveTemplate', 
        selector: 'AdminTab DeleteTemplate button[title=\"RemoveTemplate\"]'
    },
    {
        ref: 'ShowAllTemplates', 
        selector: 'AdminTab DeleteTemplate button[title=\"AllTemplates"]'
    },
    {
        ref: 'RoundingRulesForm', 
        selector: 'form[title=\"Rounding Rules\"]'
    },
    {
        ref: 'RBRoundingRules', 
        selector: 'form[title=\"Rounding Rules\"] radiogroup'
    },

    {
        ref: 'MedHoldForm', 
        selector: 'form[title=\"Medication Holds\"]'
    },
    {
        ref: 'RBMedHold', 
        selector: 'form[title=\"Medication Holds\"] radiogroup'
    },
	{
		ref : "IVFluidTypesGrid",
		selector : "form [name=\"IV_FluidTypesList\"]"
	},
	{
		ref : "IV_FluidTypeMulti",
		selector : "form [name=\"IV_FluidTypeMulti\"]"
	},
	{
		ref : "IV_Medication",
		selector : "form [name=\"IV_Medication\"]"
	},

	/* Medication Documentation */
	{
		ref : "MedDocsGrid",
		selector : "MedicationDocumentation grid"
	},
	{
		ref : "InPatient_MedicationCombo",
		selector : "MedicationDocumentation [name=\"InPatient_Medication\"]"
	},
	{
		ref : "MedDocs_Field",
		selector : "MedicationDocumentation [name=\"Documentation\"]"
	},

	/* Discharge Instruction */
	{
		ref : "DischargeInstructionGrid",
		selector : "DischargeInstructionManagement grid"
	},
	{
		ref : "DischargeInstruction_Instruction",
		selector : "DischargeInstructionManagement [name=\"Label\"]"
	},
	{
		ref : "DischargeInstruction_Documentation",
		selector : "DischargeInstructionManagement [name=\"Details\"]"
	},

	/* Clinic Info */
	{
		ref : "ClinicInfoGrid",
		selector : "ClinicInfo grid"
	},
	{
		ref : "ClinicInfo_Label",
		selector : "ClinicInfo [name=\"Label\"]"
	},
	{
		ref : "ClinicInfo_Details",
		selector : "ClinicInfo [name=\"Details\"]"
	},


	/* Med Risks Info */
	{
		ref : "MedRisksGrid",
		selector : "MedRisks grid"
	},
	{
		ref : "MedRisks_Label",
		selector : "MedRisks [name=\"Label\"]"
	},
	{
		ref : "MedRisks_Details",
		selector : "MedRisks [name=\"Details\"]"
	}
    ],
    

    init: function() {
        wccConsoleLog('Initialized Admin Tab Panel Navigation Controller!');
        this.control({
            'form[title=\"Rounding Rules\"]' : {
                beforeshow : this.RoundingRulesFormRenderSetValues
            },
            'form[title=\"Medication Holds\"]' : {
                beforeshow : this.MedHoldFormRenderSetValues
            },
            'AddLookups SelectLookups' : {
                select : this.LookupSelected
            },
            'DeleteTemplate selDisease' : {
                select : this.TemplateSelected
            },
            'AddLookups button[action=save]' :{
                click : this.updateLookup
            },
            'AdminTab AddLookups grid' : {
                itemclick: this.enableEditLookup
            },
            'AdminTab Globals grid' : {
                itemclick: this.enableEditGlobal
            },
            'AdminTab DeleteTemplate grid' : {
                itemclick: this.enableRemoveTemplate
            },
            'AdminTab DeleteTemplate button[title=\"RemoveTemplate\"]': {
                click: this.removeTemplate
            },
            'AdminTab DeleteTemplate button[title=\"AllTemplates"]': {
                click: this.showAllTemplates
            },
            'AdminTab AddLookups button[title=\"RemoveLookup\"]': {
                click: this.removeLookup
            },
            'AdminTab AddLookups button[title=\"EditLookup\"]': {
                click: this.editLookup
            },
            'EditLookup button[action="save"]': {
                click: this.clickSaveLookup
            },
            'EditLookup button[action="cancel"]': {
                click: this.clickCancelLookup
            },

            "form[title=\"Medication Holds\"] button[text=\"Save\"]" : {
                click: this.clickMedHoldSave
            },
            "form[title=\"Medication Holds\"] button[text=\"Cancel\"]" : {
                click: this.clickMedHoldCancel
            },

            "form[title=\"Rounding Rules\"] button[text=\"Save\"]" : {
                click: this.clickRoundingRuleSave
            },
            "form[title=\"Rounding Rules\"] button[text=\"Cancel\"]" : {
                click: this.clickRoundingRuleCancel
            },


			"form [name=\"IV_FluidTypesList\"]" : {
				select: this.selectIVFluidTypeGridRow
			},
			"form[name=\"IV_Fluid_Types\"]" : {
				beforerender: this.FluidTypeLoadGrid
			},
			"form[name=\"IV_Fluid_Types\"] button[text=\"Cancel\"]" : {
				click: this.clickFluidTypeCancel
			},
			"form[name=\"IV_Fluid_Types\"] button[text=\"Save\"]" : {
				click: this.clickFluidTypeSave
			},

/* Medication Documentation */
			"MedicationDocumentation " : {
				beforerender: this.MedicationDocsLoadGrid
			},
			"MedicationDocumentation [name=\"DocumentedInPatientMedsList\"]" : {
					select: this.selectMedDocsGridRow
			},

			"MedicationDocumentation [name=\"InPatient_Medication\"]" : {
				change : this.selectMed
			},

			"MedicationDocumentation button[text=\"Cancel\"]" : {
				click: this.clickMedDocCancel
			},
			"MedicationDocumentation button[text=\"Save\"]" : {
				click: this.clickMedDocSave
			},
			"MedicationDocumentation button[text=\"Refresh\"]" : {
				click: this.MedicationDocsLoadGrid
			},


/* Discharge Instruction */
			"DischargeInstructionManagement" : {
				beforerender: this.DischargeInstructionLoadGrid
			},
			"DischargeInstructionManagement grid" : {
					select: this.selectDischargeInstructionGridRow
			},
			"DischargeInstructionManagement button[text=\"Cancel\"]" : {
				click: this.clickDischargeInstructionCancel
			},
			"DischargeInstructionManagement button[text=\"Save\"]" : {
				click: this.clickDischargeInstructionSave
			},
			"DischargeInstructionManagement button[text=\"Refresh\"]" : {
				click: this.DischargeInstructionLoadGrid
			},

/* Clinic Info */
			"ClinicInfo" : {
				beforerender: this.ClinicInfoLoadGrid
			},
			"ClinicInfo grid" : {
					select: this.selectClinicInfoGridRow
			},
			"ClinicInfo button[text=\"Cancel\"]" : {
				click: this.clickClinicInfoCancel
			},
			"ClinicInfo button[text=\"Save\"]" : {
				click: this.clickClinicInfoSave
			},
			"ClinicInfo button[text=\"Refresh\"]" : {
				click: this.ClinicInfoLoadGrid
			},

/* Med Risks */
			"MedRisks" : {
				beforerender: this.MedRisksLoadGrid
			},
			"MedRisks grid" : {
					select: this.selectMedRisksGridRow
			},
			"MedRisks button[text=\"Cancel\"]" : {
				click: this.clickMedRisksCancel
			},
			"MedRisks button[text=\"Save\"]" : {
				click: this.clickMedRisksSave
			},
			"MedRisks button[text=\"Refresh\"]" : {
				click: this.MedRisksLoadGrid
			}
		});
	},

	MedRisksLoadGrid : function(panel) {
		this.application.loadMask("Please wait; Loading Clinic Information");
		var theGrid = this.getMedRisksGrid();
		var theStore = theGrid.getStore();
		theStore.load();
		this.application.unMask();
		return true;
	},

	selectMedRisksGridRow : function(theRowModel, record, index, eOpts) {
		var recID = record.get("ID");
		var Label = record.get("Label");
		var Details = record.get("Details");

		this.CurrentMedRisksRecordID = recID;
		this.CurrentMedRisks = Label;

		var theLabelField = this.getMedRisks_Label();
		var theDetailsField = this.getMedRisks_Details();
		theLabelField.setValue(Label);
		theDetailsField.setValue(Details);
	},

	clickMedRisksCancel : function(theBtn, theEvent, eOpts) {
		theBtn.up('form').getForm().reset();
	},

	clickMedRisksSave : function(theBtn, theEvent, eOpts) {
		var form = theBtn.up('form').getForm();
		var theData = form.getValues(false, false, false, true);

		if (form.isValid()) {
			var Label = theData.Label;
			var Details = Ext.util.Format.htmlEncode(theData.Details);
			var recID = this.CurrentMedRisksRecordID;
			var URL = Ext.URLs.MedRisks;
			var CMD = "POST";
			if ("" !== recID && this.CurrentMedRisks === Label) {
				URL += "/" + recID;
				CMD = "PUT";
			}

			Ext.Ajax.request({
				url: URL,
				method : CMD,
				jsonData : {"Label" : Label, "Details" : Details },
				scope: this,
				success: function( response, opts ){
					var text = response.responseText;
					var resp = Ext.JSON.decode( text );
					this.CurrentMedRisksRecordID = "";
					this.CurrentMedRisks = "";
					var theLabelField = this.getMedRisks_Label();
					var theDetailsField = this.getMedRisks_Details();
					theLabelField.setValue("");
					theDetailsField.setValue("");

					if (!resp.success) {
						Ext.MessageBox.alert("Saving Error", "Site Configuration - Clinic Info, Save Error - " + resp.msg );
					}
					else {
						var thisCtl = this.getController("Management.AdminTab");
						var theGrid = thisCtl.getMedRisksGrid();
						theGrid.getStore().load();
					}
				},
				failure : function( response, opts ) {
					var text = response.responseText;
					var resp = Ext.JSON.decode( text );
					this.CurrentMedRisksRecordID = "";
					this.CurrentMedRisks = "";
					var theLabelField = this.getMedRisks_Label();
					var theDetailsField = this.getMedRisks_Details();
					theLabelField.setValue("");
					theDetailsField.setValue("");

					Ext.MessageBox.alert("Saving Error", "Saving Error", "Site Configuration - Clinic Info, Save Error - " + "e.message" + "<br />" + resp.msg );
				}
			});
		}
		else {
			var Msg = "";
			if ("" === theData.Label) {
				Msg += "<li>Missing Label Selection</li>";
			}
			if ("" === theData.Details) {
				Msg += "<li>Missing Details for Label</li>";
			}
			if ("" !== Msg) {
				Ext.MessageBox.alert('Invalid', 'Please fix the following errors:<ul>' + Msg + '</ul>');
			}
		}
	},


/************************************************************************************************************/

/** 
 * Clinic Info
 *
 * References:
 *		ClinicInfoGrid
 *		ClinicInfo_Label
 *		ClinicInfo_Details
 *
 **/
	ClinicInfoLoadGrid : function(panel) {
		this.application.loadMask("Please wait; Loading Clinic Information");
		var theGrid = this.getClinicInfoGrid();
		var theStore = theGrid.getStore();
		theStore.load();
		this.application.unMask();
		return true;
	},

	selectClinicInfoGridRow : function(theRowModel, record, index, eOpts) {
		var recID = record.get("ID");
		var Label = record.get("Label");
		var Details = record.get("Details");

		this.CurrentClinicInfoRecordID = recID;
		this.CurrentClinicInfo = Label;

		var theLabelField = this.getClinicInfo_Label();
		var theDetailsField = this.getClinicInfo_Details();
		theLabelField.setValue(Label);
		theDetailsField.setValue(Details);
	},

	clickClinicInfoCancel : function(theBtn, theEvent, eOpts) {
		theBtn.up('form').getForm().reset();
	},

	clickClinicInfoSave : function(theBtn, theEvent, eOpts) {
		var form = theBtn.up('form').getForm();
		var theData = form.getValues(false, false, false, true);

		if (form.isValid()) {
			var Label = theData.Label;
			var Details = Ext.util.Format.htmlEncode(theData.Details);
			var recID = this.CurrentClinicInfoRecordID;
			var URL = Ext.URLs.ClinicInfo;
			var CMD = "POST";
			if ("" !== recID && this.CurrentClinicInfo === Label) {
				URL += "/" + recID;
				CMD = "PUT";
			}

			Ext.Ajax.request({
				url: URL,
				method : CMD,
				jsonData : {"Label" : Label, "Details" : Details },
				scope: this,
				success: function( response, opts ){
					var text = response.responseText;
					var resp = Ext.JSON.decode( text );
					this.CurrentClinicInfoRecordID = "";
					this.CurrentClinicInfo = "";
					var theLabelField = this.getClinicInfo_Label();
					var theDetailsField = this.getClinicInfo_Details();
					theLabelField.setValue("");
					theDetailsField.setValue("");

					if (!resp.success) {
						Ext.MessageBox.alert("Saving Error", "Site Configuration - Clinic Info, Save Error - " + resp.msg );
					}
					else {
						var thisCtl = this.getController("Management.AdminTab");
						var theGrid = thisCtl.getClinicInfoGrid();
						theGrid.getStore().load();
					}
				},
				failure : function( response, opts ) {
					var text = response.responseText;
					var resp = Ext.JSON.decode( text );
					this.CurrentClinicInfoRecordID = "";
					this.CurrentClinicInfo = "";
					var theLabelField = this.getClinicInfo_Label();
					var theDetailsField = this.getClinicInfo_Details();
					theLabelField.setValue("");
					theDetailsField.setValue("");

					Ext.MessageBox.alert("Saving Error", "Saving Error", "Site Configuration - Clinic Info, Save Error - " + "e.message" + "<br />" + resp.msg );
				}
			});
		}
		else {
			var Msg = "";
			if ("" === theData.Label) {
				Msg += "<li>Missing Label Selection</li>";
			}
			if ("" === theData.Details) {
				Msg += "<li>Missing Details for Label</li>";
			}
			if ("" !== Msg) {
				Ext.MessageBox.alert('Invalid', 'Please fix the following errors:<ul>' + Msg + '</ul>');
			}
		}
	},



















/* Discharge Instruction */
	DischargeInstructionLoadGrid : function(panel) {
		this.application.loadMask("Please wait; Loading Discharge Instructions");
		var theGrid = this.getDischargeInstructionGrid();
		var theStore = theGrid.getStore();
		theStore.load();
		this.application.unMask();
		return true;
	},

	selectDischargeInstructionGridRow : function(theRowModel, record, index, eOpts) {
		var recID = record.get("ID");
		var Label = record.get("Label");
		var Details = record.get("Details");

		this.CurrentDischargeInstructionRecordID = recID;
		this.CurrentDischargeInstruction = Label;

		var theInstructionField = this.getDischargeInstruction_Instruction();
		var theDocsField = this.getDischargeInstruction_Documentation();
		theInstructionField.setValue(Label);
		theDocsField.setValue(Details);
	},

	clickDischargeInstructionCancel : function(theBtn, theEvent, eOpts) {
		theBtn.up('form').getForm().reset();
	},

	clickDischargeInstructionSave : function(theBtn, theEvent, eOpts) {
		var form = theBtn.up('form').getForm();
		var theData = form.getValues(false, false, false, true);

		if (form.isValid()) {
			var Label = theData.Label;
			var Details = Ext.util.Format.htmlEncode(theData.Details);
			var recID = this.CurrentDischargeInstructionRecordID;
			var URL = Ext.URLs.DischargeInstruction;
			var CMD = "POST";
			if ("" !== recID && this.CurrentDischargeInstruction === Label) {
				URL += "/" + recID;
				CMD = "PUT";
			}

			Ext.Ajax.request({
				url: URL,
				method : CMD,
				jsonData : {"Label" : Label, "Details" : Details },
				scope: this,
				success: function( response, opts ){
					var text = response.responseText;
					var resp = Ext.JSON.decode( text );
					this.CurrentDischargeInstructionRecordID = "";
					this.CurrentDischargeInstruction = "";
					var theInstructionField = this.getDischargeInstruction_Instruction();
					var theDocsField = this.getDischargeInstruction_Documentation();
					theInstructionField.setValue("");
					theDocsField.setValue("");

					if (!resp.success) {
						Ext.MessageBox.alert("Saving Error", "Site Configuration - Discharge Instruction, Save Error - " + resp.msg );
					}
					else {
						var thisCtl = this.getController("Management.AdminTab");
						var theGrid = thisCtl.getDischargeInstructionGrid();
						theGrid.getStore().load();
					}
				},
				failure : function( response, opts ) {
					var text = response.responseText;
					var resp = Ext.JSON.decode( text );
					this.CurrentDischargeInstructionRecordID = "";
					this.CurrentDischargeInstruction = "";
					var theInstructionField = this.getDischargeInstruction_Instruction();
					var theDocsField = this.getDischargeInstruction_Documentation();
					theInstructionField.setValue("");
					theDocsField.setValue("");

					Ext.MessageBox.alert("Saving Error", "Saving Error", "Site Configuration - Discharge Instruction, Save Error - " + "e.message" + "<br />" + resp.msg );
				}
			});
		}
		else {
			var Msg = "";
			var Docs = "";
			if (!theData.Label) {
				Msg += "<li>Missing Instruction Selection</li>";
			}
			if ("" === theData.Details) {
				Msg += "<li>Missing Documentation for Discharge Instruction</li>";
			}
			if ("" !== Msg) {
				Ext.MessageBox.alert('Invalid', 'Please fix the following errors:<ul>' + Msg + '</ul>');
			}
		}
	},

/* Medication Documentation */
	selectMed : function(theCombo, nValue, oValue, eOpts) {
		var theRTE = theCombo.up("form").down("htmleditor");
		theRTE.reset();
	},

	selectMedDocsGridRow : function(theRowModel, record, index, eOpts) {

		var recID = record.get("ID");
		var MedID = record.get("Med_ID");
		var MedName = record.get("MedName");
		var MedDocumentation = record.get("Documentation");


		var theMedField = this.getInPatient_MedicationCombo();
		var theDocsField = this.getMedDocs_Field();
		theMedField.setValue(MedID);
		theDocsField.setValue(MedDocumentation);
	},

	MedicationDocsLoadGrid : function (panel) {
		this.application.loadMask("Please wait; Loading Medication Documentation");
		var theGrid = this.getMedDocsGrid();
		var theStore = theGrid.getStore();
		theGrid.getStore().load();

		var theMedField = this.getInPatient_MedicationCombo();
		theMedField.getStore().load();

		this.application.unMask();
		return true;
	},

	clickMedDocSave : function(theBtn, theEvent, eOpts) {
			var form = theBtn.up('form').getForm();
			var theData = form.getValues(false, false, false, true);

			if (form.isValid()) {
				var InPatient_Medication = theData.InPatient_Medication;
				var Documentation = Ext.util.Format.htmlEncode(theData.Documentation);
				var URL = "LookUp/MedDocs/" +  InPatient_Medication;

				Ext.Ajax.request({
					url: URL,
					method : "POST",
					jsonData : { "Documentation" : Documentation },
					scope: this,
					success: function( response, opts ){
						var text = response.responseText;
						var resp = Ext.JSON.decode( text );
						if (!resp.success) {
							Ext.MessageBox.alert("Saving Error", "Site Configuration - Medications Documentation, Save Error - " + resp.msg );
						}
						else {
							var thisCtl = this.getController("Management.AdminTab");
							var theGrid = thisCtl.getMedDocsGrid();
							theGrid.getStore().load();
						}
					},
					failure : function( response, opts ) {
						var text = response.responseText;
						var resp = Ext.JSON.decode( text );
						Ext.MessageBox.alert("Saving Error", "Saving Error", "Site Configuration - Medications Documentation, Save Error - " + "e.message" + "<br />" + resp.msg );
					}
				});
			}
			else {
				var Msg = "";
				var Docs = "";
				if (!theData.InPatient_Medication) {
					Msg += "<li>Missing InPatient Medication Selection</li>";
				}
				if ("" === theData.Documentation) {
					Msg += "<li>Missing Documentation for InPatient Medication</li>";
				}
				if ("" !== Msg) {
					Ext.MessageBox.alert('Invalid', 'Please fix the following errors:<ul>' + Msg + '</ul>');
				}
			}
	},
	clickMedDocCancel : function() {
		theBtn.up('form').getForm().reset();
	},



	FluidTypeLoadGrid : function (panel) {
		this.application.loadMask("Please wait; Loading Fluid Types");
		var theGrid = this.getIVFluidTypesGrid();
		theGrid.getStore().load();

		var theMedField = this.getIV_Medication();
		theMedField.getStore().load();

		var theFluidTypeField = this.getIV_FluidTypeMulti();
		theFluidTypeField.getStore().load();
		this.application.unMask();
		return true;
	},

	selectIVFluidTypeGridRow : function(theRowModel, record, index, eOpts) {
		var Fluid = record.get("FluidType");
		var FluidID = record.get("FluidType_ID");
		var Med = record.get("MedName");
		var MedID = record.get("Med_ID");
		var theMedField = this.getIV_Medication();
		var theFluidTypeField = this.getIV_FluidTypeMulti();
		theMedField.setValue(MedID);
		theFluidTypeField.setValue(FluidID);
	},

	clickFluidTypeCancel : function ( theButton, eOpts) {
		theButton.up('form').getForm().reset();
	},

	clickFluidTypeSave : function ( theButton, eOpts) {
		var theForm = theButton.up('form').getForm();
		var thisCtl = this.getController("Management.AdminTab");

		if (theForm.isValid()) {
			var theData = theForm.getValues();
			Ext.Ajax.request({
				url: Ext.URLs.IVFluidType + theData.IV_Medication,
				method : "POST",
				jsonData : { "IV_FluidTypeMulti" : theData.IV_FluidTypeMulti },
				scope: this,
				success: function( response, opts ){
					var text = response.responseText;
					var resp = Ext.JSON.decode( text );
					if (!resp.success) {
						Ext.MessageBox.alert("Saving Error", "Site Configuration - Medications IV Fluid Type, Save Error - " + resp.msg );
					}
					else {
						var thisCtl = this.getController("Management.AdminTab");
						var theGrid = thisCtl.getIVFluidTypesGrid();
						theGrid.getStore().load();
					}
				},
				failure : function( response, opts ) {
					var text = response.responseText;
					var resp = Ext.JSON.decode( text );
					Ext.MessageBox.alert("Saving Error", "Saving Error", "Site Configuration - Medications IV Fluid Type, Save Error - " + "e.message" + "<br />" + resp.msg );
				}
			});
		}
		theForm.reset();
	},














	
	
	
	
	RoundingRulesFormRenderSetValues : function(scope, eOpts) {
        this.application.loadMask("Please wait; Loading Rounding Rules State");
        Ext.Ajax.request({
            url: Ext.URLs.RoundingRule,
            method: "GET",
            scope : this,
            success: function(response, opts) {
                var data = Ext.JSON.decode(response.responseText);
                var thisCtl = this.getController('Management.AdminTab');
                var rbGroup = thisCtl.getRBRoundingRules();
                rbGroup.setValue({"RoundingRule" : data.RoundingRule});
                this.application.unMask();
            },
            failure: function(response, opts) {
                wccConsoleLog('server-side failure with status code ' + response.status);
                this.application.unMask();
            }
        });
    },

    clickRoundingRuleSave: function() {
        var thisCtl = this.getController('Management.AdminTab');
        var rrButtons = thisCtl.getRBRoundingRules().getValue();
        var allowRounding = rrButtons.RoundingRule;
        this.application.loadMask("Please wait; Saving Rounding Rules State");
        this.application.SiteConfig.RoundingRule  = allowRounding;
        Ext.Ajax.request({
            url: Ext.URLs.RoundingRule,
            method: "POST",
            scope : this,
            jsonData : { "RoundingRule" : allowRounding },
            success: function(response, opts) {
                this.application.unMask();
            },
            failure: function(response, opts) {
                wccConsoleLog('server-side failure with status code ' + response.status);
                this.application.unMask();
            }
        });
    },

    clickRoundingRuleCancel: function(theBtn) {
        theBtn.up('form').getForm().reset();
    },

    MedHoldFormRenderSetValues : function(scope, eOpts) {
        this.application.loadMask("Please wait; Loading Medication Hold State");
        Ext.Ajax.request({
            url: Ext.URLs.MedHold,
            method: "GET",
            scope : this,
            success: function(response, opts) {
                var data = Ext.JSON.decode(response.responseText);
                var thisCtl = this.getController('Management.AdminTab');
                var rbGroup = thisCtl.getRBMedHold();
                var State = ("1" === data.MedHold);
                rbGroup.setValue({"AllowMedHolds" : State});
                this.application.unMask();
            },
            failure: function(response, opts) {
                wccConsoleLog('server-side failure with status code ' + response.status);
                this.application.unMask();
            }
        });
    },

    clickMedHoldSave: function() {
        var thisCtl = this.getController('Management.AdminTab');
        var mhButtons = thisCtl.getRBMedHold().getValue();
        var allowMedHold = mhButtons.AllowMedHolds;
        this.application.loadMask("Please wait; Saving Medication Hold State");
        this.application.SiteConfig.MedHold = allowMedHold;
        Ext.Ajax.request({
            url: Ext.URLs.MedHold,
            method: "POST",
            scope : this,
            jsonData : { "AllowMedHolds" : allowMedHold },
            success: function(response, opts) {
                this.application.unMask();
            },
            failure: function(response, opts) {
                wccConsoleLog('server-side failure with status code ' + response.status);
                this.application.unMask();
            }
        });
    },

    clickMedHoldCancel: function(theBtn) {
        theBtn.up('form').getForm().reset();
    },


    TemplateSelected: function(combo, recs, eOpts){
        wccConsoleLog('Admin Tab, Template Selected');
        var theData = recs[0].data.id;
        var thisCtl = this.getController('Management.AdminTab');
        var theStore = thisCtl.getTemplateGrid().getStore();
        var theURL = Ext.URLs.Templates + "/Cancer/" + theData;
        theStore.load({
            url:theURL
        });
            
    },
    showAllTemplates: function(combo, recs, eOpts){
        wccConsoleLog('Admin Tab, Template Selected');
        var thisCtl = this.getController('Management.AdminTab');
        var theStore = thisCtl.getTemplateGrid().getStore();
        theStore.removeAll();
        var theURL = Ext.URLs.Templates;
        theStore.load({
            url:theURL
        });
            
    },
    clickSaveLookup: function(button){
        var grid = Ext.ComponentQuery.query('AdminTab AddLookups grid')[0]; // Get's a specific existing instance of the widget by it's CSS style reference
        var store = grid.getStore();
        var win = button.up('window');
        var form = win.down('form');
        var values = form.getValues();

        var record = form.getRecord();
        var rowNum = store.indexOf(record);
        var existingRecord = null;

        if (this.getSelectedRecord(false, 'AdminTab AddLookups grid').hasRecord) {
            existingRecord = this.getSelectedRecord(false, 'AdminTab AddLookups grid').record;
        }
                
        if(existingRecord){
                    
            var lookupRecord = Ext.create(Ext.COMSModels.LookupTable, {
                lookupid: existingRecord.get('id'),
                value: values.name,
                description: values.description
            });

            lookupRecord.save({
                scope: this,
                waitMsg: 'Saving Data...',
                success: function (data) {
                    wccConsoleLog("Saved Lookup Type ID " + data.getId() + " lookupid " + data.data.lookupid);
                    var ref = Ext.create(Ext.COMSModels.GenericLookup, {
                        id: data.data.lookupid,
                        name: data.data.value,
                        description: data.data.description
                    });
                    if (-1 === rowNum) {
                        store.insert(0, ref);
                    } else {
                        store.removeAt(rowNum);
                        store.insert(rowNum, ref);
                    }
                    this.getRemoveLookup().disable();
                    this.getEditLookup().disable();
                    win.close();
                },
                failure: function (err) {

                    this.getRemoveLookup().disable();
                    this.getEditLookup().disable();
                    win.close();
                    Ext.MessageBox.alert('Invalid', 'This lookup already exists.');
                                    
                }
            });

        }


            
    },
    clickCancelLookup: function(button){
        var win = button.up('window');
        this.getRemoveLookup().disable();
        this.getEditLookup().disable();
        win.close();
    },
    // Used in both the Hydration and Refernce Grids
    getSelectedRecord: function (destroy, query) {
        var theGrid, theView, theSelModel, HasSelection = false, selRows, theRecord, theStore, theIndex, records;

        theGrid = Ext.ComponentQuery.query(query)[0];
        theView = theGrid.getView();
        theSelModel = theView.getSelectionModel();
        HasSelection = theSelModel.hasSelection();
        if (HasSelection) {
            selRows = theSelModel.getSelection();
            theRecord = selRows[0];
            records = selRows;
            theStore = theView.getStore();
            theIndex = theStore.indexOf(theRecord);
            if (destroy) {
                theStore.removeAt(theIndex);
                return {};
            }
        }
        return {
            hasRecord: HasSelection,
            record: theRecord,
            rowNum: theIndex,
            multiRecord: records
        };
    },

        
    enableEditLookup : function(grid, record){
        this.getRemoveLookup().enable();
        this.getEditLookup().enable();
    },

    enableGlobalLookup : function(grid, record){
        this.getRemoveLookup().enable();
        this.getEditLookup().enable();
    },
	
    enableRemoveTemplate : function(grid, record){
        this.getRemoveTemplate().enable();
    },
        
    removeLookup : function(button){
        var ckRec = this.getSelectedRecord(false, 'AdminTab AddLookups grid');
        if (ckRec.hasRecord) {
            wccConsoleLog('Remove Lookup - ' + ckRec.record.get('id') + ' - ' + ckRec.record.get('name') + ' - ' + ckRec.record.get('description'));
            var reference = Ext.create(Ext.COMSModels.LookupTable, {
                value: ckRec.record.get('name'),
                description: ckRec.record.get('description'),
                lookupid: ckRec.record.get('id')
            });

            reference.destroy({
                scope: this,
                success: function (data) {
                    this.getSelectedRecord(true, 'AdminTab AddLookups grid'); // remove the selected record from the current store
                    this.getRemoveLookup().disable();
                    this.getEditLookup().disable();
                }
            });
        } else {
            Ext.MessageBox.alert('Invalid', 'Please select a Row in the References Grid.');
        }
            
    },
    removeTemplate : function(button){
        var ckRec = this.getSelectedRecord(false, 'AdminTab DeleteTemplate grid');
		var mytemplate;
        if (ckRec.hasRecord) {
            var adminCtl = this.getController("Management.AdminTab");

            if(ckRec.multiRecord.length > 1){
                wccConsoleLog('Remove Template - ' + ckRec.multiRecord[0].get('id') + ' - ' + ckRec.multiRecord[0].get('description'));
                mytemplate = Ext.create(Ext.COMSModels.Templates, {
                    id: ckRec.multiRecord[0].get('id'),
                    description: ckRec.multiRecord[0].get('description'),
                    force: 'false'
                });

                Ext.MessageBox.show({
                    title: 'Information',
                    msg: 'You are about to delete template: '+ ckRec.record.get('description') + '. Would you like to delete it and remove all references?',
                    width:300,
                    buttons: Ext.MessageBox.OKCANCEL,
                    fn: function(buttonId){
                        if('ok'==buttonId){
                            adminCtl.deleteTemplateCall(mytemplate,ckRec);
                        }
                    }
                });
                
            }else{
                wccConsoleLog('Remove Template - ' + ckRec.record.get('id') + ' - ' + ckRec.record.get('description'));
                mytemplate = Ext.create(Ext.COMSModels.Templates, {
                    id: ckRec.record.get('id'),
                    description: ckRec.record.get('description'),
                    force: 'false'
                });
                
                Ext.MessageBox.show({
                    title: 'Information',
                    msg: 'You are about to delete template: '+ ckRec.record.get('description') + '. Would you like to delete it and remove all references?',
                    width:300,
                    buttons: Ext.MessageBox.OKCANCEL,
                    fn: function(buttonId){
                        if('ok'==buttonId){
                            adminCtl.deleteTemplateCall(mytemplate,ckRec);
                        }
                    }
                });
                
            }
            
        } 
            
    },
    
    deleteTemplateCall: function(mytemplate,ckRec){
        mytemplate.destroy({
            scope: this,
            success: function (record, op) {
                this.getSelectedRecord(true, 'AdminTab DeleteTemplate grid'); // remove the selected record from the current store
                this.getRemoveTemplate().disable();
                var adminCtl = this.getController("Management.AdminTab");
                //Ext.MessageBox.alert('Success', 'Template ' + ckRec.record.get('description') + ' was deleted from the system.');
                Ext.MessageBox.show({
                    title: 'Success',
                    msg:  'Template ' + ckRec.record.get('description') + ' was deleted from the system.',
                    width:300,
                    buttons: Ext.MessageBox.OK,
                    fn: function(buttonId){
                        if('ok'==buttonId){
                            adminCtl.removeTemplate();
                            
                        }
                    }
                });
                
            },
            failure: function (record, op) {
                wccConsoleLog("Delete Template Failed");
                this.getRemoveTemplate().disable();
                this.application.unMask();
                var adminCtl = this.getController("Management.AdminTab");
                Ext.MessageBox.show({
                    title: 'Information',
                    msg: 'Template was not deleted: ' + op.request.scope.reader.jsonData.frameworkErr + '. Would you like to delete it and remove all references?',
                    width:300,
                    buttons: Ext.MessageBox.OKCANCEL,
                    fn: function(buttonId){
                        if('ok'==buttonId){
                            mytemplate.data.force = 'true';
                            adminCtl.deleteTemplateCall(mytemplate,ckRec);
                        }
                    }
                });

                //Ext.MessageBox.alert('Failure', 'Template was not deleted: ' + op.request.scope.reader.jsonData["frameworkErr"]);
            }
        });
        
    },
        
    editLookup : function(button){
        var ckRec = this.getSelectedRecord(false, 'AdminTab grid');
        if (ckRec.hasRecord) {
            wccConsoleLog('Editing Lookup - ' + ckRec.record.get('id') + ' - ' + ckRec.record.get('name') + ' - ' + ckRec.record.get('description'));
            var view = Ext.widget('EditLookup'); // Creates an instance of the "Add Reference" pop-up window
            view.down('form').loadRecord(ckRec.record);
        } else {
            Ext.MessageBox.alert('Invalid', 'Please select a Row in the Lookup Grid.');
        }
    },
    // Load the grid's store to see all the values for the selected type
    LookupSelected : function ( combo, recs, eOpts ) {
        wccConsoleLog('Admin Tab, Lookup Selected');
        var theData = recs[0].data.value;
        var thisCtl = this.getController('Management.AdminTab');
        var theStore = thisCtl.getLookupGrid().getStore();
        var theURL = Ext.URLs.BaseView + "/" + theData;
        theStore.load({
            url:theURL
        });
    },

    updateLookup: function(button){
        wccConsoleLog('clicked Save button');
        var grid = Ext.ComponentQuery.query('AdminTab grid')[0]; // Get's a specific existing instance of the widget by it's CSS style reference
        var store = grid.getStore();

        var form = button.up('form');
            
        var values = form.form.getValues();
            
            
        var lookupRecord = Ext.create('COMS.model.LookupTable', {
            id: values.id,
            value: values.value,
            description: values.description
        });

        lookupRecord.save({
            scope : this,
            waitMsg : 'Saving Data...',
            success: function(data) {
                wccConsoleLog("Saved Lookup Type ID "+ data.getId() + " name " + data.data.value + " lookupid " + data.data.lookupid);
                    
                var ref = Ext.create(Ext.COMSModels.GenericLookup, {
                    id: data.data.lookupid,
                    name: data.data.value,
                    description: data.data.description
                });

                store.insert(0, ref);
                    
                var thisCtl = this.getController('Management.AdminTab');
                var addLookups = thisCtl.getLookup();
                addLookups.form.findField('value').setValue('');
                addLookups.form.findField('id').setValue('');
                addLookups.form.findField('description').setValue('');
            },
            failure: function(err){
                Ext.MessageBox.alert('Invalid', 'This reference already exists.');
            }
        });
            
    }
});
