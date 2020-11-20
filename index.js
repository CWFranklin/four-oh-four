require('dotenv').config()

const https = require('https')
const fetch = require('node-fetch')
const { exit } = require('process')

const url = process.env.URL
const intervalTime = process.env.INTERVAL || 60

const discordWebhook = process.env.DISCORD_WEBHOOK
const discordRoleId = process.env.DISCORD_ROLE_ID

if (url === undefined || discordWebhook === undefined) {
    console.log('Missing URL or Webhook params')
    exit
}

const statusCodes = process.env.STATUS_CODES

console.log('---------------------------------------------')
console.log(` ______   ______     __  __     ______    
/\\  ___\\ /\\  __ \\   /\\ \\/\\ \\   /\\  == \\   
\\ \\  __\\ \\ \\ \\/\\ \\  \\ \\ \\_\\ \\  \\ \\  __<   
 \\ \\_\\    \\ \\_____\\  \\ \\_____\\  \\ \\_\\ \\_\\ 
  \\/_/     \\/_____/   \\/_____/   \\/_/ /_/ 
                                          
 ______     __  __                        
/\\  __ \\   /\\ \\_\\ \\                       
\\ \\ \\/\\ \\  \\ \\  __ \\                      
 \\ \\_____\\  \\ \\_\\ \\_\\                     
  \\/_____/   \\/_/\\/_/                     
                                          
 ______   ______     __  __     ______    
/\\  ___\\ /\\  __ \\   /\\ \\/\\ \\   /\\  == \\   
\\ \\  __\\ \\ \\ \\/\\ \\  \\ \\ \\_\\ \\  \\ \\  __<   
 \\ \\_\\    \\ \\_____\\  \\ \\_____\\  \\ \\_\\ \\_\\ 
  \\/_/     \\/_____/   \\/_____/   \\/_/ /_/ 
                                            `)
console.log('---------------------------------------------')
console.log('Monitoring: ' + url)
console.log('Interval (s): ' + intervalTime)
console.log('Reporting on: ' + statusCodes)
console.log('---------------------------------------------')


function informWebhook(statusCode) {
    fetch(discordWebhook, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            content: discordRoleId + ' ' + url + ' now has a status of ' + statusCode
        })
    })
    .then(res => console.log(res))
    .catch(err => console.error(err))
}


function intervalFunc() {
    let options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.193 Safari/537.36',
        }
    }

    https.get(url, options, (res) => {
        let statusCode = res.statusCode

        console.log(
            new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') +
            ' | ' +
            statusCode
        )

        if (statusCodes.includes(statusCode)) {
            informWebhook(statusCode)
        }
    })

    clearInterval(interval)
}

var interval = setInterval(intervalFunc, intervalTime * 1000)

intervalFunc()
