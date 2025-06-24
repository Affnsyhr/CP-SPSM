const TahunAjaranService = require('./tahunajaran.service');

const createTahunAjaran = async (req, res, next) => {
  try {
    const tahunAjaran = await TahunAjaranService.createTahunAjaran(req.body);
    res.status(201).json({ status: 'success', message: 'Tahun ajaran berhasil dibuat', data: tahunAjaran });
  } catch (err) {
    next(err);
  }
};

const getAllTahunAjaran = async (req, res, next) => {
  try {
    const tahunAjaran = await TahunAjaranService.getAllTahunAjaran();
    res.json({ status: 'success', data: tahunAjaran });
  } catch (err) {
    next(err);
  }
};

const updateTahunAjaran = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await TahunAjaranService.updateTahunAjaran(id, req.body);
    res.json({ status: 'success', message: 'Tahun ajaran berhasil diupdate', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteTahunAjaran = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await TahunAjaranService.deleteTahunAjaran(id);
    res.json({ status: 'success', message: 'Tahun ajaran berhasil dihapus', data: deleted });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTahunAjaran,
  getAllTahunAjaran,
  updateTahunAjaran,
  deleteTahunAjaran,
}; 