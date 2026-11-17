import {
    addVolunteer,
    removeVolunteer
} from '../models/volunteers.js';

const processVolunteerForProject = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const userId = req.session.user.user_id;

        await addVolunteer(userId, projectId);
        req.flash('success', 'You are now volunteering for this project!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

const processRemoveVolunteerForProject = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const userId = req.session.user.user_id;

        await removeVolunteer(userId, projectId);
        req.flash('success', 'You have been removed as a volunteer for this project.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

export {
    processVolunteerForProject,
    processRemoveVolunteerForProject
};