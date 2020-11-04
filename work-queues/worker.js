const amqp = require('amqplib')

const consume = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost')
        const channel = await connection.createChannel()
        
        await channel.prefetch(1)

        const queueName = 'task_queue'
        await channel.assertQueue(queueName, { durable: true })
        await channel.consume(queueName, msg => {
            const body = msg.content.toString();
            console.log(" [x] Received '%s'", body);
        
            setTimeout(function() {
                console.log(" [x] Done");
                channel.ack(msg);
            }, 2 * 1000);
        }, { noAck: false })
        
    } catch (error) {
        console.log('An Unexpected Error Occurred !!!')
        console.log(error.message)        
    }
}

consume()