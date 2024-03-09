const db = require("../../Config/connection");
const questionsModel = db.questionsModel;
const testsModel = db.testsModel;
const methodMappingModel = db.methodMappingModel;
const courseMappingModel = db.courseMappingModel
const chaptersModel = db.chaptersModel;
const subjectsModel = db.subjectsModel;
const topicsModel = db.topicsModel;
exports.getCourseMapping = async (req, res) => {
    try {
        const courseMapping = await courseMappingModel.findAll({
            attributes: ['course_id', 'course_title', 'course_price'],
        });
        res.status(200).json({
            status: true,
            message: 'Course Mapping fetched successfully',
            data: courseMapping,
        });
    } catch (error) {
        console.error('Error fetching course mapping:', error);
        res.status(500).json({ error: 'Error fetching course mapping' });
    }

}

exports.getMethodMapping = async (req, res) => {
    try {
        const methodMapping = await methodMappingModel.findAll({
            attributes: ['method_id', 'method_name'],
        });
        res.status(200).json({
            status: true,
            message: 'Method Mapping fetched successfully',
            data: methodMapping,
        });
    } catch (error) {
        console.error('Error fetching method mapping:', error);
        res.status(500).json({ error: 'Error fetching method mapping' });
    }

}

exports.getSectionMapping = async (req, res) => {
    try {
        const sectionMapping = [{
            section_id: 0,
            section_name: "General Ability",
        }, {
            section_id: 1,
            section_name: "Mathematics"
        }]
        res.status(200).json({
            status: true,
            message: 'Section Mapping fetched successfully',
            data: sectionMapping,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching section mapping' });
    }
}

exports.getSubjectsMapping = async (req, res) => {
    try {
        const subjectsMapping = await subjectsModel.findAll({
            attributes: ['subject_id', 'subject_name', 'section'],
        });
        res.status(200).json({
            status: true,
            message: 'Subjects Mapping fetched successfully',
            data: subjectsMapping,
        });
    } catch (error) {
        console.error('Error fetching subjects mapping:', error);
        res.status(500).json({ error: 'Error fetching subjects mapping' });
    }
}
exports.getChaptersMapping = async (req, res) => {
    try {
        const { subjectId } = req.query;
        const chaptersMapping = await chaptersModel.findAll({
            attributes: ['chapter_id', 'chapter_name'],
        }, {
            where: { subject_id: subjectId }
        });
        res.status(200).json({
            status: true,
            message: 'Chapters Mapping fetched successfully',
            data: chaptersMapping,
        });
    } catch (error) {
        console.error('Error fetching chapters mapping:', error);
        res.status(500).json({ error: 'Error fetching chapters mapping' });
    }
}

exports.getTopicMapping = async (req, res) => {
    try {
        const { chapterId } = req.query;

        const topicsMapping = await topicsModel.findAll({
            attributes: ['topic_id', 'topic_name'],
        }, {
            where: { chapter_id: chapterId }
        });
        res.status(200).json({
            status: true,
            message: 'Topics Mapping fetched successfully',
            data: topicsMapping,
        });
    } catch (error) {
        console.error('Error fetching topics mapping:', error);
        res.status(500).json({ error: 'Error fetching topics mapping' });
    }
}

exports.patternMapping = async (req, res) => {
    try {
        const patterns = {
            'UPSC Exam Pattern': 0,
            'Equal Percent test': 1,
            'Random Percent': 2,
            'Choose Own Percent': 3,
        };

        // You can now use the 'patterns' object as needed in your code

        res.status(200).json({ success: true, patterns });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error fetching test questions' });
    }
};

exports.getQuestionBankTestIds = async (req, res) => {
    try {
        const testIds = await testsModel.findAll({
            where: {
                test_type: 'QuestionBank'
            },
            attributes: ['test_id', 'chapter_ids', 'name'],
        });

        res.status(200).json({ success: true, testIds });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error fetching test questions' });
    }
}

exports.getQuestionbankQuestions = async (req, res) => {
    try {
        const { chapter_id, level } = req.query;
        let questions;
        if (level == 1) {
            questions = await questionsModel.findAll({
                where: {
                    chapter_id: chapter_id,
                    question_level: "Easy"
                },
                attributes: ['question_id', 'test_id', 'chapter_id', 'question_text', 'question_level', 'correct_option_index', 'options', 'description'],
            });
        } else if (level == 2) {
            questions = await questionsModel.findAll({
                where: {
                    chapter_id: chapter_id,
                    question_level: "Average"
                },
                attributes: ['question_id', 'test_id', 'chapter_id', 'question_text', 'question_level', 'correct_option_index', 'options', 'description'],
            });
        }
        else {
            questions = await questionsModel.findAll({
                where: {
                    chapter_id: chapter_id,
                    question_level: "Master"
                },
                attributes: ['question_id', 'test_id', 'chapter_id', 'question_text', 'question_level', 'correct_option_index', 'options', 'description'],
            });
        }
        res.status(200).json({ success: true, questions });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error fetching test questions' });
    }
}

exports.achievementsList = async (req, res) => {
    try {
        const achievements = [
            {
                id: 1,
                name: 'Test Player',
                description: 'Level 01 - Solved 300 Test Questions',
                isAchieved: true // Assuming the user has achieved this
            },
            {
                id: 2,
                name: 'Spectator',
                description: 'Level 01 - Watched 9000 Mins of Video Lectures',
                isAchieved: false // Assuming the user has not achieved this yet
            },
            {
                id: 3,
                name: 'Champion',
                description: 'Level 01 - Productive 100 hrs spent on IOASIS',
                isAchieved: false
            },
            {
                id: 4,
                name: 'Flash Lord',
                description: 'Level 01 - Learnt 500 Flash Cards on IOASIS',
                isAchieved: false
            },
            {
                id: 5,
                name: 'Referral Rockstar',
                description: 'Level 01 - Earned Rs. 300 via Referrals',
                isAchieved: false
            },
            {
                id: 6,
                name: 'Master of Connections',
                description: 'Level 01 - Connected with 100+ Friends',
                isAchieved: false
            },
            {
                id: 7,
                name: 'Quiz Mastero',
                description: 'Level 01 - Solved 300+ Rapid Test Questions',
                isAchieved: true
            },
            {
                id: 8,
                name: 'Trail Blazer',
                description: 'Level 01 - Gained 100+ Followers on Profile',
                isAchieved: false
            }
        ];

        res.json({ success: true, achievements });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error fetching achievements' });
    }
};
