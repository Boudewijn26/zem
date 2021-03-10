var fs = require('fs');

const {
	quicktype,
	InputData,
	jsonInputForTargetLanguage,
	JSONSchemaInput,
	FetchingJSONSchemaStore,
} = require("quicktype-core");

// call quicktype --lang Java --out ..\specs\models\java\ --package nl.contentisbv.shower --src-lang schema ..\specs\models\schema\shower\predicted_usage.json

async function quicktypeJSONSchema(targetLanguage, typeName, jsonSchemaString) {

	const schemaInput = new JSONSchemaInput(new FetchingJSONSchemaStore());

	// We could add multiple schemas for multiple types,
	// but here we're just making one type from JSON schema.
	await schemaInput.addSource({ name: typeName, schema: jsonSchemaString });

	const inputData = new InputData();
	inputData.addInput(schemaInput);

	return await quicktype({
		inputData,
		lang: targetLanguage,
	});
}

async function main() {

	var data = fs.readFileSync('C:\Users\miria\contentis\git\zem\specs\models\schema\shower\current_usage.json', 'utf8');

	const { lines: javaPerson } = await quicktypeJSONSchema(
		"Java",
		"usage",
		data
	);
	
	console.log(javaPerson.join("\n"));

}

main();