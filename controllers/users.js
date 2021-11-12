const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/user');

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

    const payload = {
      user: {
        id: user.id
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