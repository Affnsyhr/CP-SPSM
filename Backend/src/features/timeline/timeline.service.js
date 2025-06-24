const TimelineModel = require('./timeline.model');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

const createTimeline = async (data) => {
  if (!data.nama_kegiatan || !data.tanggal_mulai || !data.tanggal_selesai) {
    throw new BadRequestError('Field wajib tidak boleh kosong');
  }
  return await TimelineModel.createTimeline(data);
};

const getAllTimeline = async () => {
  return await TimelineModel.getAllTimeline();
};

const updateTimeline = async (timeline_id, data) => {
  const updated = await TimelineModel.updateTimeline(timeline_id, data);
  if (!updated) throw new NotFoundError('Timeline tidak ditemukan');
  return updated;
};

const deleteTimeline = async (timeline_id) => {
  const deleted = await TimelineModel.deleteTimeline(timeline_id);
  if (!deleted) throw new NotFoundError('Timeline tidak ditemukan');
  return deleted;
};

module.exports = {
  createTimeline,
  getAllTimeline,
  updateTimeline,
  deleteTimeline,
}; 