const express = require('express');
const zod = require('zod');
const { User, Account } = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const { authMiddleware } = require('../middleware');

const router = express.Router();

const signupSchema = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),

})


router.post('/signup', async (req, res) => {
    const body = req.body;
    const { success } = signupSchema.safeParse(body)
    if (!success) {
        // console.error("Validation failed:", error);
        res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        });
        return;
    }

    const existingUser = await User.findOne({
        username: body.username
    })

    if (existingUser) {
        res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        });
        return;
    }

    const newUser = await User.create({
        username: body.username,
        firstName: body.firstName,
        lastName: body.lastName,
        password: body.password,
    })

        await Account.create({
        balance:1000,
        userId:newUser._id
    })

    const token = jwt.sign({
        userId: newUser._id
    }, JWT_SECRET)

    res.json({
        message: "user created Successfully",
        token: token,

    })

})

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
})

router.post('/signin', async (req, res) => {

    const body = req.body;
    const { success } = signinSchema.safeParse(body);
    if (!success) {
        return res.status(411).json(
            {
                message: "Incorrect inputs"
            }
        );
        // return;
    }

    const user = await User.findOne({ username: body.username, password: body.password })
    if (user) {
        const token = jwt.sign({
            userId: user._id

        }, JWT_SECRET)

        res.json({
            token: token
        })
        return;
    }

    return res.status(411).json(
        {
            message: "Error while logging in"
        }
    );

})


const updateSchema = zod.object({
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
    password: zod.string().optional(),
})

router.put('/', authMiddleware, async (req, res) => {

    const body = req.body;

    const { success } = updateSchema.safeParse(body);

    if (!success) {
        return res.status(411).json({
            message: "Error while updating information"
        })
    }

    const users = await User.updateOne({
        _id: req.userId
    }, body
    );
    res.json({
        message: "Updated successfully"
    })
})


router.get('/bulk', async (req, res) => {

    const filter = req.query.filter || '';

    const users = await User.find({
        $or: [
            {
                firstName: {
                    '$regex': filter,
                }
            },
            {
                lastName: {
                    '$regex': filter,
                }
            }
        ]

    })

    res.json({
        user: users.map( user => ({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username
        }))
    })


})

router.get('/me',authMiddleware,async(req,res)=>{

    const user = await User.findOne({_id:req.userId})

    return res.json({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
    })
})

module.exports = router