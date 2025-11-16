![Caffe](https://github.com/user-attachments/assets/019287e3-202f-4e52-9412-e3e641fe1938)
# Caffe

[![JavaScript](https://img.shields.io/badge/JavaScript-100%25-blue)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Discord Bot](https://img.shields.io/badge/Discord-Bot-orange)](https://discord.com/developers/docs/intro)
[![Apache License 2.0](https://img.shields.io/badge/License-Apache%202.0-yellowgreen)](https://www.apache.org/licenses/LICENSE-2.0)
[![Stars](https://img.shields.io/github/stars/Theangel256/Caffe)](https://github.com/Theangel256/Caffe)
[![Forks](https://img.shields.io/github/forks/Theangel256/Caffe)](https://github.com/Theangel256/Caffe)

## Description

**Caffe** is a Discord bot designed to help you build and manage the best possible server. With this bot, you can easily customize your community using key features such as:

- Change the **default bot prefix**.
- Set up **event logs** (records of joins, leaves, and more).
- Configure a **welcome channel** for new members.
- Automatically assign a **role to new users**.

The bot is built in **JavaScript** using **Discord.js**, making it efficient and easy to extend. It includes an **intuitive web dashboard** for quick configurations without needing complex commands.

Transform your Discord server into a professional and welcoming experience with Caffe!

## Main Features

- 🔧 **Flexible Configuration**: Change prefix, logs, welcomes, and auto-roles via dashboard or commands.
- 📊 **Complete Logging**: Monitor key server events in real time.
- 👋 **Custom Welcome Messages**: Automatic welcome messages in the configured channel.
- 🆙 **Auto-Roles**: Assign roles to new members for fast onboarding.
- 🌐 **Web Dashboard**: Graphical interface at [https://caffe-bot.onrender.com/](https://caffe-bot.onrender.com/) for easy management.
- 📱 **Discord.js Compatible**: Easy to host on services like Heroku, Render, or VPS.
- 🏆 **Leaderboard**: [Be first on the leaderboard!](https://caffe-bot.onrender.com/leaderboard)

## Prerequisites

Before installing and running the bot, make sure you have:

- **Node.js** version 16.9.0 or higher (recommended: 18.x or newer).
- A **Discord Developer Portal** account to obtain your bot token.
- A Discord server to test the bot.
- Optional: Access to hosting like Render for the dashboard.

## Installation

Follow these steps to clone and set up the repository:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Theangel256/Caffe.git
   cd Caffe
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the project root with the following content:
   ```
   TOKEN=your_bot_token_here
   CLIENT_ID=your_client_id_here
   CLIENT_SECRET=your_client_secret_here
   PORT=3000  # Port for the dashboard (optional)
   ```

   - Get the `TOKEN` from the [Discord Developer Portal](https://discord.com/developers/applications).
   - `CLIENT_ID` and `CLIENT_SECRET` are required for the dashboard OAuth2.

4. **Invite the Bot to Your Server**:
   Use this URL generated in the Developer Portal (replace `CLIENT_ID`):
   ```
   https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
   ```
   Make sure to grant necessary permissions (e.g., Manage Roles, Send Messages).

## Usage

### Starting the Bot Locally

1. Run the bot:
   ```bash
   npm start
   ```

2. The bot will connect to Discord and be ready for commands. The default prefix is `$` (configurable from dashboard).

### Basic Commands

| Command | Description | Example |
|---------|-------------|---------|
| `$help` | Shows the list of available commands. | `$help` |
| `$help balance` | A short description & usage. | `$balance Member/Nickname Or Mention` |
| `$play` | Sets the channel for event  | `$play Kendrick Lamar` |
| `$rank` | A canvas image of you level | `$rank Member/Nickname Or Mention` |
| `$love` | Assigns a role automatically to new users. | `$love Member/Nickname Or Mention` |


### Using the Dashboard

1. Ensure the dashboard server is running (run `npm run build && npm run preview` if separate).
2. Access [https://caffe-bot.onrender.com/](https://caffe-bot.onrender.com/).
3. Log in with your Discord account and select your server.
4. Configure everything from the graphical interface: prefix, logs, welcomes, and roles.

## Project Structure

```
Caffe/
├── src/
│   ├── commands/     # Bot command files
│   ├── events/       # Event handlers (e.g., guildMemberAdd)
│   ├── config/       # Configuration files
│   └── index.js      # Main bot file
├── dashboard/        # Web server code for the dashboard
├── .env.example      # Environment variables template
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

## Contributing

Contributions are welcome! To improve Caffe:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-function`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-function`).
5. Open a Pull Request.

Please read the [Code of Conduct](CODE_OF_CONDUCT.md) (if available) and ensure your changes pass tests.

## License

This project is licensed under the [Apache License 2.0](LICENSE). See the [LICENSE](LICENSE) file for details.

## Contact

- **Author**: [Theangel256](https://github.com/Theangel256)
- **Repository**: [github.com/Theangel256/Caffe](https://github.com/Theangel256/Caffe)
- **Issues**: Report bugs or request features at [Issues](https://github.com/Theangel256/Caffe/issues)
- **Discord**: Join the bot's test server (link in the dashboard).

## Acknowledgments

Thanks to the Discord.js community for the amazing tools. If you use Caffe, share your experience!

---

*Last updated: November 2025*  
*Made with ❤️ for the Discord community*