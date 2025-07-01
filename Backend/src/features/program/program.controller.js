const ProgramService = require('./program.service');

const createProgram = async (req, res, next) => {
  try {
    const program = await ProgramService.createProgram(req.body);
    res.status(201).json({ status: 'success', message: 'Program berhasil dibuat', data: program });
  } catch (err) {
    next(err);
  }
};

const getAllPrograms = async (req, res, next) => {
  try {
    const programs = await ProgramService.getAllPrograms();
    res.json({ status: 'success', data: programs });
  } catch (err) {
    next(err);
  }
};

const updateProgram = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await ProgramService.updateProgram(id, req.body);
    res.json({ status: 'success', message: 'Program berhasil diupdate', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteProgram = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await ProgramService.deleteProgram(id);
    res.json({ status: 'success', message: 'Program berhasil dihapus', data: deleted });
  } catch (err) {
    next(err);
  }
};

// Update kuota jalur
const updateKuotaJalur = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { kuota_jalur } = req.body;
    const updated = await ProgramService.updateKuotaJalur(id, kuota_jalur);
    if (!updated) return res.status(404).json({ status: 'error', message: 'Jalur tidak ditemukan' });
    res.json({ status: 'success', message: 'Kuota jalur berhasil diupdate', data: updated });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProgram,
  getAllPrograms,
  updateProgram,
  deleteProgram,
  updateKuotaJalur
}; 