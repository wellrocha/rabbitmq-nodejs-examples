const amqp = require('amqplib')

const consume = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost')
        const channel = await connection.createChannel()
        
        const exchange = 'direct_logs';
        await channel.assertExchange(exchange, 'direct', {
            durable: false
        })

        const errorQueueInfo = await channel.assertQueue('error_logs', {
            exclusive: true
        })

        let severity = 'Error'
        await channel.bindQueue(errorQueueInfo.queue, exchange, severity)            

        const queueInfo = await channel.assertQueue('', {
            exclusive: true
        })

        const logLevels = ['Info', 'Warning'] 
        for (const severity of logLevels) {
            await channel.bindQueue(queueInfo.queue, exchange, severity)            
        }

        await channel.consume(queueInfo.queue, msg => {
            console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString())
        }, { noAck: true })

        await channel.consume(errorQueueInfo.queue, msg => {
            console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString())
        }, { noAck: true })
    } catch (error) {
        console.log('An Unexpected Error Occurred !!!')
        console.log(error.message)        
    }
}

consume()