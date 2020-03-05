const runShellCommand = require("./run-shell-command")

module.exports = {
  iosVersionList: async cmd => {
    const runtimesList = await runShellCommand.run_shell_command(cmd)

    let rtSplit = runtimesList.stdout.split("\n")
    let rListCount = rtSplit.length

    let iosVersions = {}
    let regex = new RegExp("[a-zA-Z]{3,} (.*? - .*?) - ", "g")
    for (let a = 0; a < rListCount; a++) {
      if (!/unavailable/.test(rtSplit[a])) {
        let str = regex[Symbol.match](rtSplit[a])
        if (!str) {
          continue
        }

        let ary = str[0].split("(")
        if (!ary) {
          continue
        }

        let ver = ary[1].split(" - ")
        if (!ver) {
          continue
        }
        iosVersions[ary[0].replace(/\s$/, "")] = ver[0]
      }
    }
    return iosVersions
  }
}
