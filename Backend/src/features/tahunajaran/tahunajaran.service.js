const TahunAjaranModel = require('./tahunajaran.model');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

const createTahunAjaran = async (data) => {
  if (!data.tahun_ajaran || !data.tanggal_mulai || !data.tanggal_berakhir || !data.status) {
    throw new BadRequestError('Field wajib tidak boleh kosong');
  }
  return await TahunAjaranModel.createTahunAjaran(data);
};

const getAllTahunAjaran = async () => {
  return await TahunAjaranModel.getAllTahunAjaran();
};

const updateTahunAjaran = async (id_tahunajaran, data) => {
  const updated = await TahunAjaranModel.updateTahunAjaran(id_tahunajaran, data);
  if (!updated) throw new NotFoundError('Tahun ajaran tidak ditemukan');
  return updated;
};

const deleteTahunAjaran = async (id_tahunajaran) => {
  const deleted = await TahunAjaranModel.deleteTahunAjaran(id_tahunajaran);
  if (!deleted) throw new NotFoundError('Tahun ajaran tidak ditemukan');
  return deleted;
};

module.exports = {
  createTahunAjaran,
  getAllTahunAjaran,
  updateTahunAjaran,
  deleteTahunAjaran,
}; 