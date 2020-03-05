const inquirer = require("inquirer")

let subDataList = []
let versions = []

module.exports = {
  iosSelector: data => {
    subDataList = data.sublist
    versions = data.versions

    const questions = [
      {
        type: "rawlist",
        name: "version",
        message: "Please choose OS?",
        choices: data.titles
      }
    ]

    return inquirer.prompt(questions).then(result => {
      let osv = result.version.split(" ")
      let os = " (" + versions[result.version] + ")"

      let pt = {
        type: "rawlist",
        name: "device",
        message: "Please select the device?",
        filter: function(val) {
          return val + os
        }
      }
      pt.choices = subDataList[result.version]
      return inquirer.prompt(pt)
    })
  }
}
