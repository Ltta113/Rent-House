const db = require('../models');
const bcrypt = require('bcryptjs');
const { response } = require('express');
const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');
require('dotenv').config();

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
};

const registerService = async ({ name, phone, password }) => {
    try {
        const hashedPassword = await hashPassword(password);
        const [user, created] = await db.User.findOrCreate({
            where: { phone },
            defaults: {
                phone,
                name,
                password: hashedPassword,
                id: v4()
            }
        });
        const token = created ? jwt.sign({ id: user.id, phone: user.phone }, process.env.SECRET_KEY, { expiresIn: '2d' }) : null;
        return {
            err: token ? 0 : 2,
            msg: token ? 'Register is successful' : 'Phone number has already been used!',
            token: token
        };
    } catch (error) {
        throw error;
    }
};

const loginService = async ({ phone, password }) => {
    try {
        const user = await db.User.findOne({
            where: { phone },
            raw: true
        });

        const isPasswordCorrected = user && bcrypt.compareSync(password, user.password)
        const token = isPasswordCorrected ? jwt.sign({ id: user.id, phone: user.phone }, process.env.SECRET_KEY, { expiresIn: '2d' }) : null;
        return {
            err: token ? 0 : 2,
            msg: token ? 'Login is successful' : user ? 'Password is wrong!' : 'Phone number not found!',
            token: token
        };
    } catch (error) {
        throw error;
    }
};

module.exports = { registerService, loginService };
