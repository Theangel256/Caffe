module.exports.run = () => {
const autoupdater = require('auto-updater');
 
const event = new autoupdater({
 pathToJson: '',
 autoupdate: true,
 checkgit: true,
 jsonhost: 'raw.githubusercontent.com',
 contenthost: 'codeload.github.com',
 progressDebounce: 1,
 devmode: false
});
// State the events
event.on('git-clone', function() {
  console.log("You have a clone of the repository. Use 'git pull' to be up-to-date");
});
event.on('check.up-to-date', function(v) {
  console.info("You have the latest version: " + v);
});
event.on('check.out-dated', function(v_old, v) {
  console.warn("Your version is outdated. " + v_old + " of " + v);
  event.fire('download-update'); // If autoupdate: false, you'll have to do this manually.
  // Maybe ask if the'd like to download the update.
});
event.on('update.downloaded', function() {
  console.log("Update downloaded and ready for install");
  event.fire('extract'); // If autoupdate: false, you'll have to do this manually.
});
event.on('update.not-installed', function() {
  console.log("The Update was already in your folder! It's read for install");
  event.fire('extract'); // If autoupdate: false, you'll have to do this manually.
});
event.on('update.extracted', function() {
  console.log("Update extracted successfully!");
  console.warn("RESTART THE APP!");
});
event.on('download.start', function(name) {
  console.log("Starting downloading: " + name);
});
event.on('download.progress', function(name, perc) {
  process.stdout.write("Downloading " + perc + "% \033[0G");
});
event.on('download.end', function(name) {
  console.log("Downloaded " + name);
});
event.on('download.error', function(err) {
  console.error("Error when downloading: " + err);
});
event.on('end', function() {
  console.log("The app is ready to function");
});
event.on('error', function(name, e) {
  console.error(name, e);
});

// Start checking
event.fire('check');
}