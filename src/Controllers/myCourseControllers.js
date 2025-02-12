const db = require('../../Config/connection');
const { Op } = require('sequelize');
// const topicsModel = require('../Models/topicsModel');
const testHistoryModel = db.testsHistoryModel;
const chaptersModel = db.chaptersModel;
const sequelize = db.sequelize;
const Sequelize = db.Sequelize;
const usersModel = db.usersModel;
const videosModel = db.videosModel;
const courseMappingModel = db.courseMappingModel;
const TestModel = db.testsModel;
const TopicsModel = db.topicsModel;
const notesModel = db.notesModel;
const subjectsModel = db.subjectsModel;
const taskModel = db.taskModel;
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
            const dummyVideoNames = ["Introduction", "P N C", "Algebra", "Geometry", "Statistics", "Probability", "numerical Methods"]
            // Calculate dateToBeWatched for each video
            const videosWithDate = await Promise.all(
                videos.map(async (video, index) => {
                    let dateToBeWatched = new Date(courseStartDate);

                    // Adjust the date based on the index, skipping Sundays and Wednesdays
                    for (let i = 0; i < index; i++) {
                        dateToBeWatched.setDate(dateToBeWatched.getDate() + 1); // Increment the date by one day
                        while (dateToBeWatched.getDay() === 0 || dateToBeWatched.getDay() === 3) {
                            // If it's Sunday or Wednesday, add another day
                            dateToBeWatched.setDate(dateToBeWatched.getDate() + 1);
                        }
                    }
                    const videoName = dummyVideoNames[index % dummyVideoNames.length];
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
                        videoName
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
        const { videoId, userId } = req.body;
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
                c.chapter_name,
                n.notes_url
            FROM Videos v
            LEFT JOIN Topics t ON v.topic_id = t.topic_id
            LEFT JOIN Chapters c ON v.chapter_id = c.chapter_id
            LEFT JOIN Subjects s ON v.subject_id = s.subject_id
            LEFT JOIN Notes n ON v.topic_id = n.topic_id
            LEFT JOIN course_mapping cm ON v.course_id = cm.course_id
            WHERE v.video_id = ${videoId};
        `;
        const [result, meta] = await sequelize.query(query)
        console.log(result[0].topic_id);
        if (result && result.length > 0) {
            const query1 = `SELECT test_id FROM Tests
            WHERE JSON_CONTAINS(chapter_ids, '[${result[0].topic_id}]') AND test_type = 'RapidFire';
            `
            let istestNew = 1;
            const [result1, meta2] = await sequelize.query(query1);
            const istestHistory = await testHistoryModel.findOne({
                where: { test_id: result1[0].test_id },
                attributes: ['test_history_id']
            })
            if (istestHistory) {
                istestNew = 0;
            }
            console.log(result1[0].test_id);
            result[0].testId = result1[0].test_id;
            //check if video_id is present in the weak_areas_id array in the user table
            const user = await usersModel.findOne({
                where: { id: userId },
                attributes: ['weak_areas_id'],
            });
            let WeakArea = false;
            let weakAreasId = user.weak_areas_id;
            if (weakAreasId.includes(videoId)) {
                WeakArea = true;
            }
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
                chapterName: result[0].chapter_name,
                istestNew,
                WeakArea
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
        const { chapterId } = req.body;

        // Fetching notes
        const notes = await notesModel.findAll({
            attributes: ['notes_id', 'notes_url', 'chapter_id', 'subject_id'],
            where: { chapter_id: chapterId },
        });

        if (!notes || notes.length === 0) {
            return res.status(404).json({ error: 'Notes not found' });
        }

        // Fetching chapter name
        const chapterName = await chaptersModel.findOne({
            attributes: ['chapter_id', 'chapter_name'],
            where: { chapter_id: chapterId },
        });

        const notesDetails = notes.map(note => ({
            notesId: note.notes_id,
            notesUrl: note.notes_url,
            chapterName: chapterName.chapter_name,
        }));
        // console.log(notesDetails);
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

exports.saveProgress = async (req, res) => {
    try {
        const { userId, contentId, contentType, progress } = req.body;

        const historyRecord = await historyModel.findOne({
            where: { user_id: userId, content_id: contentId, content_type: contentType },
        });
        let contentName = '';
        if (contentType === 'video') {
            const TopicId = await videosModel.findOne({
                where: { video_id: contentId },
                attributes: ['topic_id'],
            },
            );
            contentName = await TopicsModel.findOne({
                where: { topic_id: TopicId.topic_id },
                attributes: ['topic_name'],
            });
        } else if (contentType === 'test') {
            const test = await TestModel.findOne({
                where: { test_id: contentId },
                attributes: ['test_name'],
            });
            contentName = test.test_name;
        }
        if (historyRecord) {
            await historyModel.update(
                { progress: progress },
                { where: { user_id: userId, content_id: contentId, content_type: contentType } }
            );
        } else {
            await historyModel.create({
                user_id: userId,
                content_id: contentId,
                content_type: contentType,
                content_name: contentName.topic_name,
                progress: progress,
            });
        }

        res.status(200).json({
            success: true,
            message: "Progress Saved"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

exports.getTasks = async (req, res) => {
    try {
        const { userId } = req.query;

        // Fetch user information
        const user = await usersModel.findOne({
            attributes: ['active_courseid', 'course_start_date'],
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const courseId = user.active_courseid;
        const courseStartDate = new Date(user.course_start_date);

        // Function to calculate date based on day_id and course start date
        // Function to calculate date based on day_id and course start date
        const calculateDate = (dayId) => {
            const date = new Date(courseStartDate);
            let daysToAdd = dayId - 1; // Subtract 1 to match day_id indexing

            // Loop through each day to skip Sundays and Wednesdays
            for (let i = 0; i < daysToAdd; i++) {
                date.setDate(date.getDate() + 1); // Increment date by one day

                // If the current day is Sunday or Wednesday, skip to the next day
                while (date.getDay() === 0 || date.getDay() === 3) {
                    date.setDate(date.getDate() + 1); // Skip to the next day
                }
            }

            return date;
        };


        // Fetch tasks for videos
        const videoTasks = await taskModel.findAll({
            where: { task_type: 'video' },
            order: [['day_id', 'ASC']],
        });

        // Fetch tasks for notes
        const noteTasks = await taskModel.findAll({
            where: { task_type: 'notes' },
            order: [['day_id', 'ASC']],
        });

        // Fetch tasks for tests
        const testTasks = await taskModel.findAll({
            where: { task_type: 'test' },
            order: [['day_id', 'ASC']],
        });
        // console.log(videoTasks, noteTasks, testTasks);
        // Assign dates to tasks
        const assignDates = (tasks) => {
            // console.log(tasks);
            return tasks.map(task => ({
                taskId: task.task_id,
                taskType: task.task_type,
                taskName: task.task_name,
                contentId: task.content_id,
                contentUrl: task.content_url,
                date: calculateDate(task.day_id)
            }));
        };

        // Prepare tasks with dates for response
        const videoTasksWithDates = assignDates(videoTasks);
        const noteTasksWithDates = assignDates(noteTasks);
        const testTasksWithDates = assignDates(testTasks);

        const allTasks = [...videoTasksWithDates, ...noteTasksWithDates, ...testTasksWithDates];

        // Query the history model
        const historyQueries = allTasks.map(task => ({
            content_id: task.contentId,
            content_type: task.taskType,
            user_id: userId
        }));

        // Query the history model
        const historyRecords = await Promise.all(historyQueries.map(query => historyModel.findOne({ where: query })));

        // Iterate through tasks and update them with is_done flag
        const tasksWithStatus = allTasks.map((task, index) => {
            const historyRecord = historyRecords[index];
            if (historyRecord) {
                // If history record exists, set is_done based on duration
                task.is_done = historyRecord.duration !== 0 ? 1 : 0;
            } else {
                // If no history record exists, set is_done to 0
                task.is_done = 0;
            }
            return task;
        });

        // Separate tasks into video, note, and test tasks again
        const videoTasksWithStatus = tasksWithStatus.filter(task => task.taskType === 'video');
        const noteTasksWithStatus = tasksWithStatus.filter(task => task.taskType === 'notes');
        const testTasksWithStatus = tasksWithStatus.filter(task => task.taskType === 'test');
        // Send tasks separately in the response
        res.status(200).json({ videoTasks: videoTasksWithStatus, noteTasks: noteTasksWithStatus, testTasks: testTasksWithStatus });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getVideosPerChapter = async (req, res) => {
    try {
        const { courseId } = req.query;
        console.log(courseId);
        const videos = await videosModel.findAll({
            attributes: ['video_id', 'video_url', 'topic_id', 'chapter_id'],
            where: { course_id: courseId },
            order: [['video_id', 'ASC']],
        });
        // console.log(videos);
        const chapters = await chaptersModel.findAll({
            attributes: ['chapter_id', 'chapter_name'],
            where: { course_id: courseId },
        });
        // console.log(chapters);
        const topics = await TopicsModel.findAll({
            attributes: ['topic_id', 'topic_name'],
            where: { course_id: parseInt(courseId) },
        });
        // console.log(topics);
        const videosPerChapter = chapters.map(chapter => {
            // console.log(chapter.dataValues);
            const chapterVideos = videos.filter(video => video.chapter_id === chapter.chapter_id);
            // console.log(chapterVideos);
            return {
                chapterId: chapter.chapter_id,
                chapterName: chapter.chapter_name,
                videos: chapterVideos.map(video => {
                    const topic = topics.find(topic => topic.topic_id === video.topic_id);
                    return {
                        videoId: video.video_id,
                        videoUrl: video.video_url,
                        topicName: topic ? topic.topic_name : 'Unknown Topic'
                    };
                })
            };
        });

        res.status(200).json(videosPerChapter);
    } catch (error) {
        console.error('Error fetching videos per chapter:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getTopicwithVideos = async (req, res) => {
    try {
        const { chapterId } = req.query;

        const query = `
            SELECT t.topic_id, t.topic_name, v.video_url, v.video_id 
            FROM Topics t 
            LEFT JOIN Videos v ON t.topic_id = v.topic_id 
            WHERE t.chapter_id = ${chapterId};
        `;

        const [result, meta] = await sequelize.query(query)


        res.status(200).json({
            status: true,
            message: 'Topics Mapping fetched successfully',
            data: result,
        });
    } catch (error) {
        console.error('Error fetching topics mapping:', error);
        res.status(500).json({ error: 'Error fetching topics mapping' });
    }
}

exports.getWeakAreas = async (req, res) => {
    try {
        const { userId } = req.query;

        const query = `
            SELECT weak_areas_id from users where id = ${userId};
        `;

        const [result, meta] = await sequelize.query(query);
        const weakAreasId = result[0].weak_areas_id;
        const videoDetails = await videosModel.findAll({
            attributes: ['video_id', 'video_url', 'topic_id', 'chapter_id'],
            where: { video_id: weakAreasId },
            order: [['video_id', 'ASC']],
        });
        // console.log(videoDetails);
        const videoDetailsWithTopicName = await Promise.all(

            videoDetails.map(async (video) => {
                const topic = await TopicsModel.findOne({
                    attributes: ['topic_name', 'subject_id'],
                    where: { topic_id: video.topic_id },
                });
                const section = await subjectsModel.findOne({
                    attributes: ['section'],
                    where: { subject_id: topic.subject_id },
                });
                return {
                    videoId: video.video_id,
                    videoUrl: video.video_url,
                    topicName: topic.topic_name,
                    section: section.section
                }
            })
        )
        //also need to get section of that video, get subject id from topics table and then section from subject table

        res.status(200).json({
            status: true,
            message: 'Weak Areas fetched successfully',
            data: videoDetailsWithTopicName,
        });
    } catch (error) {
        console.error('Error fetching weak areas:', error);
        res.status(500).json({ error: 'Error fetching weak areas' });
    }
}

exports.updateWeakAreas = async (req, res) => {
    try {
        const { userId, Id } = req.body;
        //check if weak areas has an emty array or not
        const user = await usersModel.findOne({
            where: { id: userId },
            attributes: ['weak_areas_id'],
        });
        let weakAreasId = user.weak_areas_id;
        // check if video already exist in the array
        if (weakAreasId.includes(Id)) {
            return res.status(200).json({
                status: true,
                message: 'Video already exists in weak areas',
            });
        }
        if (weakAreasId === null) {
            weakAreasId = [Id];
        } else {
            if (weakAreasId.length === 0) {
                weakAreasId = [Id];
            } else {
                weakAreasId.push(Id);
            }
        }
        const [updateWeakAreas] = await usersModel.update(
            { weak_areas_id: weakAreasId },
            { where: { id: userId } }
        );

        if (updateWeakAreas === 0) {
            return res.status(404).json({
                status: false,
                message: 'User not found',
            });
        } else {
            res.status(200).json({
                status: true,
                message: 'Weak Areas updated successfully',
            });
        }
    } catch (error) {
        console.error('Error updating weak areas:', error);
        res.status(500).json({ error: 'Error updating weak areas' });
    }
}

exports.updateSavedVideos = async (req, res) => {
    try {
        const { userId, videoId } = req.body;
        const user = await usersModel.findOne({
            where: { id: userId },
            attributes: ['saved_video_ids'],
        });
        let savedVideoIds = user.saved_video_ids;
        if (savedVideoIds === null) {
            savedVideoIds = [videoId];
        } else {
            if (savedVideoIds.length === 0) {
                savedVideoIds = [videoId];
            } else {
                savedVideoIds.push(videoId);
            }
        }
        const [updateSavedVideos] = await usersModel.update(
            { saved_video_ids: savedVideoIds },
            { where: { id: userId } }
        );

        if (updateSavedVideos === 0) {
            return res.status(404).json({
                status: false,
                message: 'User not found',
            });
        } else {
            res.status(200).json({
                status: true,
                message: 'Saved Videos updated successfully',
            });
        }
    } catch (error) {
        console.error('Error updating saved videos:', error);
        res.status(500).json({ error: 'Error updating saved videos' });
    }
}

exports.getSavedVideos = async (req, res) => {
    try {
        const { userId } = req.query;
        const user = await usersModel.findOne({
            where: { id: userId },
            attributes: ['saved_video_ids'],
        });
        let savedVideoIds = user.saved_video_ids;
        if (savedVideoIds === null) {
            savedVideoIds = [];
        }
        const videoDetails = await videosModel.findAll({
            attributes: ['video_id', 'video_url', 'topic_id', 'chapter_id'],
            where: { video_id: savedVideoIds },
            order: [['video_id', 'ASC']],
        });
        const videoDetailsWithTopicName = await Promise.all(
            videoDetails.map(async (video) => {
                const topic = await TopicsModel.findOne({
                    attributes: ['topic_name', 'subject_id'],
                    where: { topic_id: video.topic_id },
                });
                const section = await subjectsModel.findOne({
                    attributes: ['section'],
                    where: { subject_id: topic.subject_id },
                });
                return {
                    videoId: video.video_id,
                    videoUrl: video.video_url,
                    topicName: topic.topic_name,
                    section: section.section
                }
            })
        )
        res.status(200).json({
            status: true,
            message: 'Saved Videos fetched successfully',
            data: videoDetailsWithTopicName,
        });
    } catch (error) {
        console.error('Error fetching saved videos:', error);
        res.status(500).json({ error: 'Error fetching saved videos' });
    }
}