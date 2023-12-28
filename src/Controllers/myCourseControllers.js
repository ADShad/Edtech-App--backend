const db = require('../../Config/connection');
const { Op } = require('sequelize');
const usersModel = db.usersModel;
const videosModel = db.videosModel;
const historyModel = db.historyModel;
exports.saveCourseandMethod = async (req, res) => {
    try {
        const { userId, courseId, methodId } = req.body;
        const currentDate = new Date();
        const [updateCourseandMethod] = await usersModel.update(
            {
                active_courseid: courseId,
                study_methodid: methodId,
                course_start_date: currentDate,
            },
            { where: { id: userId } }
        );
        if (updateCourseandMethod === 0) {
            return res.status(404).json({
                status: false,
                message: 'User not found',
            });
        } else {
            res.status(200).json({
                status: true,
                message: 'Course and Method saved successfully',
            });
        }
    } catch (error) {
        console.error('Error saving course and method:', error);
        res.status(500).json({ error: 'Error saving course and method' });
    }
}


exports.videos = async (req, res) => {
    try {
        const { userId, methodId } = req.body;

        // Get user information
        if (methodId === 1 || methodId === 3) {
            const user = await usersModel.findOne({
                attributes: ['active_courseid', 'course_start_date'],
                where: { id: userId },
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const courseId = user.active_courseid;
            const courseStartDate = user.course_start_date;

            // Get videos for the course
            const videos = await videosModel.findAll({
                attributes: ['video_id', 'video_url'],
                where: { course_id: courseId },
                order: [['video_id', 'ASC']],
            });

            if (!videos || videos.length === 0) {
                return res.status(404).json({ error: 'No videos found for the course' });
            }

            // Calculate dateToBeWatched for each video
            const videosWithDate = await Promise.all(
                videos.map(async (video, index) => {
                    const hoursToAdd = index * 24;
                    const dateToBeWatched = new Date(courseStartDate);
                    dateToBeWatched.setHours(dateToBeWatched.getHours() + hoursToAdd);

                    // Get DurationPercentage from history model
                    const durationRecord = await historyModel.findOne({
                        attributes: ['progress'],
                        where: { content_id: video.video_id, content_type: 'video' },
                    });

                    const durationPercentage = durationRecord ? durationRecord.progress : 0;

                    return {
                        videoId: video.video_id,
                        url: video.video_url,
                        durationPercentage,
                        dateToBeWatched,
                    };
                })
            );

            res.status(200).json(videosWithDate);
        } else {
            res.status(200).json({ message: "milestone ka bake hai" });
        }
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
