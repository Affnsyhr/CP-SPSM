const ProgramModel = require('./program.model');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

const createProgram = async (data) => {
  // Validasi sederhana
  if (!data.nama_program || !data.status_program || !data.kuota_siswa || !data.jenis_pendaftar) {
    throw new BadRequestError('Field wajib tidak boleh kosong');
  }
  return await ProgramModel.createProgram(data);
};

const getAllPrograms = async () => {
  return await ProgramModel.getAllPrograms();
};

const updateProgram = async (program_id, data) => {
  const updated = await ProgramModel.updateProgram(program_id, data);
  if (!updated) throw new NotFoundError('Program tidak ditemukan');
  return updated;
};

const deleteProgram = async (program_id) => {
  const deleted = await ProgramModel.deleteProgram(program_id);
  if (!deleted) throw new NotFoundError('Program tidak ditemukan');
  return deleted;
};

module.exports = {
  createProgram,
  getAllPrograms,
  updateProgram,
  deleteProgram,
}; 