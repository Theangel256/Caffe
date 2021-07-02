module.exports = {
  set: {
    embed: {
      author: "{user.username} Debes de utilizarlo de la siguiente manera.",
      desc: "`{prefix}set <acción> <dato>`\n\n**Acciones Disponibles**:\n`profile set desc <Texto Personal>`\n`profile set lang es ó en`",
    },
    desc: {
      noArgs:
        "**:grey_exclamation: |** Escribe la descripción a ver en tu perfil",
      success: "Descripción personal establecido a: {args}",
    },
    lang: {
      noArgs: "**:grey_exclamation: |** Escribe el lenguaje a ver en tu perfil",
      helper: "**:grey_exclamation: |** Debe ser `es` ó `en`.",
      success: "Lenguaje del perfil establecido a: {args}",
    },
  },
  wrongChoice: "Opción Incorrecta!",
  bot: "Los bots no tienen pefil",
  profile: "Perfil de {user.username}",
  profileDesc: "Sin Descripción.",
  currencies: ":dollar: Monedas",
  lvl: ":sparkles: Nivel",
  rep: "<:rep:741355268625006694> Reputación",
  married: ":heart: Casado con",
  marriedOf: "Nadie",
  trophies: "<:trofeo:741356106353213560>  Trofeos",
  trophiesOf: "Ninguno",
  beta: "Sistema en beta",
};
