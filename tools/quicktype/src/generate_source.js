
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
} = require("quicktype-core");

async function main() {
	const testFolder = '../../../specs/models/schema/shower';
	const inputData = new InputData();


	const files = await readdir(testFolder);
    const promises = files.filter(extension(".json")).map(async function(name) {

        var filePath = path.join(testFolder, name);
        var result = path.parse(filePath);				

        var objectName = result.name;

        console.log("Adding source " + filePath );
        console.log("Object name " + objectName );

        var schemaData = await readFile(filePath, 'utf8');
		const input = jsonInputForTargetLanguage(targetLanguage);
		await input.addSource({ name: objectName, samples: [schemaData] });
		inputData.addInput(input);
    });

    await Promise.all(promises);

	return await quicktype({
		inputData,
		lang: targetLanguage,
	});
}

main().then((result) => console.log(result.lines.join("\n")));

