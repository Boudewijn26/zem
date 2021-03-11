/**
 * Generates api code for different languages from json schemas
 */
const path = require("path");
const {
  promises: { readFile, readdir, writeFile },
} = require("fs");

const {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
  quicktypeMultiFile,
} = require("quicktype-core");
const fs = require("fs");


// Config
const targetLanguage = "Java";
const basePath = "../../../specs/models/schema/";
const baseCodePath = "../../../generated-sources/models";
const languages = ["Java", "Python"];

/**
 * MAIN FUNCTION
 *
 * @returns
 */
async function main() {

  createOutputEnvironment();

  var result = getDirectories(basePath);
  
  result.forEach(subFolder => {
    generateApi(subFolder);    
  });

  return;
}

main();

function createOutputEnvironment() {
  createFolderIfNotExist(baseCodePath);
  languages.forEach((language) => {
    createFolderIfNotExist(path.join(baseCodePath, language));
  });
}

/**
 * Generate an api for all json files in this subfolder.
 *
 * Package name will be appended with subfolder name
 *
 * @param {*} subPath
 * @returns
 */
async function generateApi(subPath) {
  const outputFolder = path.join(
    path.join(baseCodePath, targetLanguage),
    subPath
  );
  const inputFolder = basePath + "/" + subPath;

  createFolderIfNotExist(outputFolder);

  const inputData = new InputData();

  const files = await readdir(inputFolder);

  await addJsonFilesToSchema(inputData, files, inputFolder);

  //
  // TODO Change package with subdir?
  // for ex:
  // schema/shower/*.json becomes
  // nl.contentisbv.zem.models.shower
  //
  const result = await quicktypeMultiFile({
    inputData,
    lang: targetLanguage,
    rendererOptions: { package: "nl.contentisbv.zem.models." + subPath },
  });

  const writes = Array.from(result).map(async ([filename, result]) => {
    //
    // TODO change temp to another directory
    // Proposal: <root>/generated_resources
    //

    //
    // TODO delete old files.
    //
    // Python support -> stdout naar filename (use directory name)
    await writeFile(
      path.join(outputFolder, filename),
      result.lines.join("\n"),
      "utf-8"
    );
  });
  await Promise.all(writes);

  return result;
}

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

  const promises = files
    .filter(jsonExtensionFilter(".json"))
    .map(async function (name) {
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
async function addFileToInputSchema(inputData, testFolder, name) {
  console.log("Adding source " + name + " to Quicktype source ");

  const filePath = path.join(testFolder, name);
  const result = path.parse(filePath);

  const objectName = result.name;

  const schemaData = await readFile(filePath, "utf8");

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

/**
 * Checks if a folder exists, if not it will be created
 *
 * @param {*} folder
 */
function createFolderIfNotExist(folder) {

  if (!fs.existsSync(folder)) {
    console.log("Creating folder " + folder);
    fs.mkdirSync(folder);
  }
}

  function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {

      return fs.statSync(path + "/" + file).isDirectory();
      
    });
  }