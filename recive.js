const amqp = require('amqplib');
const exchangeName = 'directMassage';
const logType=process.argv.slice(2); //error, info , warning
const receiveData = async () => {
    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, "direct");
    const assertedQoueue = await channel.assertQueue('', { exclusive: true });
    for(const pattern of logType){
        channel.bindQueue(assertedQoueue.queue,exchangeName,pattern)   
    }
    channel.consume(assertedQoueue.queue, msg => {
        console.log(msg.content.toString());
    })
}
receiveData();