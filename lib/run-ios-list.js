const runShellCommand = require("./run-shell-command")
const iosVersionList = require("./ios-version-list")

module.exports = {
  runIosList: async cmd => {
    let runtimesCmd = "xcrun simctl list | grep -E '([0-9.] - [0-9A-Z]{3})'"
    let iosVersions = await iosVersionList.iosVersionList(runtimesCmd)

    const list = await runShellCommand.run_shell_command(cmd)

    let temp = ([] = list.stdout.split("\n"))
    let count = temp.length
    let titles = []
    let sublist = []
    let ary = []
    let next = 0

    for (let i = 0; i < count; i++) {
      if (temp[i].startsWith("--")) {
        titles.push(temp[i].replace(/-- | --/g, ""))
        if (ary.length > 0) {
          sublist.push(ary)
        }
        if (next === 0 && ary.length <= 0) {
          titles = titles.splice(1)
        }
        ary = []
        next++
      }

      if (temp[i].startsWith("    ")) {
        ary.push(
          temp[i]
            .replace(
              /\([0-9A-Z]{8}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{12}\) \(Shutdown\)\s|\([0-9A-Z]{8}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{12}\) \(Booted\)\s$/g,
              ""
            )
            .trim()
        )
      }
    }

    if (ary.length > 0) {
      sublist.push(ary)
    }

    let data = {}
    for (let x = 0; x < titles.length; x++) {
      data[titles[x]] = sublist[x]
    }

    return { titles: titles, sublist: data, versions: iosVersions }
  }
}
