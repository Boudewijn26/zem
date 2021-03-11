const path = require('path'); 
const { promises: { 
	readFile,
	readdir,
	filter,
} } = require('fs');

const {
	quicktype,
	InputData,
	jsonInputForTargetLanguage,
} = require("quicktype-core");

// Config
const targetLanguage = "Python";
const basePath = "../../../specs/models/schema/";

/**
 * MAIN FUNCTION
 * 
 * @returns 
 */
async function main() {
	const testFolder = basePath + '/shower';
	const inputData = new InputData();

	const files = await readdir(testFolder);

    await addJsonFIlesToSchema(inputData, files, testFolder);

	return await quicktype({
		inputData,
		lang: targetLanguage,
	});
}

main().then((result) => console.log(result.lines.join("\n")));

/**
 * Scans directory for json files and adds them to the schema.
 * 
 * @param {*} inputData 
 * @param {*} files 
 * @param {*} testFolder 
 */
async function addJsonFIlesToSchema(inputData, files, testFolder) {
	
	console.log("addJsonFIlesToSchema");

	const promises = files.filter(jsonExtensionFilter(".json")).map(async function (name) {

		await addFileToInputScheme(inputData, testFolder, name);

	});

	await Promise.all(promises);
}

/**
 * Adds json files to the quicktype source
 * 
 * @param {*} inputData 
 * @param {*} testFolder 
 * @param {*} name 
 */
async function addFileToInputScheme( inputData, testFolder, name) {

	console.log("Adding source " + name + "to Quicktype source ");

	var filePath = path.join(testFolder, name);
	var result = path.parse(filePath);

	var objectName = result.name;

	
	var schemaData = await readFile(filePath, 'utf8');
	
	const input = jsonInputForTargetLanguage(targetLanguage);
	await input.addSource({ name: objectName, samples: [schemaData] });
	
	inputData.addInput(input);
}

/**
 * Creates a filter for json
 * 
 * @param {*} extension 
 * @returns 
 */
function jsonExtensionFilter(extension) {
	return (element) => path.extname(element) === extension; 
}