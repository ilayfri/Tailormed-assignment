const axios = require("axios");
const cheerio = require("cheerio");
const Program = require("../models/Program");
const cleanUp = (text) => {
  return text
    .split("\n")
    .map((string) => string.trim())
    .filter((item) => item);
};

const fetchFromWeb = async (fundName) => {
  const url = "https://www.healthwellfoundation.org/fund/" + fundName;
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const details = [1, 2].map((index) => {
      return cleanUp(
        $(
          'div[id="fund-details"] > div[class="details"] > div:nth-child(' +
            index +
            ") > div:nth-child(1) "
        ).text()
      );
    });
    const TreatmentsCovered = $(
      'div[id="fund-details"] > div.treatments-covered > div > div > div >ul>*'
    );
    const TreatmentsCovered_List = [];
    TreatmentsCovered.each((idx, elem) => {
      TreatmentsCovered_List.push($(elem).text());
    });
    return Object.fromEntries(
      new Map([
        ...details,
        ["TreatmentsCovered", TreatmentsCovered_List],
        ["ProgramName", fundName.replace("-", " ")],
      ])
    );
  } catch (err) {
    console.log("Error with fetch " + url);
    return;
  }
};

const checkSimillarity = async (webProgram) => {
  const dbName = webProgram.ProgramName.replace("-", " ");
  dbProgram = await Program.find({ ProgramName: dbName });
  if (dbProgram.length > 0) {
    if (
      dbProgram[0].Status != webProgram.Status ||
      dbProgram[0].TreatmentsCovered.toString() !=
        webProgram.TreatmentsCovered.toString() ||
      dbProgram[0].MAL != webProgram["Maximum Award Level"]
    ) {
      dbProgram[0].Status = webProgram.Status;
      dbProgram[0].TreatmentsCovered = webProgram.TreatmentsCovered;
      dbProgram[0].MAL = webProgram["Maximum Award Level"];
      await dbProgram[0].save().catch((err) => err);
    }
  }
};

const webCheck = () => {
  const promises = [];
  const savedProgramsNames = [
    "chronic-lymphocytic-leukemia",
    "porphyrias",
    "amyloidosis",
    "pulmonary-fibrosis",
    "hepatitis-c",
  ];
  savedProgramsNames.map((program) => {
    promises.push(fetchFromWeb(program));
  });

  Promise.all(promises).then((webInfo) => {
    webInfo.map((webProgram) => {
      if (webProgram) {
        checkSimillarity(webProgram);
      }
    });
  });
};
module.exports.webCheck = webCheck;
