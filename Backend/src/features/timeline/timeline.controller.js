const TimelineService = require('./timeline.service');

const createTimeline = async (req, res, next) => {
  try {
    const data = { ...req.body, created_by: req.user.user_id };
    const timeline = await TimelineService.createTimeline(data);
    res.status(201).json({ status: 'success', message: 'Timeline berhasil dibuat', data: timeline });
  } catch (err) {
    next(err);
  }
};

const getAllTimeline = async (req, res, next) => {
  try {
    const timelines = await TimelineService.getAllTimeline();
    res.json({ status: 'success', data: timelines });
  } catch (err) {
    next(err);
  }
};

const updateTimeline = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await TimelineService.updateTimeline(id, req.body);
    res.json({ status: 'success', message: 'Timeline berhasil diupdate', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteTimeline = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await TimelineService.deleteTimeline(id);
    res.json({ status: 'success', message: 'Timeline berhasil dihapus', data: deleted });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTimeline,
  getAllTimeline,
  updateTimeline,
  deleteTimeline,
}; 