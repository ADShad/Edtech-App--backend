const db = require("../../Config/connection");
const methodMappingModel = db.methodMappingModel;
const courseMappingModel = db.courseMappingModel

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