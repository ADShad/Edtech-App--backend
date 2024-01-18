const db = require('../../Config/connection');
const { Op, Sequelize } = require('sequelize');
const testsModel = db.testsModel;
const questionsModel = db.questionsModel;
const testHistoryModel = db.testsHistoryModel;
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

exports.saveTestProgress = async (req, res) => {
    try {
        const { user_id, test_id, question_id, option_selected, time_taken } = req.body;

        const question = await questionsModel.findOne({
            where: { question_id: question_id },
            attributes: ['question_id', 'correct_option_index', 'negative_marking']
        });

        let marks = 0;
        let negative_marks = 0;
        let correct_answer = null;

        if (option_selected === question.correct_option_index) {
            marks = 4;
            correct_answer = question.correct_option_index;
        } else {
            negative_marks = question.negative_marking;
        }

        const testHistory = await testHistoryModel.findOne({
            where: { user_id: user_id, test_id: test_id },
            attributes: ['test_history_id']
        });

        if (testHistory) {
            await testHistoryModel.update({
                user_answers: Sequelize.fn('JSON_ARRAY_APPEND', Sequelize.col('user_answers'), '$', option_selected),
                attempted_questions: Sequelize.fn('JSON_ARRAY_APPEND', Sequelize.col('attempted_questions'), '$', question_id),
                time_taken: Sequelize.fn('JSON_ARRAY_APPEND', Sequelize.col('time_taken'), '$', time_taken),
                positive_marks: Sequelize.literal(`positive_marks + ${marks}`),
                negative_marks: Sequelize.literal(`negative_marks + ${negative_marks}`),
                correct_answers: correct_answer !== null ? Sequelize.fn('JSON_ARRAY_APPEND', Sequelize.col('correct_answers'), '$', correct_answer) : Sequelize.col('correct_answers'),
            }, {
                where: { user_id: user_id, test_id: test_id }
            });

            res.status(200).json({ success: true, message: 'Test history updated successfully', marks: marks });
        } else {
            await testHistoryModel.create({
                user_id: user_id,
                test_id: test_id,
                user_answers: [option_selected],
                attempted_questions: [question_id],
                time_taken: [time_taken],
                positive_marks: marks,
                negative_marks: negative_marks,
                correct_answers: correct_answer !== null ? [correct_answer] : [],
            });

            res.status(201).json({ success: true, message: 'Test history created successfully', marks: marks });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};

exports.submitTest = async (req, res) => {
    try {
        const { user_id, test_id } = req.body;

        const testHistory = await testHistoryModel.findOne({
            where: { user_id: user_id, test_id: test_id },
            attributes: ['positive_marks', 'negative_marks', 'correct_answers', 'user_answers', 'attempted_questions', 'time_taken'],
        });

        const test = await testsModel.findOne({
            where: { test_id: test_id },
            attributes: ['total_question', 'question_level'],
        });

        const total_attempted = testHistory.attempted_questions.length;
        const total_correct = testHistory.correct_answers.length;
        const total_incorrect = total_attempted - total_correct;
        const total_marks = testHistory.positive_marks - testHistory.negative_marks;
        const timeTakenArray = testHistory.time_taken || [];
        const average_time_taken = timeTakenArray.length > 0 ? timeTakenArray.reduce((sum, value) => sum + value, 0) / timeTakenArray.length : 0;
        const accuracy = (total_correct / total_attempted) * 100;
        let Recommendations;
        if (accuracy > 70) {
            Recommendations = {
                FirstPoint: "You are doing great, keep it up!",
                SecondPoint: "Focus on other weak areas",
            }
        } else {
            Recommendations = {
                FirstPoint: "Watch the video again",
                SecondPoint: "Pay Attention to crucial Topics!",
            }
        }
        const testResult = {
            average_time_taken,
            total_question: test.total_question,
            question_level: test.question_level,
            total_attempted,
            total_correct,
            total_incorrect,
            negative_marks: -1,
            total_marks,
            accuracy,
            Recommendations,
            test_level: test.question_level,
        };

        res.status(200).json({
            success: true,
            message: 'Test submitted successfully',
            testResult,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
}