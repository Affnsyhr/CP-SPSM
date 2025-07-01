// user.controller.js
const UserService = require('./user.service');

const getAdmins = async (req, res, next) => {
  try {
    const admins = await UserService.getAdmins();
    res.status(200).json({ 
      status: 'success',
      data: admins 
    });
  } catch (error) {
    next(error);
  }
};

const createAdmin = async (req, res, next) => {
  try {
    const admin = await UserService.createAdmin(req.body);
    res.status(201).json({ 
      status: 'success',
      message: 'Admin berhasil dibuat',
      data: admin 
    });
  } catch (error) {
    next(error);
  }
};

const updateAdmin = async (req, res, next) => {
  try {
    const admin = await UserService.updateAdmin(req.params.id, req.body);
    res.status(200).json({ 
      status: 'success',
      message: 'Admin berhasil diperbarui',
      data: admin 
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    await UserService.deleteAdmin(req.params.id);
    res.status(200).json({ 
      status: 'success',
      message: 'Admin berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

const getParents = async (req, res, next) => {
  try {
    const parents = await UserService.getParents();
    res.status(200).json({
      status: 'success',
      data: parents
    });
  } catch (error) {
    next(error);
  }
};

const createParent = async (req, res, next) => {
  try {
    const parent = await UserService.createParent(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Akun orang tua berhasil dibuat',
      data: parent
    });
  } catch (error) {
    next(error);
  }
};

const updateParent = async (req, res, next) => {
  try {
    const parent = await UserService.updateParent(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Akun orang tua berhasil diperbarui',
      data: parent
    });
  } catch (error) {
    next(error);
  }
};

const deleteParent = async (req, res, next) => {
  try {
    await UserService.deleteParent(req.params.id);
    res.status(200).json({
      status: 'success',
      message: 'Akun orang tua berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

// Aktifkan akun orang tua
const activateParentAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await UserService.setParentActiveStatus(id, true);
    if (!updated) return res.status(404).json({ status: 'error', message: 'Akun tidak ditemukan' });
    res.json({ status: 'success', message: 'Akun berhasil diaktifkan', data: updated });
  } catch (error) {
    next(error);
  }
};

// Nonaktifkan akun orang tua
const deactivateParentAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await UserService.setParentActiveStatus(id, false);
    if (!updated) return res.status(404).json({ status: 'error', message: 'Akun tidak ditemukan' });
    res.json({ status: 'success', message: 'Akun berhasil dinonaktifkan', data: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getParents,
  createParent,
  updateParent,
  deleteParent,
  activateParentAccount,
  deactivateParentAccount
};
