import { IInputs, IOutputs } from "./generated/ManifestTypes";

class EntityReference {
	id: string;
	typeName: string;
	constructor(typeName: string, id: string) {
		this.id = id;
		this.typeName = typeName;
	}
}

class AttachedFile implements ComponentFramework.FileObject {
	fileContent: string;
	fileSize: number;
	fileName: string;
	mimeType: string;
	constructor(fileName: string, mimeType: string, fileContent: string, fileSize: number) {
		this.fileName = fileName;
		this.mimeType = mimeType;
		this.fileContent = fileContent;
		this.fileSize = fileSize;
	}
}

// class CreateNotes {
// 	DocumentBody: string;
// 	FileName: string;
// 	MimeType : string;
// 	Subject : string;
// 	NoteText : string;
// 	ObjectId = {
// 		Id ,
// 		LogicalName
// 	};
// }

class objectRef {
	Id: any
	LogicalName: any
}

class NotesEntity {
	DocumentBody: string;
	 	FileName: string;
	 	MimeType : string;
	 	Subject : string;
	 	NoteText : string;
	 	ObjectId = { };
	 } 

export class Attachments implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private entityReference: EntityReference;

	private _container: HTMLDivElement;
	private _context: ComponentFramework.Context<IInputs>;
	private _button: HTMLButtonElement;
	private _input: HTMLInputElement;
	private _img: HTMLImageElement;

	/**
	 * Empty constructor.
	 */
	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		this.entityReference = new EntityReference(
			(<any>context).page.entityTypeName,
			(<any>context).page.entityId
		)

		this._context = context;
		this._container = container;
		this._container = document.createElement("div");

		this._input = document.createElement("input");
		this._input.id = "notesUpload"
		this._input.type = "File"
		this._input.addEventListener("change", this.previewFile.bind(this));
		this._button = document.createElement("button");
		this._img = document.createElement("img");

		// let fetchXml =
		// 	"<fetch>"
		// 	+ "<entity name='annotation'>"
		// 	+ "<attribute name='subject'/>"
		// 	+ "<attribute name='notetext' />"
		// 	+ "<attribute name='filename' />"
		// 	+ "<attribute name='annotationid' />"
		// 	+ "<order attribute='subject' descending='false' />"
		// 	+ "</entity>"
		// 	+ "</fetch>";

		// this._context.webAPI.retrieveMultipleRecords("annotation", "?fetchXml=" + fetchXml).then
		// (
		// 	function (response: ComponentFramework.WebApi.RetrieveMultipleResponse) 
		// 	{
		// 		console.log("response");
		// 		console.log(response);
		// 		// Retrieve multiple completed successfully -- retrieve the averageValue 
		// 		//let averageVal:Number = response.entities[0].average_val;

		// 		// Generate HTML to inject into the result div to showcase the result of the RetrieveMultiple Web API call
		// 		// let resultHTML: string = "Average value of " + TSWebAPI._currencyAttributeNameFriendlyName + " attribute for all " + TSWebAPI._entityName + " records: " + averageVal;
		// 		// thisRef.updateResultContainerText(resultHTML);
		// 	},
		// 	function (errorResponse: any) 
		// 	{
		// 		// Error handling code here
		// 		// thisRef.updateResultContainerTextWithErrorResponse
		// 		console.log(errorResponse);
		// 	}
		// );

		//this._button.addEventListener("click", this.GetFiles.bind(this, this.entityReference));
		// Add control initialization code
		//this.GetFiles(this.entityReference);


		console.log(this.entityReference);

		this._container.appendChild(this._button);
		this._container.appendChild(this._input);
		this._container.appendChild(this._img);
	//	this.AddNotes("");
		container.appendChild(this._container);

	}

	previewFile() {
		this.processFile(this._input.files);
	}

	private processFile(files: any): void {
		debugger;
		var ref = this ; 
		if (files.length > 0) {
			let img: any = JSON.stringify(files[0]);
			//var reader = new FileReader();
			//if (img) {
			//	reader.readAsDataURL(img);
			//}

			//reader.addEventListener("load", function () {

			//	console.log(reader.result);
				//var fileContent: any = reader.result;
				let file = new AttachedFile(img.name, img.type, "", img.size);
				console.log(files[0]);

				console.log(file);
				try {
					let fileExtension: string | undefined;

					if (file && file.fileName) {
						fileExtension = file.fileName.split('.').pop();
					}

					if (fileExtension) {
						ref.setImage(true, fileExtension, img);
					}
					else {
						console.log("error");
					}
				}
				catch (err) {
					console.log(err);
				}
			//} , false);


		}
	}

	private setImage(shouldUpdateOutput: boolean, fileType: string, fileContent: string): void {
		let imageUrl: string = this.generateImageSrcUrl(fileType, fileContent);
		this._img.src = imageUrl;
		this.AddNotes(imageUrl)
	}


	private generateImageSrcUrl(fileType: string, fileContent: string): string {
		return "data:image/" + fileType + ";base64, " + fileContent;
	}


	private async GetFiles(ref: EntityReference): Promise<AttachedFile[]> {
		debugger;

		let attachmentType = ref.typeName == "email" ? "activitymimeattachment" : "annotation";

		let fetchXml =
			"<fetch>" +
			"  <entity name='" + attachmentType + "'>" +
			"    <filter>" +
			"      <condition attribute='objectid' operator='eq' value='" + ref.id + "'/>" +
			"    </filter>" +
			"  </entity>" +
			"</fetch>";

		// "<fetch>"
		// + "<entity name='annotation'>"
		// + "<attribute name='subject'/>"
		// + "<attribute name='notetext' />"
		// + "<attribute name='filename' />"
		// + "<attribute name='annotationid' />"
		// + "<order attribute='subject' descending='false' />"
		// + "</entity>"
		// + "</fetch>";

		let query = '?fetchXml=' + encodeURIComponent(fetchXml);

		let searchQuery = "?$select=annotationid,documentbody,mimetype,notetext,subject,filename&$filter=_objectid_value eq " +
			ref.id +
			" and  isdocument eq true and startswith(mimetype, 'image/')";

		try {
			const result = await this._context.webAPI.retrieveMultipleRecords(attachmentType, query);
			let items = [];
			console.log(result);
			for (let i = 0; i < result.entities.length; i++) {
				console.log(result.entities[i]);
				let record = result.entities[i];
				let fileName = <string>record["filename"];
				let mimeType = <string>record["mimetype"];
				let content = <string>record["body"] || <string>record["documentbody"];
				let fileSize = <number>record["filesize"];

				//if (!this._supportedMimeTypes.includes(mimeType)) { continue; }

				let file = new AttachedFile(fileName, mimeType, content, fileSize);
				items.push(file);
			}
			debugger;
			return items;
		}
		catch (error) {
			console.log(error);
			debugger;
			return [];
		}
	}

	private AddNotes(docBody: any): void {
		var refDetails = 	{	Id: this.entityReference.id,
			LogicalName: this.entityReference.typeName
		}; 
		var notesEntity :any ={}
		//  = new NotesEntity(); 
		//	docBody,"testing.png","image/png","testing","will it work ",refDetails);
		 
		//if (docBody != null & fName != null & mType != null) {
		notesEntity["documentbody"] = docBody;
		notesEntity["filename"] = "testing.png";
		notesEntity["filesize"] =  200;
		notesEntity["mimetype"] = "image/png";
		//}
		 notesEntity["subject"] = "testing";
		 notesEntity["notetext"] = "will it work ";
		// notesEntity["ObjectId"] = {
		// 	Id: this.entityReference.id,
		// 	LogicalName: this.entityReference.typeName
		// };
		//notesEntity["name"] = "Test_sa"; 
		//notesEntity["revenue"] = 5000;
    console.log(notesEntity);
		// store reference to 'this' so it can be used in the callback method
		var thisRef = this;

		// Invoke the Web API to creat the new record
		this._context.webAPI.createRecord("annotation", notesEntity).then
			(
				function (response: ComponentFramework.EntityReference) {
					// Callback method for successful creation of new record
					console.log(response);

					// Get the ID of the new record created
					let id: string = response.id;
					console.log(response.id);

				},
				function (errorResponse: any) {
					// Error handling code here - record failed to be created
					console.log(errorResponse);
				}
			);
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		this._context = context;
		//this.GetFiles(this.entityReference)
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
	}
}