Ext.define("COMS.controller.NewPlan.OEM", {
	extend: "Ext.app.Controller",

	stores: [
		"Templates"
	],


	views: [
		"NewPlan.OEM",
		"NewPlan.CTOS.OEMGoal",
		"NewPlan.CTOS.OEMPerformanceStatus",

		"NewPlan.CTOS.OEM_Edit"
	],

	refs: [
		{
			ref: "MyTemplates",
			selector: "NewPlanTab PatientInfo OEM selAppliedTemplate"
		},
		{
			ref: "dspOEMTemplateData",
			selector: "NewPlanTab PatientInfo OEM dspOEMTemplateData"
		},
		{
			ref: "OEMTab",
			selector: "NewPlanTab PatientInfo OEM"
		},
		{
			ref: "CTOS_Tabs",
			selector: "NewPlanTab CTOS"
		},
		{
			ref: "CTOSTab",
			selector: "NewPlanTab CTOS [title=\"Chemotherapy Template Order Source\"]"
		},
		{
			ref: "OEM_Help",
			selector: "NewPlanTab OEM [name=\"Help\"]"
		},

		{
			ref: "OEM_Level1",
			selector : "OEM container[name=\"OEM_Level1\"]"
		},

		{
			ref: "SelectAdminDay2View",
			selector : "OEM combo[name=\"SelectAdminDay2View\"]"
		},
	{
			ref : "GoalBtn",
			selector : "OEM OEM_Level1 [name=\"AddGoal\"]"
	}
	],

	init: function () {
		wccConsoleLog("Initialized OEM Tab Controller!");

		this.application.on( { TemplateSelected : this.TemplateSelected, scope : this } );
		this.application.on( { DisplayOEMData : this.displayOEM_Record_Data, scope : this } );	// Display the OEM Record Data - Pass Record Data
		this.application.on( { PatientSelected : this.PatientSelected, scope : this } );

		this.control({
			"NewPlanTab PatientInfo OEM selAppliedTemplate": {
				select: this.selTemplateChange,
				beforequery: this.selTemplateQuery
			},
			"NewPlanTab PatientInfo OEM" : {
				beforeactivate : this.BeforeTabActivated
			},
			"OEM combo[name=\"SelectAdminDay2View\"]" : {
				select : this.selAdminDayChange
			},
			"OEM dspOEMTemplateData" : {
				afterrender : this.tabRendered
			}
		});
	},

	// Determines if the date passed is an Admin Day for this Regimen
	// If the date passed is an Admin Day then the OEM Data for that day is returned
	// else returns null.
	theDate_Cycle : "",
	theDate_Dat : "",
	IsDayAnAdminDay : function( theDate ) {
		var j, theData, dataLen, thePatient, AdminDay, dayData;
		try {
			thePatient = this.application.Patient;
			if (thePatient.OEMRecords) {
				theData = thePatient.OEMRecords.OEMRecords;
				dataLen = theData.length;
				for (j = 0; j < dataLen; j++) {
					dayData = theData[j];
					AdminDay = theData[j].AdminDate;
					if (theDate === AdminDay) {
						return theData[j];
					}
				}
			}
		}
		catch (e) {
		}
		return null;
	},


	tabRendered : function( theTab ) {
		// console.log("OEM tabRendered 0 Adding Event Handlers");
		var a1 = theTab.el.select("button.EditOEM_Record");
		a1.on("click", this.handleEditOEM_Record, this);

		a1 = theTab.el.select("button.OEM_RecordMedHold");
		a1.on("click", this.handleOEM_RecordMedHold, this);

		a1 = theTab.el.select("button.OEM_RecordMedCancel");
		a1.on("click", this.handleOEM_RecordMedCancel, this);

		a1 = theTab.el.select("button.ChangeOEM_AdminDate");
		a1.on("click", this.HandleChangeAdminDateButtons, this);

		var OEMLevel1 = this.getOEM_Level1();
		var OEMLevel1Btns = OEMLevel1.el.select("button");		// MWB - 6/26/2012 - Currently only the "Edit Performance Status" button exists in this section
		OEMLevel1Btns.on("click", this.HandleOEMLevel1Buttons, this);

		var dspOEMTemplateData = this.getDspOEMTemplateData();
		var OEMTemplateDataBtns = dspOEMTemplateData.el.select("button.dspOEMDoseCalcs");
		OEMTemplateDataBtns.on("click", this.HandleOEMCalcDoseButtons, this);


		// When rendering the tab, if today is an Admin Day then show today's OEM Records, else show all the OEM Records.
		var LinkName, Elements, theElement, theID, tmpData = this.IsDayAnAdminDay( Ext.Date.format( new Date(), "m/d/Y") );
		if (null !== tmpData) {
			var i;
			LinkName = "Section_Cycle_" + tmpData.Cycle + "_Day_" + tmpData.Day;
			Elements = Ext.query(".OEMRecord");
			for (i = 0; i < Elements.length; i++) {
				theElement = Elements[i];
				theID = theElement.id;
				if (theID === LinkName) {
					theElement.style.display="";
				}
				else {
					theElement.style.display="none";
				}
			}
		}
	},
/***********************************************************************************
 *
 *
 *
 *
 ***********************************************************************************/
	displayOEM_Record_Data : function( PatientInfo ) {

		var theData = PatientInfo.OEMRecords;		// MWB - 6/21/2012 - Set, this.application.Patient.OEMRecords.PerformanceStatus <=== new string and "PatientInfo" is the standard this.application.Patient
		var OEMLevel1, i, j, ComboStore, ComboStoreIndex = 0, Record, dspOEMTemplateData, AdminDay2ViewCombo;

		if (PatientInfo.OEMDataRendered) {
			return;
		}
			// display the overall data for the template
        theData.TreatmentStart = PatientInfo.TreatmentStart;
        theData.TreatmentEnd = PatientInfo.TreatmentEnd;

        if (!theData.SiteConfig) {		// Make sure we only add this once.
            theData.SiteConfig = this.application.SiteConfig;
        }

        if (!theData.Patient) {		// Make sure we only add this once.
            // Some date from within the Patient object (e.g. BSA Info and some vitals) are needed for calculating dosages
            // but since the applications scope from within an xTemplate is not available this is a simple way to get the data there
            // we should be able to delete the Patient object from theData object at somepoint after the OEM Data has been rendered.
            theData.Patient = PatientInfo;		// MWB - 5/30/2012 - Does this permanently add the PatientInfo to theData record?
        }

        OEMLevel1 = this.getOEM_Level1();
        OEMLevel1.update(theData);
        OEMLevel1.show();



        AdminDay2ViewCombo = this.getSelectAdminDay2View();
        ComboStore = AdminDay2ViewCombo.getStore();
        ComboStore.removeAll();
        Record = { date : "Show All", LinkName : "Cycle_0_Day_0" };
        ComboStore.insert(ComboStoreIndex++, Record);

        if (!theData.OEMRecords) {
            // Apparently we get here when attempting to save a specific OEM Record.
            alert("OEM REcords is missing in OEM Controller...");
        }

        var DataRecords = theData.OEMRecords;
        var dRecordsLen = DataRecords.length;
        for (j = 0; j < dRecordsLen; j++) {
            Record = { date : DataRecords[j].AdminDate, LinkName : ("Cycle_" + DataRecords[j].Cycle + "_Day_" + (DataRecords[j].Day)) };
            ComboStore.insert(ComboStoreIndex++, Record);
        }
        AdminDay2ViewCombo.show();



			// display the data for each day in each cycle.
		dspOEMTemplateData = this.getDspOEMTemplateData();
		dspOEMTemplateData.update( theData );
		dspOEMTemplateData.show();
		this.application.Patient.OEMDataRendered = true;
	},
/***********************************************************************************
 *
 *
 *
 *
 ***********************************************************************************/





/***********************************************************************************
 *
 *	Called when the "selAdminDayChange" event is triggered from the List of Administration Days drop down 
 *	to display a particular OEM Record for a particular Administration Day
 *
 ***********************************************************************************/
	hideAllAdminDays : function() {
		var Elements = Ext.query(".OEMRecord");
		var ElLen = Elements.length;
		var i, theElement, theID;

		for (i = 0; i < ElLen; i++) {
			theElement = Elements[i];
			theElement.style.display="none";
		}
	},
	showAllAdminDays : function() {
		var Elements = Ext.query(".OEMRecord");
		var ElLen = Elements.length;
		var i, theElement, theID;

		for (i = 0; i < ElLen; i++) {
			theElement = Elements[i];
			theElement.style.display="block";
		}
	},
	selAdminDayChange : function(combo, recs, eOpts) {
		var thisCtl = this.getController("NewPlan.OEM");
		var Elements = Ext.query(".OEMRecord");
		var ElLen = Elements.length;
		var theData = recs[0];

		thisCtl = this.getController("NewPlan.OEM");
		var dspDate = theData.data.date;
		var LinkName = theData.data.LinkName;
		Elements = Ext.query(".OEMRecord");
		ElLen = Elements.length;
		var i;
		var theElement;
		var tmpName;
		var theID;

		if ("Cycle_0_Day_0" === LinkName) {
			this.showAllAdminDays();
		}
		else {
			tmpName = "Section_" + LinkName;
			this.hideAllAdminDays();
			for (i = 0; i < ElLen; i++) {
				theElement = Elements[i];
				theID = theElement.id;
				if (theID === tmpName) {
					theElement.style.display="block";
				}
			}
		}
	},


/***********************************************************************************
 *
 *	Called when the "selAdminDayChange" event is triggered from the List of Administration Days drop down 
 *	to display a particular OEM Record for a particular Administration Day
 *
 ***********************************************************************************/
	HandleOEMCalcDoseButtons : function (evt, aBtn) {
		// button attributes
		// title = "Show Dosage Calculation"
		// name = "dspOEMDoseCalcs"

		// dose = The dose being administered
		// units = The units
		// calcDose = The calculated (aka BSA/KG/AUC) Dose
		// doseunits = The Units for the dose to be administered (e.g. mg/m2)

		// class = "anchor" <- Not needed
		// id = the element id, Not needed
		var btnTitle = aBtn.getAttribute("title");
		var dose, units, calcDose, doseUnits, PatientData, Patient = this.application.Patient;

		if ("Show Dosage Calculation" === btnTitle) {
			calcDose = aBtn.getAttribute("calcDose");

			var t1 = aBtn.getAttribute("doseunits");
			var t2 = t1.split("/");
			if ("m2" === t2[1]) {
				t2[1] = "m<sup>2</sup>";
			}
			dose = aBtn.getAttribute("dose") + " " + t2.join("/");
			PatientData = Ext.ShowBSACalcs(Patient, false, dose, calcDose);
			var title = "Body Surface Area Calculations";
			if (dose.search("AUC") >= 0) {
				title = "AUC Dosage Calculations";
			}

			Ext.MessageBox.show({
				title : title,
				msg : PatientData,
				buttons : Ext.MessageBox.OK
			});

		}
	},

	/**********************
	 *
	 *	Called when the user clicks on the OEM tab.
	 *	If the current patient has a template applied to them then the tab will display
	 *	And render the currently applied template.
	 *	Makes use of functionality also in the "TemplateSelected" method below.
	 *
	 **********************/
	TabActivated : false,


	HandleChangeAdminDateButtons : function( event, element ) {
		var ChangeAdminDate = Ext.widget("puWinChangeAdminDate");
		var AdminDate = element.getAttribute("admindate");
		var thisCtl = this.getController("Common.puWinChangeAdminDate");
		thisCtl.initializeCurAdminDate(AdminDate);
	},


/***********************************************************************************
 *
 *
 ***********************************************************************************/
    procPerfStatStoreRecords: function (records, operation, success) {
        var i, len, record, patientIsDead = '5', itemsInGroup = [];	// new Array();
        len = records.length;
        for (i = 0; i < len; i++) {
            record = records[i];
            if(patientIsDead === record.data.value){
                // console.log("procPerfStatStoreRecords - He's Dead Jim");
                break;
            }
            itemsInGroup.push({
                boxLabel : record.data.value + ' - ' + record.data.description,
                name : 'PerfStatus',
                inputValue : record.data.id,
                width : 360
            });
        }

        var Widget = "OEMPerformanceStatus";
        var Query = "OEMPerformanceStatus button[text=\"Save\"]";
        var params = {"itemsInGroup": itemsInGroup};
        var Win = Ext.widget(Widget, params);
        var SaveBtn = Ext.ComponentQuery.query(Query)[0];
        SaveBtn.on("click", this.SaveOEM_PS, this );
    }, 

	HandleOEMLevel1Buttons : function (event, element) {
		event.stopEvent( );
		var BtnName = element.getAttribute("name");
		var Win, SaveBtn, Widget, Query, params;

		switch(BtnName) {
			case "EditPerformanceStatus" : 
                var myStore = this.getStore('PerfStatStore');
                myStore.load({ scope: this, callback: this.procPerfStatStoreRecords });
                break;

            case "AddClinicalTrial" :
                alert("Add Clinical Trial - Not Currently Available - (NewPlan\\OEM)");
                Widget = "OEMClinicalTrial";
                Query = "OEMClinicalTrial button[text=\"Save\"]";
                params = null;
                Win = Ext.widget(Widget, params);
                SaveBtn = Ext.ComponentQuery.query(Query)[0];
                SaveBtn.on("click", this.SaveOEM_PS, this );
                break;
            case "AddGoal" : 
                alert("Add Goal - Not Currently Available - (NewPlan\\OEM)");
                Widget = "OEMGoal";
                Query = "OEMGoal button[text=\"Save\"]";
                params = null;
                Win = Ext.widget(Widget, params);
                SaveBtn = Ext.ComponentQuery.query(Query)[0];
                SaveBtn.on("click", this.SaveOEM_PS, this );
                break;
        }
    },

/***********************************************************************************
 *
 *
 ***********************************************************************************/
	SaveOEM_PS : function(button, event, eOpts) {
		var PatientInfo = this.application.Patient;
		var win = button.up("window");
		var form = win.down("form");
		var PSID = form.getValues().PerfStatus;

		var NewPS;
		var myStore = this.getStore('PerfStatStore');
        myStore.each( function(record){
			if (PSID === record.data.id) {
				NewPS = record.data.value + ' - ' + record.data.description;
			}
        });
		this.application.NewPerformanceStatus = NewPS;
		var rec = Ext.create(Ext.COMSModels.Vitals, {
			"PatientID" : PatientInfo.id,
			"PS_ID" : PSID
		});
		rec.save(
			{ 
				scope : this, 
				callback : function(rec, oper) {
					if (oper.success) {
					    var newPlanTabCtl = this.getController("NewPlan.NewPlanTab");
						newPlanTabCtl.loadVitals("Update Vitals");
						this.application.Patient.OEMRecords.PerformanceStatus = this.application.NewPerformanceStatus;
						var thisCtl = this.getController("NewPlan.OEM");
						var OEMLevel1 = thisCtl.getOEM_Level1();
						OEMLevel1.update(this.application.Patient.OEMRecords);
					}
					else {
						Ext.MessageBox.alert("Saving Error", "Performance State, Save Error - " + oper.error);
					}
				}
			}
		);

		win.close();
	},


/***********************************************************************************
 *
 *
 ***********************************************************************************/
	BeforeTabActivated : function(thePanel, eOpts) {
		var PatientInfo = this.application.Patient;

		var retFlg = true;
		if ("" === PatientInfo.TemplateID) {
			alert("No Template has been applied to this patient\nTab will not display");
			this.getCTOS_Tabs().setActiveTab( 0 );
			retFlg = false;
		} else if (!PatientInfo.BSA_Method) {
			alert("You must enter/select a Body Surface Area by clicking on the \"Calculate Body Surface Area\" link above.\nTab will not display");
			this.getCTOS_Tabs().setActiveTab( 0 );
			retFlg = false;
		}
		if (retFlg) {
			var templateObj = {};
			templateObj.name = PatientInfo.TemplateName;
			templateObj.id = PatientInfo.TemplateID;
			templateObj.description = PatientInfo.TemplateDescription;
			this.TabActivated = true;
			this.getAndRenderTemplateData (templateObj);
			this.TabActivated = false;
		}
		return retFlg;
	},

	/**********************
	 *
	 *	Event called by clicking on one of the links in the List of Patient's Templates
	 *	Then activates the "OEM" Tab and renders the selected template there.
	 *
	 **********************/
	TemplateSelected : function( opts, arg2) {
		var theTab = opts.tabType;
		var templateObj = {};
		templateObj.name = opts.templateName;
		templateObj.id = opts.templateID;
		templateObj.description = "";
		var tab2Show;

		if ("OEM" === theTab) {
			var PatientInfo = this.application.Patient;
			if (!PatientInfo.BSA_Method) {
				alert("Body Surface Area is NOT available\nClick on the \"Calculate Body Surface Area\" link below to calculate the Body Surface Area to be used for Dosing");
				return;
			}
			if ("Manual Entry" === PatientInfo.BSA_Method && "" === PatientInfo.BSA) {
				alert("Body Surface Area is NOT available\nPlease enter a \"Capped BSA Value\" below to calculate the Body Surface Area to be used for Dosing");
				return;
			}
			tab2Show = this.getOEMTab();
			this.getAndRenderTemplateData (templateObj);
		}
		else if ("CTOS" === theTab) {
			tab2Show = this.getCTOSTab();
		}

		this.getCTOS_Tabs().setActiveTab( tab2Show );


	},


	/**********************
	 *
	 *	Called when the "PatientSelected" event is triggered from the top of the NewTab Panel Select Patient drop down
	 *	This adjusts the values in the "Select Applied Template" drop down based on the selected user
	 *	This will eventually be eliminated as we will not use a drop down to select the Template.
	 *	A list of applied templates links will do this process
	 *
	 **********************/
	PatientSelected: function (combo, recs, eOpts) {
		wccConsoleLog("OEM Tab - Patient Selected has changed");
		var tpl = new Ext.XTemplate("");
		var dspOEMTemplateData = this.getDspOEMTemplateData();
		try {
			var theEl = dspOEMTemplateData.getEl();
			if (theEl) {
				tpl.overwrite(theEl, {});
				var templateModel = this.getModel("LookupTable_Templates");
				templateModel.proxy.url = Ext.URLs.Templates + "/Patient/" + this.application.Patient.id;
				var TemplateSelector = this.getMyTemplates();
				TemplateSelector.getStore().removeAll(); // clear out the store for the combo
				TemplateSelector.reset();
			}

		} catch (e) {
		}


		if (this.application.Patient.TemplateID) {
			this.application.Patient.OEMDataRendered = false;
		}
	
		this.getCTOS_Tabs().setActiveTab( this.getCTOSTab() );		// Force the "CTOS" tab to be opened when changing a patient
	},


	/**********************
	 *
	 *	Called when the user selects an applied template
	 *	This will eventually be eliminated as we will not use a drop down to select the Template.
	 *	A list of applied templates links will do this process
	 *
	 **********************/
	selTemplateQuery: function (qe) {
		if ("" === qe.combo.lastValue) {
			delete qe.combo.lastQuery;
		}
		var templateModel = this.getModel("LookupTable_Templates");
		templateModel.proxy.url = Ext.URLs.Templates + "/Patient/" + this.application.Patient.id;
	},










/***********************************************************************************
 *
 *
 ***********************************************************************************/
	getAndRenderTemplateData: function(TemplateObj) {
		if (!this.application.TempMedRecord) {
			this.application.TempMedRecord = this.getModel(Ext.COMSModels.Edit_OEMRecord);
		}
		wccConsoleLog("Template applied to patient has been selected");
		if (!this.TabActivated) {
			return;
		}

		var PatientInfo = this.application.Patient;
		if (PatientInfo.OEMRecords) {
			this.displayOEM_Record_Data (PatientInfo);
		}
		else {
			this.application.Patient.Template = TemplateObj;

			var NewPlanTabCtl = this.getController("NewPlan.NewPlanTab");
			NewPlanTabCtl.loadOrderRecords();
		}
	},

/**********************************************************************************************
 *
 *
 *
 *
 **********************************************************************************************/
    handleOEM_RecordMedCancel : function( event, element) {
        event.stopEvent(  );
        var dlgMsg, dlgTitle, newStat;
            dlgTitle = "Cancel Medication - ";
            dlgMsg = "Cancel medication for this date only or all future Administration dates";
            newStat = "Cancel";
/*******************************************************************/
        Ext.Msg.show({
            title: dlgTitle + element.getAttribute("med"),
            msg: dlgMsg,
            buttonText: {
                yes: 'This date Only', no: 'All Future', cancel: 'Cancel'
            },
            scope:this,
            status: newStat,
            buttons: Ext.Msg.YESNOCANCEL,
            el : element,
            fn: function(btnID, txt, opt) {
                var matchRecord, matchMed, matchMedID, DrugSection, ridx, record, PREbtnID, TbtnID, POSTbtnID;
                var Data = this.application.Patient.OEMRecords;
                var records = Data.OEMRecords;
                var TherapyID;
                var idx = opt.el.getAttribute("typeidx");
                idx--;
                record = records[idx];

                var type = opt.el.getAttribute("type");
                var medIdx = opt.el.getAttribute("medidx");
                if ("Pre" === type) {
                    DrugSection = record.PreTherapy;
                }
                else if ("Pos" === type || "Post" === type) {
                    DrugSection = record.PostTherapy;
                }
                else {
                    DrugSection = record.Therapy;
                }
                if (DrugSection.length > 0) {
                    matchRecord = DrugSection[medIdx-1];
                    // matchMed = matchRecord.Med;
                    matchMedID = matchRecord.MedID;
                    TherapyID = matchRecord.id;
                }

                if ("cancel" === btnID) {
					if("Clear" == opt.status) {
						Ext.MessageBox.alert("Cancel Medication", "Release Hold of - " + opt.el.getAttribute("med") + " has been cancelled");
					}
					else {
						Ext.MessageBox.alert("Cancel Medication", opt.status + " Medication - " + opt.el.getAttribute("med") + " has been cancelled");
					}
                }
                else {
                    if ("This date Only" === opt.buttonText[btnID]) {
                        ridx = idx;
                        this.HoldSingleMedRecord(records, type, ridx, medIdx, opt.status, matchMedID, TherapyID);
                    }
                    else if ("All Future" === opt.buttonText[btnID]) {
                        for (ridx = idx; ridx < records.length; ridx++ ) {
                            this.HoldSingleMedRecord(records, type, ridx, medIdx, opt.status, matchMedID, TherapyID);
                        }
                    }
                }
            }
        });
/*******************************************************************/
    },

/**********************************************************************************************
 *
 *
 *
 *
 **********************************************************************************************/
HoldSingleMedRecord : function(records, type, ridx, medIdx, nStatus, matchMedID, TherapyID) {
    var i, MedList, matchingRecord, tempMedRecord, aRecord, PID, record = records[ridx];
    this.application.loadMask("Setting Hold/Cancel Status");
    PID = this.application.Patient.id;
    var Type = "Therapy";
    if ("Pre" === type) {
        Type = "Pre";
    }
    else if ("Pos" === type || "Post" === type) {
        Type = "Post";
    }
    var URL = Ext.URLs.HoldCancel + "/" + TherapyID + "/" + Type + "/" + nStatus;
    var URL2 = Ext.URLs.OrderHoldCancel + "/" + PID + "/" + TherapyID + "/" + Type + "/" + nStatus;
	Ext.Ajax.request({
		scope : this,
		url: URL,
        method: "PUT",
		success: function( response, opts ){
			var text = response.responseText;
			var resp = Ext.JSON.decode( text );
			if (resp.success) {
				this.application.unMask();
				/* Update on screen display */
				var btnID, btnStatus, aBtn, PostBtnID = type + "_" + record.Cycle + "_" + record.Day + "_" + medIdx;
				if ("Hold" === nStatus) {
					btnStatus = "Release from Hold";
					btnID = "Hold_" + PostBtnID;
					aBtn = Ext.select("#" + btnID);
					if (aBtn && aBtn.elements && aBtn.elements[0] && aBtn.elements[0].childNodes) {
						aBtn.elements[0].childNodes[0].nodeValue = btnStatus;
					}
				}
				else if ("Cancel" === nStatus) {
					btnStatus = "";
					btnID = "Edit_" + PostBtnID;
					aBtn = Ext.select("#" + btnID);
					if (aBtn && aBtn.elements && aBtn.elements[0] && aBtn.elements[0].childNodes) {
						aBtn.elements[0].childNodes[0].nodeValue = btnStatus;
					}
					btnID = "Hold_" + PostBtnID;
					aBtn = Ext.select("#" + btnID);
					if (aBtn && aBtn.elements && aBtn.elements[0] && aBtn.elements[0].childNodes) {
						aBtn.elements[0].childNodes[0].nodeValue = btnStatus;
					}
					btnID = "Cancel_" + PostBtnID;
					aBtn = Ext.select("#" + btnID);
					if (aBtn && aBtn.elements && aBtn.elements[0] && aBtn.elements[0].childNodes) {
						aBtn.elements[0].childNodes[0].nodeValue = btnStatus;
					}
				}
				else {
					btnStatus = "Hold";
					btnID = "Hold_" + PostBtnID;
					aBtn = Ext.select("#" + btnID);
					if (aBtn && aBtn.elements && aBtn.elements[0] && aBtn.elements[0].childNodes) {
						aBtn.elements[0].childNodes[0].nodeValue = btnStatus;
					}
				}
			}
		},
		failure : function( response, opts ) {
			this.application.unMask();
			alert("EoTS Data Load Failed...");
		}
	});

},


handleOEM_RecordMedHold : function( event, element) {
    event.stopEvent(  );
    var dlgMsg, dlgTitle, newStat;
    if ("Release from Hold" == element.textContent) {
        dlgTitle = "Release Medication Hold - ";
        dlgMsg = "Release medication hold for this date only or all future Administration dates";
        newStat = "Clear";
    }
    else if ("Hold" == element.textContent) {
        dlgTitle = "Hold Medication - ";
        dlgMsg = "Hold medication for this date only or all future Administration dates";
        newStat = "Hold";
    }
    else {
        dlgTitle = "Cancel Medication - ";
        dlgMsg = "Cancel medication for this date only or all future Administration dates";
        newStat = "Cancel";
    }
    Ext.Msg.show({
        title: dlgTitle + element.getAttribute("med"),
        msg: dlgMsg,
        buttonText: {
            yes: 'This date Only', no: 'All Future', cancel: 'Cancel'
        },
        scope:this,
        status: newStat,
        buttons: Ext.Msg.YESNOCANCEL,
        el : element,
        fn: function(btnID, txt, opt) {
            var matchRecord, matchMed, matchMedID, DrugSection, ridx, record, PREbtnID, TbtnID, POSTbtnID;
            var TherapyID;
            var Data = this.application.Patient.OEMRecords;
            var records = Data.OEMRecords;
            var idx = opt.el.getAttribute("typeidx");
            idx--;
            record = records[idx];

            var type = opt.el.getAttribute("type");
            var medIdx = opt.el.getAttribute("medidx");
            if ("Pre" === type) {
                DrugSection = record.PreTherapy;
            }
            else if ("Post" === type || "Pos" === type) {
                DrugSection = record.PostTherapy;
            }
            else {
                DrugSection = record.Therapy;
            }
            if (DrugSection.length > 0) {
                matchRecord = DrugSection[medIdx-1];
                matchMedID = matchRecord.MedID;
                TherapyID = matchRecord.id;
            }

            if ("cancel" === btnID) {
				if("Clear" == opt.status) {
					Ext.MessageBox.alert("Medication Hold", "Release Hold of - " + opt.el.getAttribute("med") + " has been cancelled");
				}
				else {
					Ext.MessageBox.alert("Medication Hold", opt.status + " Medication - " + opt.el.getAttribute("med") + " has been cancelled");
				}
            }
            else {
                if ("This date Only" === opt.buttonText[btnID]) {
                    ridx = idx;
                    this.HoldSingleMedRecord(records, type, ridx, medIdx, opt.status, matchMedID, TherapyID);
                }
                else if ("All Future" === opt.buttonText[btnID]) {
                    for (ridx = idx; ridx < records.length; ridx++ ) {
                        this.HoldSingleMedRecord(records, type, ridx, medIdx, opt.status, matchMedID, TherapyID);
                    }
                }
            }
        }
    });
},

/***********************************************************************************
 *
 * MWB 13 Feb 2012
 * Handle click of Anchor to Edit a specific drug in an OEM Record
 * Anchors rendered in the OEM.js view as part of the XTemplate
 *
 ***********************************************************************************/
handleEditOEM_Record : function (event, element) {
    event.stopEvent(  );
		var anchorName = element.getAttribute("name");
		var anchorCycle = element.getAttribute("cycle");
		var anchorDay = element.getAttribute("day");
		var anchorType = element.getAttribute("type");
		var anchorIdx = element.getAttribute("typeidx");	// The index which specifies the index into the arrays of Admin Days
		var medIdx = element.getAttribute("medidx");		// The index into the array of Meds for the specified therapy
		var Data = this.application.Patient.OEMRecords;

		// MWB 14 Feb 2012 -- In Real Code need to get the specific record from the OEM Record Data attached to the Patient object
		// But currently need to adjust the OEM Record Data stored. The "Dosing" comes in as a single string rather than the individual components needed.
		var DrugSection;
		var theCycles = Data.OEMRecords;
//		var thisDay = theCycles[anchorCycle-1];			// MWB - 3/30/2012 - Why was the line below commented out and replaced by this one???
		var thisDay = theCycles[anchorIdx-1];		// Identifies the day based on the idx into the array of Cycles [ = ((#Days/Cycle) * (Cycle#)) + (Day in Cycle))]


		var MedRecord = {};

		var title;
		switch(anchorType) {
			case "Pre" :
				title = "Edit Pre-Therapy Drug";
				DrugSection = thisDay.PreTherapy;
				MedRecord.TherapyType = "Pre";
				break;
			case "Post" : 
				title = "Edit Post-Therapy Drug";
				DrugSection = thisDay.PostTherapy;
				MedRecord.TherapyType = "Post";
				break;
			default:
				title = "Edit Therapy Drug";
				DrugSection = thisDay.Therapy;
				MedRecord.TherapyType = "Therapy";
				break;
		}
		var mr = DrugSection[medIdx-1];

		// Ideally these values should probably be stored in the DB but they're only really needed when editing a particular record
		// And to put them in the DB would entail changing the Model and back end store to little real necessity
		MedRecord.Order_ID = mr.Order_ID;
		MedRecord.CycleIdx = anchorCycle;
		MedRecord.DayIdx = anchorDay;
		MedRecord.MedIdx = medIdx;

		MedRecord.TemplateID = Data.id;
		MedRecord.OEMRecordID = thisDay.id;

		MedRecord.TherapyID = mr.id;

		MedRecord.Instructions = mr.Instructions;
		MedRecord.AdminTime = mr.AdminTime;
		MedRecord.MedID = mr.MedID;
		MedRecord.Med = mr.Med;

		if ("Therapy" === MedRecord.TherapyType) {
			MedRecord.Dose = mr.Dose;
			MedRecord.BSA_Dose = mr.BSA_Dose;
			MedRecord.Units = mr.DoseUnits;
			MedRecord.InfusionMethod = mr.AdminMethod;
			MedRecord.FluidType = mr.FluidType;
			MedRecord.InfusionTime1 = mr.InfusionTime;

			MedRecord.FluidVol = mr.FluidVol;
			MedRecord.FlowRate = mr.FlowRate;
		}
		else {
			MedRecord.Dose = mr.Dose1;
			MedRecord.BSA_Dose = mr.BSA_Dose1;
			MedRecord.Units = mr.DoseUnits1;
			MedRecord.InfusionMethod = mr.AdminMethod1;
			MedRecord.FluidType = mr.FluidType1;

			MedRecord.FluidVol = mr.FluidVol1;
			MedRecord.FlowRate = mr.FlowRate1;

			MedRecord.Dose2 = mr.Dose2;
			MedRecord.BSA_Dose2 = mr.BSA_Dose2;
			MedRecord.Units2 = mr.DoseUnits2;
			MedRecord.InfusionMethod2 = mr.AdminMethod2;
			MedRecord.FluidType2 = mr.FluidType2;
			MedRecord.FluidVol2 = mr.FluidVol2;
			MedRecord.FlowRate2 = mr.FlowRate2;
			MedRecord.InfusionTime1 = mr.InfusionTime1;
			MedRecord.InfusionTime2 = mr.InfusionTime2;
		}

		var EditRecordWin = Ext.widget("EditOEMRecord");
		EditRecordWin.setTitle(title);
		this.application.fireEvent("OEMEditRecord", MedRecord, anchorType);
		return false;
},



	/**********************
	 *
	 *	Called when the user selects a template.
	 *	This method makes a call to the back end service to retrieve the data for the selected template
	 *	Then parses it to make a JSON Data Object and passes it off to the XTemplate for rendering in the OEM Tab
	 *
	 **********************/
	selTemplateChange: function (combo, recs, eOpts) {
		wccConsoleLog("Template applied to patient has been selected");
		this.getAndRenderTemplateData (recs[0].data);
	}


});


