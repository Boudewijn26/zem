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
  JSONSchemaInput,
  FetchingJSONSchemaStore,
} = require("quicktype-core");
const fs = require("fs");

// Config
const basePath = "../../../specs/models/schema/";
const baseCodePath = "../../../generated-sources/models";
const languages = ["Java", "Python", "TypeScript"];

const suffices = {
	"Python": ".py",
	"TypeScript": ".ts"
};

/**
 * MAIN FUNCTION
 *
 * @returns
 */
async function main() {
  createOutputEnvironment();

  const result = getDirectories(basePath);

  await Promise.all(result.flatMap(async (subFolder) => {
    return languages.map(async (language) => {
      await generateApi(language, subFolder);  
    });
  }));
}

main();

/**
 * Removes the old generated sources directory and creates 
 * the structure we need to write files to.
 */
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

  await addJsonFilesToSchema(inputData, files, inputFolder);

  const result = await quicktypeMultiFile({
    inputData,
    lang: language,
    rendererOptions: { package: "nl.contentisbv.zem.models." + subPath },
  });

  const writes = Array.from(result).map(async ([filename, result]) => {
  if (filename == "stdout") {
    filename = subPath + suffices[language];
  }

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

  const schemas = files.filter(jsonExtensionFilter(".json"));
  const mainSchemas = schemas.filter((file) => !file.startsWith("_"));
  const helpSchemas = schemas.filter((file) => file.startsWith("_")).map((file) => path.join(testFolder, file));
  console.log(helpSchemas);
  const promises = mainSchemas
    .map(async function (name) {
      await addFileToInputSchema(inputData, testFolder, name, helpSchemas);
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

async function addFileToInputSchema(inputData, testFolder, name, additionalSchemas) {
  console.log("Adding source " + name + " to Quicktype source ");

  const filePath = path.join(testFolder, name);
  const result = path.parse(filePath);

  const objectName = result.name;
  await inputData.addSource("schema", { kind: "schema", name: objectName, uris: [filePath] }, () => new JSONSchemaInput(new FetchingJSONSchemaStore([]), [], additionalSchemas));
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
