// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set region
AWS.config.update({region: 'us-west-2'});

let counter = 0;

setInterval(sendMessage, 100);



function sendMessage() {

  const params = {
    Message: `Message Number ${++counter}`,
    TopicArn: 'arn:aws:sns:us-west-2:335083857671:database',
  };

  const publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

  publishTextPromise.then(
    function(data) {
      console.log(`Message sent to the topic ${params.TopicArn}`, params.Message);
      console.log('MessageID is ' + data.MessageId);
    }).catch(
    function(err) {
      console.error(err, err.stack);
    });
}
