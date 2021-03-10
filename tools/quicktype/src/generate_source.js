
const targetLanguage = "Java";
const path = require('path'); 
const { promises: { 
	readFile,
	readdir,
	filter,
} } = require('fs');

function extension(extension) {
	return (element) => path.extname(element) === extension; 
}

const {
	quicktype,
	InputData,
	jsonInputForTargetLanguage,
	JSONSchemaInput,
	FetchingJSONSchemaStore,
} = require("quicktype-core");

async function main() {
	const testFolder = '/Users/miria/contentis/git/zem/specs/models/schema/shower';
	const schemaInput = new JSONSchemaInput(new FetchingJSONSchemaStore());
	const inputData = new InputData();
	inputData.addInput(schemaInput);


	const files = await readdir(testFolder);
    const promises = files.filter(extension(".json")).map(async function(name) {

        var filePath = path.join(testFolder, name);
        var result = path.parse(filePath);				

        var objectName = result.name;

        console.log("Adding source " + filePath );
        console.log("Object name " + objectName );

        var schemaData = await readFile(filePath, 'utf8');				
        await schemaInput.addSource({ name: objectName, schema: schemaData });
    });

    await Promise.all(promises);

	return await quicktype({
		inputData,
		lang: targetLanguage,
	});
	
	console.log(usage.join("\n"));
}

main().then((result) => console.log(result));

