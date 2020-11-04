const amqp = require('amqplib')

const publish = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost')
        const channel = await connection.createChannel()
        
        const queueName = 'task_queue'
        await channel.assertQueue(queueName, { durable: true })
        
        const message = 'Hola Cabron!!! ' + new Date().toISOString()
        await channel.sendToQueue(queueName, Buffer.from(message, 'utf8'), { persistent: true })
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