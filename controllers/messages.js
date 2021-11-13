const Message = require('../models/message');

const isEmpty = require('../validation/is-empty');

// Save message
exports.createMessage = async (req, res) => {
  if (isEmpty(req.body.message)) {
    return res.status(400).json({ msg: 'Input message!' });
  }

  try {
    const newMsg = {
      sender: req.body.sender,
      receiver: req.body.receiver,
      message: req.body.message,
      sender_time: req.body.sender_time,
    }

    await Message.create(newMsg);

    res.json({ msg: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}


// Get message
exports.getMessages = async (req, res) => {
  try {
    let messages = [];

    let senderMessage = await Message.findAll({
      where: {
        sender: req.user.nickname,
        receiver: req.params.receiver
      }
    });

    let receiveMessages = await Message.findAll({
      where: {
        receiver: req.user.nickname,
        sender: req.params.receiver
      }
    });

    if (!isEmpty(senderMessage) && !isEmpty(receiveMessages)) {
      messages = senderMessage.concat(receiveMessages);
    } else if (isEmpty(messages) && !isEmpty(receiveMessages)) {
      messages = receiveMessages;
    } else if (!isEmpty(messages) && isEmpty(receiveMessages)) {
      messages = senderMessage;
    }

    messages.sort((a, b) => {
      return a.createdAt - b.createdAt;
    });

    res.json({ messages: messages, msg: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}