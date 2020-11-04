const amqp = require('amqplib')

const consume = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost')
        const channel = await connection.createChannel()
        
        const exchange = 'logs';
        await channel.assertExchange(exchange, 'fanout', {
            durable: false
        })

        const queueInfo = await channel.assertQueue('', {
            exclusive: true
        })

        await channel.bindQueue(queueInfo.queue, exchange, '')

        await channel.consume(queueInfo.queue, msg => {
            const body = msg.content.toString();
            console.log(" [x] Received '%s'", body);
        }, { noAck: true })
    } catch (error) {
        console.log('An Unexpected Error Occurred !!!')
        console.log(error.message)        
    }
}

consume()