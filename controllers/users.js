const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/user');
const Message = require('../models/message');

const { deleteFile } = require('../utils/fileHelper');

const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const validateUpdateInput = require('../validation/updateUser');
const validateChangePwInput = require('../validation/changePw');
const isEmpty = require('../validation/is-empty');

exports.loadUser = async (req, res) => {
  // console.log(req.user);
  try {
    const user = await User.findByPk(req.user.id);
    res.json({ user, msg: 'success' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

exports.signup = async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!isEmpty(user)) {
      errors.email = "This email already exists";
      return res.status(400).json(errors);
    }

    const user2 = await User.findOne({ where: { nickname: req.body.nickname } });

    if (!isEmpty(user2)) {
      errors.nickname = "This nickname already exists";
      return res.status(400).json(errors);
    }

    const newUser = {
      nickname: req.body.nickname,
      email: req.body.email,
      password: req.body.password,
      avatar: 'avatars/default.png'
    };

    const salt = await bcrypt.genSalt(10);

    newUser.password = await bcrypt.hash(req.body.password, salt);

    await User.create(newUser);

    res.json({ msg: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

exports.signin = async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (isEmpty(user)) {
      errors.email = "This email not registered";
      return res.status(400).json(errors);
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      errors.password = "Invalid password";
      return res.status(400).json(errors);
    }

    await User.update({
      status: 'on'
    }, {
      where: {
        email: req.body.email
      }
    });

    const payload = {
      user: {
        id: user.id,
        nickname: user.nickname,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: '1 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token: token, msg: 'success' });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

exports.updateUserData = async (req, res) => {
  const { errors, isValid } = validateUpdateInput(req.body);
  // console.log(req.file.path)

  if (!isValid) {
    return res.status(400).json(errors);
  }
  try {
    if (isEmpty(req.file)) {
      await User.update({
        nickname: req.body.nickname,
        email: req.body.email
      }, {
        where: {
          id: req.user.id
        }
      });
    } else {
      await User.update({
        nickname: req.body.nickname,
        email: req.body.email,
        avatar: req.file.path.slice(14)
      }, {
        where: {
          id: req.user.id
        }
      });
    }

    res.json({ msg: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

exports.changePassword = async (req, res) => {
  const { errors, isValid } = validateChangePwInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const user = await User.findByPk(req.user.id);

    const isMatch = await bcrypt.compare(req.body.oldPw, user.password);

    if (!isMatch) {
      errors.oldPw = "Current password incorrect";
      return res.status(400).json(errors);
    }

    const salt = await bcrypt.genSalt(10);

    const newPw = await bcrypt.hash(req.body.password, salt);

    await User.update({
      password: newPw
    }, {
      where: {
        id: req.user.id
      }
    });

    res.json({ msg: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

exports.getUsers = async (req, res) => {
  try {
    let users = await User.findAll();

    // const index = users.findIndex(user => {
    //   return user.id.toString() === req.user.id.toString();
    // });

    // users.splice(index, 1);

    users.sort((a, b) => {
      var x = a.nickname.toLowerCase();
      var y = b.nickname.toLowerCase();
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });

    res.json({ users: users, msg: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

exports.getUsersExpOne = async (req, res) => {
  try {
    let users = await User.findAll();

    const index = users.findIndex(user => {
      return user.nickname === req.params.nickname;
    });

    users.splice(index, 1);

    users.sort((a, b) => {
      var x = a.nickname.toLowerCase();
      var y = b.nickname.toLowerCase();
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });

    res.json({ users: users, msg: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

exports.getFriends = async (req, res) => {
  try {
    let users = await User.findAll();

    let index = users.findIndex(user => {
      return user.id.toString() === req.user.id.toString();
    });

    users.splice(index, 1);

    // index = users.findIndex(user => {
    //   return user.role.toString() === 'admin';
    // });

    // users.splice(index, 1);

    users.sort((a, b) => {
      var x = a.nickname.toLowerCase();
      var y = b.nickname.toLowerCase();
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });

    res.json({ users: users, msg: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

exports.logoutUser = async (req, res) => {
  try {
    await User.update({
      status: 'off'
    }, {
      where: {
        id: req.user.id
      }
    });

    res.json({ msg: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.destroy({
      where: {
        nickname: req.params.nickname
      }
    });

    const fileMessage = await Message.findAll({
      where: {
        sender: req.params.nickname,
        message_type: 'file'
      }
    });

    fileMessage.forEach(message => {
      deleteFile(path.join(__dirname, '../client/public/', message.filepath));
    });

    await Message.destroy({
      where: {
        sender: req.params.nickname
      }
    });

    // await Message.destroy({
    //   where: {
    //     receiver: req.params.nickname
    //   }
    // });

    res.json({ msg: 'success' })
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

// Change role
exports.changeRole = async (req, res) => {
  try {
    await User.update({
      role: req.body.role
    }, {
      where: {
        nickname: req.body.nickname
      }
    });

    res.json({ msg: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

// Set user's state
exports.setState = async (req, res) => {
  try {
    await User.update({
      block: req.body.state
    }, {
      where: {
        nickname: req.body.nickname
      }
    });

    res.json({ msg: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}