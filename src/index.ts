import { Client, Intents, MessageEmbed } from 'discord.js';
import { token, nitrado_token, nitrado_id } from '../config.json';
import { Gameserver, Status } from './gameserver';

import colors from 'colors';

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS], partials: [
            'MESSAGE',
            'CHANNEL',
            'REACTION'
        ]
});
const gameServer = new Gameserver(nitrado_id, nitrado_token)


client.once('ready', async () => {
    log(colors.green('Bot is Ready.'));
    if (client.user) {
        log(colors.green(`Bot is logged in as ${colors.yellow(client.user.tag)}. `));
        log(colors.green(`Bot is running on ${colors.yellow(client.guilds.cache.size.toString())} servers.`));
        log("--------------------------------------------------");
        log(colors.yellow("Starting Nitrado API Ping..."));
        await gameServer.ping().then(response => {
            if (response.status == 'success') {
                log(colors.green(`Ping to Nitrado API was ${colors.green('successful')}.`));
            }
            else {
                log(`${response.message}`)
                log(colors.red(`Ping to Nitrado API was unsuccessful. Exiting...`));
                process.exit(1);
            }
        });
    }

    async function scheduleAsync() {
        await updateStatus();
        setTimeout(scheduleAsync, 10000);
    }

    setImmediate(scheduleAsync);
});


client.on('messageCreate', async message => {
    // quit if message is from bot
    if (message.author.bot) return;

    const { content } = message;
    if (content === '!ping') {
        gameServer.ping().then(async response => {
            let responseEmbed = await message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('YELLOW')
                        .setTitle("Ping")
                        .setDescription("Pinging Nitrado API...")
                        .setTimestamp()
                ]
            });
            log(colors.green(`Ping to Nitrado API was ${response.status == 'success' ? colors.green('successful') : colors.red('unsuccessful')} by ${colors.yellow(message.author.tag)}.`));
            return await responseEmbed.edit({ embeds: [sendResponseEmded(response.status, response.status == 'success' ? 'Ping to Nitrado API was successful.' : 'Ping to Nitrado API was unsuccessful.')] })
            
        });
    }
    if (content === '!restart' || content === '!start') {
        gameServer.restart().then(async response => {
            log(colors.green(`Server got started by ${colors.yellow(message.author.tag)}. ${response.status == 'success' ? colors.green(response.status) : colors.red(response.status)}`));
            return await message.reply({ embeds: [sendResponseEmded(response.status, response.message)] });
        })
    }
    else if (content === '!stop') {
        gameServer.stop().then(async response => {
            log(colors.green(`Server got stopped by ${colors.yellow(message.author.tag)}.  ${response.status == 'success' ? colors.green(response.status) : colors.red(response.status)}`));
            return await message.reply({ embeds: [sendResponseEmded(response.status, response.message)] });
        });
    }
});



function sendResponseEmded(status: Status, message: string): MessageEmbed {
    const responseEmded = new MessageEmbed()
        .setColor(status == 'success' ? 'GREEN' : 'RED')
        .setTitle(status.toLocaleUpperCase())
        .setDescription(message)
        .setTimestamp()

    return responseEmded;
}

async function updateStatus() {
    log(colors.yellow('Updating status...'));
    let status = await gameServer.getStatus();
    switch (status) {
        case 'started':
            client.user?.setStatus('online');
            break;
        case 'stopped':
            client.user?.setStatus('dnd');
            break;
        case 'restarting':
        case 'stopping':
            client.user?.setStatus('idle');
            break;
    }
    let players = await gameServer.getOnlinePlayers();
    log(colors.green(`Server ${colors.yellow(status)} with ${colors.yellow(players.length.toString())} players online.`));
    await client.user?.setActivity({ name: `Server ${status} ${players.length == 0 ? 'no' : players.length} players online`, type: 'PLAYING' })
}

function log(message: string) {
    console.log(getTime() + message);
}

function getTime(): string {
    let dateTime = new Date()
    return colors.gray(`[${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}] `);
}

client.login(token);