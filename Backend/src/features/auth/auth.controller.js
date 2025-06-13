// auth.controller.js
const AuthService = require('../auth/auth.service');

class AuthController {
  static async register(req, res) {
    try {
      const result = await AuthService.register(req.body);
      if (result.error) {
        return res.status(result.status).json({
          status: 'error',
          message: result.error
        });
      }
      return res.status(201).json({
        status: 'success',
        message: 'Registrasi berhasil',
        data: { userId: result.userId }
      });
    } catch (error) {
      console.error('Register error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat registrasi',
        error: error.message
      });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Username dan password harus diisi'
        });
      }

      const result = await AuthService.login(username, password);

    if (result.status === 'error') {
      // Gunakan result.code untuk status HTTP
      return res.status(result.code || 500).json({
        status: result.status,
        message: result.message
      });
    }

    return res.status(200).json(result);
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat login',
        error: error.message
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const result = await AuthService.getProfile(req.user.user_id);
      if (result.error) {
        return res.status(result.status).json({
          status: 'error',
          message: result.error
        });
      }
      return res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil profil',
        error: error.message
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const result = await AuthService.updateProfile(req.user.user_id, req.body);
      if (result.error) {
        return res.status(result.status).json({
          status: 'error',
          message: result.error
        });
      }
      return res.json({
        status: 'success',
        message: 'Profil berhasil diperbarui'
      });
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat memperbarui profil',
        error: error.message
      });
    }
  }

  static async resetSuperadminPassword(req, res) {
    try {
    const { username, newPassword } = req.body;
    const result = await AuthService.resetSuperadminPassword(username, newPassword);
    return res.json(result);
  } catch (error) {
    console.error('Reset superadmin password error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat reset password',
      error: error.message
    });
  }
}
static async resetOrangtuaPassword(req, res) {
  try {
    const { username, newPassword } = req.body;
    const result = await AuthService.resetOrangtuaPassword(username, newPassword);
    return res.json(result);
  } catch (error) {
    console.error('Reset orang tua password error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat reset password',
      error: error.message
    });
  }
}
}

module.exports = AuthController;
