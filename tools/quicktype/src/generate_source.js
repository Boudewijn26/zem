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

  result.forEach((subFolder) => {
    languages.forEach(language => {
      generateApi(language, subFolder);  
    });    
  });

  return;
}

main();

function createOutputEnvironment() {
  fs.rmdirSync(baseCodePath, { recursive: true });

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
async function generateApi(language, subPath) {
  const outputFolder = path.join(
    path.join(baseCodePath, language),
    subPath
  );
  const inputFolder = basePath + "/" + subPath;

  createFolderIfNotExist(outputFolder);

  const inputData = new InputData();

  const files = await readdir(inputFolder);

  await addJsonFilesToSchema(inputData, language, files, inputFolder);

  const result = await quicktypeMultiFile({
    inputData,
    lang: language,
    rendererOptions: { package: "nl.contentisbv.zem.models." + subPath },
  });

  const writes = Array.from(result).map(async ([filename, result]) => {
    // 
    // TODO Python support -> stdout naar filename (use directory name)
    //
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
async function addJsonFilesToSchema(inputData, language, files, testFolder) {
  console.log("addJsonFilesToSchema");

  const promises = files
    .filter(jsonExtensionFilter(".json"))
    .map(async function (name) {
      await addFileToInputSchema(inputData, language, testFolder, name);
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
async function addFileToInputSchema(inputData, language, testFolder, name) {
  console.log("Adding source " + name + " to Quicktype source ");

  const filePath = path.join(testFolder, name);
  const result = path.parse(filePath);

  const objectName = result.name;

  const schemaData = await readFile(filePath, "utf8");

  const input = jsonInputForTargetLanguage(language);
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

/**
 * Returns a list of directories in directory "path""
 *
 * @param {*} path
 * @returns
 */
function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + "/" + file).isDirectory();
  });
}
