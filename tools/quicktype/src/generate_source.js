const path = require('path'); 
const { promises: { 
	readFile,
	readdir,
	writeFile
} } = require('fs');

const {
	quicktype,
	InputData,
	jsonInputForTargetLanguage,
	quicktypeMultiFile,
} = require("quicktype-core");

// Config
const targetLanguage = "Java";
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

    await addJsonFilesToSchema(inputData, files, testFolder);

	var result =  await quicktypeMultiFile({
		inputData,
		lang: targetLanguage,
		rendererOptions: { package: "nl.contentisbv.zem.models" }
	});

	const writes = Array.from(result).map(async ([filename, result]) => {
		await writeFile(path.join("./temp", filename), result.lines.join("\n"), "utf-8");
	});
	await Promise.all(writes);

	return result;
}

main();
//main().then((result) => console.log(result.lines.join("\n")));

//-----------------------------------------------------------------------------------------------------------

/**
 * Scans directory for json files and adds them to the schema.
 * 
 * @param {*} inputData 
 * @param {*} files 
 * @param {*} testFolder 
 */
async function addJsonFilesToSchema(inputData, files, testFolder) {
	
	console.log("addJsonFilesToSchema");

	const promises = files.filter(jsonExtensionFilter(".json")).map(async function (name) {

		await addFileToInputSchema(inputData, testFolder, name);

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
async function addFileToInputSchema( inputData, testFolder, name) {

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