module.exports = {
    set: {
        embed: {
        author: "{user.username} You should use it as follows.",
        desc: '`{prefix}set <action> <args>`\n\n**Available Shares**:\n`profile set desc <Personal Text>`\n`profile set lang es or en`'
    },
},
    desc: {
        noArgs: '**:grey_exclamation: |** Write the description to be viewed on your profile',
        success: 'Personal description set to: {args}'
    },
    lang: {
        noArgs: '**:grey_exclamation: |** Write the language to be seen in your profile',
        helper: '**:grey_exclamation: |** It must be `es` or `en`',
        success: 'Profile language set to: {args}'
    },
wrongChoice: 'Wrong choice!',
bot: 'Bots have no profile',
profile: 'Profile form {user.username}',
profileDesc: 'Without description.',
currencies: ':dollar: Currencies',
lvl: ':sparkles: Level',
rep: '<:rep:741355268625006694> Reputation',
married: ':heart: Married to',
marriedOf: 'Nobody',
trophies: '<:trofeo:741356106353213560> Trophies',
trophiesOf: 'Nothing',
beta: 'System in beta'
}