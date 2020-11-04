const amqp = require('amqplib')

const publish = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost')
        const channel = await connection.createChannel()
        
        const queueName = 'hello'
        const queue = await channel.assertQueue(queueName, { durable: false })
        if (queue) {
            const message = 'Hola Cabron!!! ' + new Date
            await channel.sendToQueue(queueName, Buffer.from(message, 'utf8'))
            console.log('[x] Sent %s', message)
        }
        
        await channel.close()
        await connection.close()
    } catch (error) {
        console.log('An Unexpected Error Occurred !!!')
        console.log(error.message)        
    }
}

publish()