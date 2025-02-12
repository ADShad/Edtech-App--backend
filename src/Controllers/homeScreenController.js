const db = require('../../Config/connection');
const { Op } = require('sequelize');
const MeetingScheduleModel = db.MeetingSchedule;
exports.getBannerUrls = async (req, res) => {
    try {
        const urls = [
            "https://descriptionimagesioasis.s3.ap-south-1.amazonaws.com/Banner.PNG",
            "https://descriptionimagesioasis.s3.ap-south-1.amazonaws.com/Banner2.jpeg",
            "https://descriptionimagesioasis.s3.ap-south-1.amazonaws.com/Banner3.jpeg",
        ]
        res.status(200).json({ urls });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getQuotes = async (req, res) => {
    try {
        const quotes = [
            "Smart work is the ability to outthink challenges rather than just outwork them.",
            "Consistency is the silent engine driving extraordinary results.",
            "Hustle is the currency of success in a world of opportunity.",
            "Smart work is the art of achieving more with less effort.",
            "Consistency is the habit that turns aspirations into achievements.",
            "Hustle isn't about waiting for the storm to pass; it's about learning to dance in the rain.",
            "Smart work is about strategic thinking and calculated actions.",
            "Consistency is the commitment to excellence, day in and day out.",
            "Hustle is the willingness to put in the work when nobody is watching.",
            "Smart work is about working intelligently, not incessantly.",
            "Consistency is the foundation upon which greatness is built.",
            "Hustle until your dreams become your reality.",
            "Smart work is about maximizing results while minimizing effort.",
            "Consistency is the key that unlocks the door to success.",
            "Hustle is the relentless pursuit of one's goals, despite setbacks and obstacles.",
            "Smart work is the ability to focus on what truly matters.",
            "Consistency is the difference between good and great.",
            "Hustle is the determination to succeed, no matter the odds.",
            "Smart work is about working smarter, not harder.",
            "Consistency is the habit of champions.",
            "Hustle until your haters ask if you're hiring.",
            "Smart work is about finding innovative solutions to complex problems.",
            "Consistency is the secret sauce of achievement.",
            "Hustle is the grit that turns dreams into reality.",
            "Smart work is the shortcut to success that few are willing to take.",
            "Smart work is the key to unlocking doors that hard work alone cannot.",
            "Consistency is the hallmark of the unimaginably successful.",
            "Hustle until your haters ask if you're hiring.",
            "Smart work beats hard work when hard work doesn't work smart.",
            "Consistency is the fuel that transforms small efforts into massive success.",
            "Hustle until your doubters ask if you're hiring.",
            "Smart work is knowing what to do; hard work is doing it.",
            "Consistency is the oxygen of achievement.",
            "Hustle beats talent when talent doesn't hustle.",
            "Smart work knows how to leverage time, resources, and opportunities effectively.",
            "Consistency is the bridge between goals and accomplishments.",
            "Hustle is the antithesis of mediocrity.",
            "Smart work is about maximizing efficiency without sacrificing quality.",
            "Consistency is the master key to success; without it, every other effort is futile.",
            "Hustle until your idols become your rivals.",
            "Smart work is working smarter, not harder.",
            "Consistency is the cornerstone of achievement.",
            "Hustle isn't just doing more; it's doing more of what matters.",
            "Smart work is about working on the right things at the right time.",
            "Consistency is the truest measure of commitment.",
            "Success is not the absence of failure; it's the persistence through failure.",
            "Your attitude determines your direction.",
            "Chase the vision, not the money; the money will end up following you.",
            "The only thing standing between you and your goal is the story you keep telling yourself as to why you can't achieve it.",
            "Great things never come from comfort zones.",
            "Success is liking yourself, liking what you do, and liking how you do it.",
            "The greatest glory in living lies not in never falling, but in rising every time we fall.",
            "It always seems impossible until it's done.",
            "Success is not just about what you accomplish in your life, it's about what you inspire others to do.",
            "The way to get started is to quit talking and begin doing.",
            "Don't let what you cannot do interfere with what you can do.",
            "The only limit to our realization of tomorrow is our doubts of today.",
            "Continuous improvement is better than delayed perfection.",
            "The only mistake that can truly hurt you is choosing to do nothing simply because you're too scared to make a mistake.",
            "You are braver than you believe, stronger than you seem, and smarter than you think.",
            "The future belongs to those who believe in the beauty of their dreams.",
            "Don't wait for extraordinary opportunities. Seize common occasions and make them great.",
            "Success is not just about the destination, it's also about the journey.",
            "The only person you should try to be better than is the person you were yesterday.",
            "The only thing worse than starting something and failing... is not starting something.",
            "Success isn't just about what you accomplish, it's about what you inspire others to do.",
            "The harder you work, the luckier you get.",
            "Don't let small minds convince you that your dreams are too big.",
            "Success is not for the chosen few, but for the few who choose it.",
            "The biggest risk is not taking any risk. In a world that's changing really quickly, the only strategy that is guaranteed to fail is not taking risks.",
            "The only thing that overcomes hard luck is hard work.",
            "Success is not measured by what you accomplish, but by the opposition you have encountered, and the courage with which you have maintained the struggle against overwhelming odds.",
            "The best way to predict the future is to create it.",
            "Success is not in what you have, but who you are.",
            "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
            "Work hard in silence; let success make the noise.",
            "The road to success and the road to failure are almost exactly the same.",
            "The only place where success comes before work is in the dictionary.",
            "Success is not final, failure is not fatal: It is the courage to continue that counts.",
            "The best way to predict the future is to create it.",
            "Success is walking from failure to failure with no loss of enthusiasm.",
            "The harder you work for something, the greater you'll feel when you achieve it.",
            "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
            "It's not about how bad you want it. It's about how hard you're willing to work for it.",
            "The only limit to our realization of tomorrow will be our doubts of today.",
            "The only way to do great work is to love what you do.",
            "You don't have to be great to start, but you have to start to be great.",
            "Success isn't just about what you accomplish in your life; it's about what you inspire others to do.",
            "The secret of success is to do the common thing uncommonly well.",
            "Don't count the days, make the days count.",
            "Success is the sum of small efforts repeated day in and day out.",
            "The only person you should try to be better than is the person you were yesterday.",
            "A year from now, you may wish you had started today.",
            "The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack in will.",
            "Don't stop when you're tired. Stop when you're done.",
            "The expert in anything was once a beginner.",
            "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
            "Success is not in what you have, but who you are.",
            "The only way to achieve the impossible is to believe it is possible.",
            "It does not matter how slowly you go as long as you do not stop.",
            "Success is not the result of spontaneous combustion. You must set yourself on fire.",
            "The only thing that stands between you and your dream is the will to try and the belief that it is actually possible.",
            "Don't wish it were easier; wish you were better.",
            "The only person you are destined to become is the person you decide to be.",
            "The key to success is to focus on goals, not obstacles.",
            "Your limitation—it's only your imagination.",
            "Success doesn't come from what you do occasionally. It comes from what you do consistently.",
            "Success is not about being the best. It's about being better than you were yesterday.",
            "Do what you have to do until you can do what you want to do.",
            "The dream is free, but the hustle is sold separately.",
            "The only limit to our realization of tomorrow is our doubts of today.",
            "You are never too old to set another goal or to dream a new dream.",
            "The only failure is not to try.",
            "The only way to do great work is to love what you do.",
            "Don't wait for opportunity. Create it.",
            "Success is the sum of small efforts, repeated day in and day out.",
            "Don't watch the clock; do what it does. Keep going.",
            "Don't let yesterday take up too much of today.",
            "The only limit to our realization of tomorrow will be our doubts of today.",
            "The secret of getting ahead is getting started.",
            "Success comes to those who are too busy to be looking for it.",
            "The only way to achieve the impossible is to believe it is possible.",
            "Opportunities don't happen, you create them.",
            "Make each day your masterpiece.",
            "The future belongs to those who believe in the beauty of their dreams.",
            "Hard work beats talent when talent doesn't work hard.",
            "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice, and most of all, love of what you are doing or learning to do.",
            "The only place where success comes before work is in the dictionary.",
            "The only way to do great work is to love what you do.",
            "Dreams don't work unless you do.",
            "There is no substitute for hard work.",
            "The difference between ordinary and extraordinary is that little extra.",
            "Success isn't always about greatness. It's about consistency. Consistent hard work leads to success. Greatness will come.",
            "Hard work without talent is a shame, but talent without hard work is a tragedy.",
            "The harder you work for something, the greater you'll feel when you achieve it.",
            "Success isn't owned. It's leased, and the rent is due every day.",
            "You can't have a million-dollar dream with a minimum-wage work ethic.",
            "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. And the only way to do great work is to love what you do.",
            "Success is the sum of small efforts, repeated day in and day out.",
            "Opportunities are usually disguised as hard work, so most people don't recognize them.",
            "Without hard work, nothing grows but weeds.",
            "There are no secrets to success. It is the result of preparation, hard work, and learning from failure.",
            "The only limit to the height of your achievements is the reach of your dreams and your willingness to work hard for them.",
            "The dictionary is the only place where success comes before work.",
            "Success is walking from failure to failure with no loss of enthusiasm.",
        ]
        res.status(200).json({ quotes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getRecommendedVideos = async (req, res) => {
    try {
        const videos = [
            {
                "title": "The Power of Habit",
                "url": "https://youtu.be/DKkiCpbREOo",
                "thumbnail": "https://descriptionimagesioasis.s3.ap-south-1.amazonaws.com/Rec2.PNG",
                "description": "The Power of Habit: Why We Do What We Do in Life and Business is a book by Charles Duhigg, a New York Times reporter, published in February 2012 by Random House. It explores the science behind habit creation and reformation. The book has reached the best seller list for The New York Times, Amazon.com, and USA Today."
            },
            {
                "title": "The 7 Habits of Highly Effective People",
                "url": "https://youtu.be/9lhLRpJnihw",
                "thumbnail": "https://descriptionimagesioasis.s3.ap-south-1.amazonaws.com/Rec3.PNG",
                "description": "The 7 Habits of Highly Effective People, first published in 1989, is a business and self-help book written by Stephen R. Covey. Covey presents an approach to being effective in attaining goals by aligning oneself to what he calls 'true north' principles based on a character ethic that he presents as universal and timeless."
            },
            {
                "title": "The Power of Now",
                "url": "https://youtu.be/O7SiBzS2uMk",
                "thumbnail": "https://descriptionimagesioasis.s3.ap-south-1.amazonaws.com/Rec1.PNG",
                "description": "The Power of Now: A Guide to Spiritual Enlightenment is a book by Eckhart Tolle. The book is intended to be a guide for day-to-day living and stresses the importance of living in the present moment and transcending thoughts of the past or future."
            },
            {
                "title": "The Power of Now",
                "url": "https://youtu.be/O7SiBzS2uMk",
                "thumbnail": "https://descriptionimagesioasis.s3.ap-south-1.amazonaws.com/Rec4.PNG",
                "description": "The Power of Now: A Guide to Spiritual Enlightenment is a book by Eckhart Tolle. The book is intended to be a guide for day-to-day living and stresses the importance of living in the present moment and transcending thoughts of the past or future."
            },
        ]
        res.status(200).json({ videos });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateMeetingSchedule = async (req, res) => {
    try {
        const { date, time_slot, call_type, mobile_number, user_id } = req.body;
        const exisingMeeting = await MeetingScheduleModel.findOne({
            where: {
                date,
                time_slot,
                call_type,
                mobile_number,
                user_id
            }
        });
        if (exisingMeeting) {
            res.status(400).json({ message: "Meeting already scheduled" });
            return;
        }
        const meeting = await MeetingScheduleModel.create({
            date,
            time_slot,
            call_type,
            mobile_number,
            user_id
        });
        res.status(200).json({ meeting });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
exports.getMeetingSchedule = async (req, res) => {
    try {
        const { user_id } = req.query;
        const meetings = await MeetingScheduleModel.findAll({
            where: {
                user_id
            }
        });
        res.status(200).json({ meetings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}