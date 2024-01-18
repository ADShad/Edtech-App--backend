const db = require("../../Config/connection");
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
