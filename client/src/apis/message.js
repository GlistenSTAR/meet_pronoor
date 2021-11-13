import api from '../utils/api';
import { messages } from '../store';
import isEmpty from '../../../validation/is-empty';

// Save message
export const saveMessage = async (msgData) => {
  const res = await api.post('/messages/saveMessage', msgData);

  if (res.msg === 'success') {
    console.log(res.msg);
    return res.msg;
  } else {
    console.log(res.data);
  }
}

// Get messages
export const getMessages = async receiver => {
  const res = await api.get(`/messages/getMessages/${receiver}`);

  if (res.msg === 'success') {
    messages.set(res.messages);
    // console.log(res.messages)
    return res.msg;
  } else {
    console.log(res.data);
  }
}