const amqp = require('amqplib')

const publish = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost')
        const channel = await connection.createChannel()
        
        const exchange = 'direct_logs';
        await channel.assertExchange(exchange, 'direct', {
            durable: false
        })
       
        const message = 'Hola Cabron!!! ' + new Date().toISOString()
        const severity = ['Info', 'Warning', 'Error'].sort(() => Math.random() - 0.5)

        await channel.publish(exchange, severity[0], Buffer.from(message, 'utf8'))
        console.log('[x] Sent %s', message)
                
        await channel.close()
        await connection.close()
    } catch (error) {
        console.log('An Unexpected Error Occurred !!!')
        console.log(error.message)        
    }
}

async function main() {
    setInterval(async () => {
        await publish();
    }, 100);
}

main()