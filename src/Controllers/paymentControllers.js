const db = require("../../Config/connection");
const paymentsModel = db.paymentsModel;
const usersModel = db.usersModel;
const Razorpay = require('razorpay');
const { where } = require("sequelize");
const shortid = require("shortid")
const razorpay = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret
});
exports.payment = async (req, res) => {
    try {
        const { userId, courseIds, referralCode, isDemo } = req.body;
        if (isDemo) {
            console.log(courseIds);
            const [updatedRowsCount] = await usersModel.update(
                {
                    demoTimestamp: new Date(),
                    course_codes: courseIds,
                    active_courseid: 3,
                },
                { where: { id: userId } }
            );

            if (updatedRowsCount > 0) {
                res.status(200).json({
                    message: 'Demo started successfully',
                    order_id: '',
                    userId: userId,
                });
            } else {
                res.status(500).json({
                    error: 'Failed to start demo. User not found or no update occurred.',
                });
            }
        } else {
            const updateCourseCodes = await usersModel.update(
                {
                    course_codes: courseIds,
                    active_courseid: 3,

                },
                { where: { id: userId } }
            );
            const currency = 'INR';
            // Calculate the total amount based on the number of courses
            const amount = courseIds.reduce((totalAmount, courseId) => totalAmount + 100, 0);
            let discountAmount = amount;
            const checkReferralCode = await usersModel.findOne({
                where: {
                    referral_code: referralCode
                },
                attributes: ['id', 'referral_code_used']
            });
            console.log(checkReferralCode);
            if (!checkReferralCode && req.body.referralCode !== "") {
                console.log("here1");
                // res.status(500).json({
                //     message: 'Invalid referral code',
                // });
            }
            else if (checkReferralCode?.dataValues.referral_code_used === 1 && req.body.referralCode !== "") {
                console.log("here");
                // res.status(500).json({
                //     message: 'Referral code already used',
                // });
            }
            else {
                console.log("here2");
                if (req.body.referralCode !== "") {
                    const [updatedRowsCount] = await usersModel.update(
                        { referral_code_used: 1 },
                        { where: { id: checkReferralCode.dataValues.id } }
                    );
                    console.log(updatedRowsCount);
                    discountAmount = amount - 10;
                }
                // Log input data for debugging
                console.log('Course IDs:', courseIds);
                console.log('Total Amount:', amount);

                const payment_capture = 1;

                // Create a Razorpay order
                const options = {
                    amount: discountAmount * 100, // Razorpay expects amount in paise
                    currency: currency,
                    receipt: shortid.generate(),
                    payment_capture: payment_capture,
                };

                const order = await razorpay.orders.create(options);
                console.log('Razorpay Order:', order);

                // Create a new payment entry in the database
                const newPayment = {
                    user_id: userId,
                    order_id: order.id,
                    status: order.status,
                    amount: amount,
                    currency: currency,
                    receipt: order.receipt,
                };

                const createdPayment = await paymentsModel.create(newPayment);

                res.status(200).json({
                    message: 'Payment processed successfully',
                    orderId: order.id,
                    originalamount: amount,
                    discountamount: discountAmount,
                });
            }
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Payment processing failed' });
    }
};

exports.paymentVerification = async (req, res) => {
    try {
        const secret = 'stslBee/nIC3VI1w'
        console.log("aafter this");
        console.log(req.body.payload.payment.entity);
        console.log(req.body.payload.payment.entity.status);
        console.log(req.body.payload.payment.entity.method);
        console.log(req.body.payload.payment.entity.id);
        console.log(req.body.payload.payment.entity.contact);
        const crypto = require('crypto');
        const shasum = crypto.createHmac('sha256', secret)
        shasum.update(JSON.stringify(req.body))
        const digest = shasum.digest('hex')
        // console.log(digest, req.headers['x-razorpay-signature'])
        if (digest === req.headers['x-razorpay-signature']) {
            console.log('request is legit')

            const phoneNumberWithoutPlus = req.body.payload.payment.entity.contact.replace('+', '');
            console.log(phoneNumberWithoutPlus);

            const userId = await paymentsModel.findOne({
                where: {
                    order_id: req.body.payload.payment.entity.order_id
                },
                attributes: ['user_id']
            })
            console.log("user", userId);
            console.log(userId.dataValues);
            console.log(userId.user_id);
            if (req.body.payload.payment.entity.status === 'captured') {
                const updateIspaid = usersModel.update({
                    is_paid: 1
                },
                    {
                        where: {
                            id: parseInt(userId.user_id)
                        }
                    })
                console.log(updateIspaid)
            }
            const update = await paymentsModel.update({
                status: req.body.payload.payment.entity.status,
                method: req.body.payload.payment.entity.method,
                transaction_id: req.body.payload.payment.entity.id,
            },
                {
                    where: {
                        user_id: userId.user_id
                    }
                })
            console.log(update)
        } else {
            console.log('request is not legit')
        }
        res.json({ status: "ok" });
        // res.status(200);
    } catch (error) {
        console.log(error);
    }
}