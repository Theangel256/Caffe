// eslint-disable-next-line no-unused-vars
module.exports.run = (client, message, args) => {
  const memesURL = JSON.parse(
    require("fs").readFileSync("./src/structures/memes.json", "utf8")
  );
  const randomImage = memesURL[Math.ceil(Math.random() * memesURL.length)];
  return message.channel
    .send(randomImage)
    .catch((error) => console.log(`${error}, URL: ${randomImage}`));
};
module.exports.help = {
  name: "meme",
  description: "Ve memes y riete un rato con tu Squad",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: ["ATTACH_FILES"],
  ownerOnly: false,
};
