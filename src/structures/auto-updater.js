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
  console.log("Tienes una copia del proyecto.");
});
event.on('check.up-to-date', function(v) {
  console.info("Ya tienes la ultima versión: " + v);
});
event.on('check.out-dated', function(v_old, v) {
  console.warn("Tu versión está desactualizada. " + v_old + " of " + v);
  event.fire('download-update'); 
  // If autoupdate: false, you'll have to do this manually.
  // Maybe ask if the'd like to download the update.
});
event.on('update.downloaded', function() {
  console.log("Actualización descargada y lista para instalar");
  event.fire('extract'); // If autoupdate: false, you'll have to do this manually.
});
event.on('update.not-installed', function() {
  console.log("¡La actualización ya está en su carpeta! Está listo para instalar");
  event.fire('extract'); // If autoupdate: false, you'll have to do this manually.
});
event.on('update.extracted', function() {
  console.log("¡Actualización extraída con éxito!");
  console.warn("¡REINICIE LA APLICACIÓN!");
});
event.on('download.start', function(name) {
  console.log("Iniciando la descarga: " + name);
});
event.on('download.progress', function(name, perc) {
  process.stdout.write("Descargando " + perc + "% \033[0G");
});
event.on('download.end', function(name) {
  console.log("Descargado " + name);
});
event.on('download.error', function(err) {
  console.error("Error al descargar: " + err);
});
event.on('end', function() {
  console.log("La aplicación está lista para funcionar.");
});
event.on('error', function(name, e) {
  console.error(name, e);
});

// Start checking
event.fire('check');