const amqp = require('amqplib')

const getMessage = (msg) => {
    const body = msg.content.toString();
    console.log(" [x] Received '%s'", body);
}

const consume = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost')
        const channel = await connection.createChannel()
        
        const queueName = 'hello'
        await channel.assertQueue(queueName, { durable: false })
        await channel.consume(queueName, getMessage, {noAck: true})
        
        await channel.close()
        await connection.close()
    } catch (error) {
        console.log('An Unexpected Error Occurred !!!')
        console.log(error.message)        
    }
}

consume()