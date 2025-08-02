import { Request, Response, NextFunction } from 'express';
import Bug from '../models/Bug';
import { ApiError } from '../utils/errors/ApiError';
import User from '../models/user';

interface AuthenticatedRequest extends Request {
  user?: { id: number };
  file?: Express.Multer.File;
}

export const createBug = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      module,
      priority,
      description,
      steps,
      expected_behavior,
      actual_behavior,
      assigned_to
    } = req.body;

    if (!req.user || !req.user.id) {
      return next(new ApiError('Unauthorized', 401));
    }

    const bug = await Bug.create({
      user_id: req.user.id,
      assigned_to: assigned_to || null,
      title,
      module,
      priority,
      description,
      steps,
      expected_behavior,
      actual_behavior,
      screenshot: req.file ? req.file.filename : null
    });

    return res.status(201).json(bug);
  } catch (error) {
    return next(error);
  }
};



export const findBugsByUserId = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.user.id) {
      return next(new ApiError('Unauthorized', 401));
    }

    const userId = req.user.id;

    const bugs = await Bug.findAll({
      where: { user_id: userId }
    });

    if (!bugs || bugs.length === 0) {
      return res.status(200).json({ message: 'No bugs found for this user', data: [] });
    }

    const protocol = req.protocol; // http or https
    const host = req.get('host');  // e.g. localhost:3000 or your domain

    const bugsWithFullScreenshotUrl = bugs.map(bug => {
      const bugJson = bug.toJSON();
      return {
        ...bugJson,
        screenshot_url: bugJson.screenshot
          ? `${protocol}://${host}/uploads/${bugJson.screenshot}`
          : null
      };
    });

    return res.json({ success: true, data: bugsWithFullScreenshotUrl });
  } catch (error) {
    return next(error);
  }
};


export const findAllBugs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bugs = await Bug.findAll();

    if (!bugs || bugs.length === 0) {
      return res.status(200).json({ message: 'No bugs found', data: [] });
    }

    const protocol = req.protocol;
    const host = req.get('host');

    const bugsWithFullScreenshotUrl = bugs.map(bug => {
      const bugJson = bug.toJSON();
      return {
        ...bugJson,
        screenshot_url: bugJson.screenshot
          ? `${protocol}://${host}/uploads/${encodeURIComponent(bugJson.screenshot)}`
          : null
      };
    });

    return res.json({ success: true, data: bugsWithFullScreenshotUrl });
  } catch (error) {
    return next(error);
  }
};



export const updateBugAssignedTo = async (req: Request, res: Response, next: NextFunction) => {
  const { id, assigned_to } = req.params;  // bug id and assigned user id from params

  try {
    const bug = await Bug.findByPk(id);
    if (!bug) {
      return next(new ApiError('Bug not found.', 404));
    }

    await bug.update({ assigned_to });

    return res.json({ message: 'Bug assigned_to updated successfully', bug });
  } catch (error) {
    return next(error);
  }
};



export const findBugsByDevId = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.user.id) {
      return next(new ApiError('Unauthorized', 401));
    }

    const userId = req.user.id;

    const bugs = await Bug.findAll({
      where: { assigned_to: userId }
    });

    if (!bugs || bugs.length === 0) {
      return res.status(200).json({ message: 'No bugs found for this user', data: [] });
    }

    const protocol = req.protocol; 
    const host = req.get('host'); 

    const bugsWithFullScreenshotUrl = bugs.map(bug => {
      const bugJson = bug.toJSON();
      return {
        ...bugJson,
        screenshot_url: bugJson.screenshot
          ? `${protocol}://${host}/uploads/${bugJson.screenshot}`
          : null
      };
    });

    return res.json({ success: true, data: bugsWithFullScreenshotUrl });
  } catch (error) {
    return next(error);
  }
};