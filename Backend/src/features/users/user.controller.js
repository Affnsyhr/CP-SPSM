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

module.exports = {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin
};
