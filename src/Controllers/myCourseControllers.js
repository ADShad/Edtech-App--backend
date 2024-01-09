const db = require('../../Config/connection');
const { Op } = require('sequelize');
const topicsModel = require('../Models/topicsModel');
const chaptersModel = db.chaptersModel;
const sequelize = db.sequelize;
const usersModel = db.usersModel;
const videosModel = db.videosModel;
const courseMappingModel = db.courseMappingModel;
const TopicsModel = db.topicsModel;
const notesModel = db.notesModel;
const subjectsModel = db.subjectsModel;
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

exports.video = async (req, res) => {
    try {
        const { videoId } = req.body;
        const query = `
            SELECT 
                v.video_id,
                v.video_url,
                v.course_id,
                v.topic_id,
                v.subject_id,
                v.created_at,
                t.topic_name,
                t.description AS topic_description,
                s.subject_name,
                cm.course_title AS course,
                n.notes_url
            FROM Videos v
            LEFT JOIN Topics t ON v.topic_id = t.topic_id
            LEFT JOIN Subjects s ON v.subject_id = s.subject_id
            LEFT JOIN Notes n ON v.topic_id = n.topic_id
            LEFT JOIN course_mapping cm ON v.course_id = cm.course_id
            WHERE v.video_id = ${videoId};
        `;
        const [result, meta] = await sequelize.query(query)

        if (result && result.length > 0) {
            result[0].testId = 1;

            res.status(200).json({
                videoId: result[0].video_id,
                videoUrl: result[0].video_url,
                TopicId: result[0].topic_id,
                courseName: result[0].course,
                subjectName: result[0].subject_name,
                description: result[0].topic_description,
                videoCreatedAt: result[0].created_at,
                notesUrl: result[0].notes_url,
                testId: result[0].testId,
            });
        } else {
            res.status(404).json({ error: 'Video not found' });
        }
    } catch (error) {
        console.error('Error fetching video:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getNotes = async (req, res) => {
    try {
        const { subjectId } = req.body;

        // Fetching notes
        const notes = await notesModel.findAll({
            attributes: ['notes_id', 'notes_url', 'chapter_id', 'subject_id'],
            where: { subject_id: subjectId },
        });

        if (!notes || notes.length === 0) {
            return res.status(404).json({ error: 'Notes not found' });
        }

        // Fetching chapter name
        const chapters = await chaptersModel.findAll({
            attributes: ['chapter_id', 'chapter_name'],
            where: { subject_id: subjectId },
        });

        // Mapping notes and chapter data
        const notesDetails = notes.map(note => {
            const chapter = chapters.find(chap => chap.chapter_id === note.chapter_id);
            return {
                notesId: note.notes_id,
                notesUrl: note.notes_url,
                chapterName: chapter ? chapter.chapter_name : 'Unknown Chapter',
                // Add subjectName property if you fetch subject name
            };
        });
        console.log(notesDetails);
        res.status(200).json(notesDetails);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.milestone = async (req, res) => {
    try {
        const { topicId } = req.query;

        const videosQuery = `
            SELECT v.video_id, v.video_url, t.topic_name, t.description
            FROM Videos AS v
            INNER JOIN Topics AS t ON v.topic_id = t.topic_id
            WHERE v.topic_id = ${topicId};
        `;

        const videos = await sequelize.query(videosQuery, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { topicId: topicId },
        });

        const notesQuery = `
            SELECT n.notes_id, n.notes_url, t.topic_name, t.description
            FROM Notes AS n
            INNER JOIN Topics AS t ON n.topic_id = t.topic_id
            WHERE n.topic_id = ${topicId};
        `;

        const notes = await sequelize.query(notesQuery, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { topicId: topicId },
        });

        res.status(200).json({
            success: true,
            message: "Milestone Content Retrieved",
            data: {
                videos: videos,
                notes: notes
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
