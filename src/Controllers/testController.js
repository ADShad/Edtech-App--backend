const db = require('../../Config/connection');
const { Op, Sequelize } = require('sequelize');
const testsModel = db.testsModel;
const questionsModel = db.questionsModel;
exports.testapi = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: 'test api' });
    } catch (error) {
        console.log(error
        );
    }
}

exports.createTest = async (req, res) => {
    try {
        const { user_id, chapter_ids, test_type, total_question, duration_per_question, pattern, name, question_level } = req.body;
        const test = await testsModel.create({
            user_id: user_id,
            chapter_ids: chapter_ids,
            test_type: test_type,
            total_question: total_question,
            duration_per_question: duration_per_question,
            pattern: pattern,
            name: name,
            question_level: question_level
        });

        res.status(200).json({ success: true, message: 'test created successfully', data: test });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error creating test' });
    }
}

exports.getTestQuestions = async (req, res) => {
    try {
        const { test_id } = req.query;
        const test = await testsModel.findOne({
            where: { test_id: test_id },
            attributes: ['test_id', 'chapter_ids', 'test_type', 'total_question', 'duration_per_question', 'pattern', 'name', 'question_level']
        });

        if (!test) {
            return res.status(404).json({
                status: false,
                message: 'Test not found',
            });
        }

        const allQuestions = await questionsModel.findAll({
            where: { chapter_id: { [Op.in]: test.chapter_ids }, question_level: test.question_level },
            attributes: ['question_id', 'question_text', 'options', 'correct_option_index', 'negative_marking', 'question_level', 'chapter_id', 'section'],
            // order: Sequelize.literal('RAND()'), // Add this line to get random questions
        });
        // console.log(allQuestions.length);
        let selectedQuestions = [];

        switch (test.pattern) {
            case 0:
                const section1QuestionCount = Math.ceil(test.total_question * 0.3);
                const section0QuestionCount = test.total_question - section1QuestionCount;
                // console.log(section1QuestionCount, section0QuestionCount);
                const section1Questions = allQuestions.filter(question => question.dataValues.section === 1).slice(0, section1QuestionCount);
                const section0Questions = allQuestions.filter(question => question.dataValues.section === 0).slice(0, section0QuestionCount);
                // console.log(section1Questions.length, section0Questions.length);
                selectedQuestions = [...section1Questions, ...section0Questions];
                break;

            case 1:
                // Equal distribution among selected chapter IDs
                const questionsPerChapter = Math.floor(test.total_question / test.chapter_ids.length);
                console.log(questionsPerChapter);
                for (const chapterId of test.chapter_ids) {
                    const chapterQuestions = allQuestions.filter(question => question.chapter_id === chapterId).slice(0, questionsPerChapter);
                    selectedQuestions.push(...chapterQuestions);
                }
                break;

            default:
                // Random percent distribution among selected chapter IDs
                selectedQuestions = allQuestions.slice(0, test.total_question);
                break;
        }

        res.status(200).json({
            success: true,
            message: 'Successfully fetched test questions',
            durationPerQuestion: test.duration_per_question,
            questions: selectedQuestions,
            TotalQuestions: selectedQuestions.length,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error fetching test questions' });
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
