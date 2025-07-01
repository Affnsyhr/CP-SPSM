const ProgramModel = require('./program.model');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

const createProgram = async (data) => {
  // Validasi sederhana
  if (!data.nama_program || !data.status_program || !data.kuota_siswa || !Array.isArray(data.jenis_pendaftar) || data.jenis_pendaftar.length === 0) {
    throw new BadRequestError('Field wajib tidak boleh kosong');
  }
  const program = await ProgramModel.createProgram(data);
  await ProgramModel.insertJenisPendaftar(program.program_id, data.jenis_pendaftar);
  program.jenis_pendaftar = await ProgramModel.getJenisPendaftarByProgram(program.program_id);
  return program;
};

const getAllPrograms = async () => {
  return await ProgramModel.getAllPrograms();
};

const updateProgram = async (program_id, data) => {
  const updated = await ProgramModel.updateProgram(program_id, data);
  if (!updated) throw new NotFoundError('Program tidak ditemukan');
  // Update jenis_pendaftar: delete old, insert new
  await ProgramModel.deleteJenisPendaftar(program_id);
  await ProgramModel.insertJenisPendaftar(program_id, data.jenis_pendaftar);
  updated.jenis_pendaftar = await ProgramModel.getJenisPendaftarByProgram(program_id);
  return updated;
};

const deleteProgram = async (program_id) => {
  const deleted = await ProgramModel.deleteProgram(program_id);
  if (!deleted) throw new NotFoundError('Program tidak ditemukan');
  return deleted;
};

const getJalurById = async (id) => {
  return await ProgramModel.getJalurById(id);
};

const updateKuotaJalur = async (id, kuota_jalur) => {
  return await ProgramModel.updateKuotaJalur(id, kuota_jalur);
};

module.exports = {
  createProgram,
  getAllPrograms,
  updateProgram,
  deleteProgram,
  getJalurById,
  updateKuotaJalur
}; 