const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account, User } = require('../db');
const { default: mongoose } = require('mongoose');
const zod = require('zod');

const router = express.Router();


router.get('/balance', authMiddleware, async function (req, res) {

    const userId = req.userId;
    if (!userId) {
        return res.status(411).json({
            message: "Something went wrong please try again later"
        })
    }

    const accountData = await Account.findOne({ userId: userId })


    res.json({
        balance: accountData.balance
    })
})

// const transferSchema = zod.object({
//     to:zod.string(),
//     amount: zod.number()
// })

router.post('/transfer', authMiddleware, async (req, res) => {
    const { amount, to } = req.body;
    
    // const {success} = transferSchema.safeParse(req.body)
    

    // if(!success){
    //     return res.status(411).json({
    //         message:"Invalid input data"
    //     })
    // }
    const session = await mongoose.startSession();

    session.startTransaction();

    const userId = req.userId;


    const account = await User.findOne({ _id: userId }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: 'Insufficient balance'
        });
    }

    const toAccount = await User.findOne({ _id: to }).session(session);
    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: 'Invalid Account'
        });
    }

    // Perform the transfer
    await Account.updateOne({ userId: userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    await session.commitTransaction();

    res.json({
        message: "Transfer successful"
    })


})



module.exports = router