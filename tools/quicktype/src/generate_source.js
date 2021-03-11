const path = require('path'); 
const { promises: { 
	fs,
	readFile,
	readdir,
	filter,
	appendFile,
} } = require('fs');

const {
	quicktype,
	InputData,
	jsonInputForTargetLanguage,
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

	var result =  await quicktype({
		inputData,
		lang: targetLanguage,
	});

	var filename = "test.txt";

	result.lines.forEach(element => {
		var fs = require('fs');

		if (element.startsWith("//")) {
			
			console.log("---------------------------------------");
			filename = element.substr(3);
			
			console.log("Changing filename to " + filename);
		} else {

			fs.appendFile(filename, element + "\n", function (err) {
			if (err) return console.log(err);
			});
		}
	});
	

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