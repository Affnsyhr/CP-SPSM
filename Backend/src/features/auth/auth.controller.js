// auth.controller.js
const AuthService = require('../auth/auth.service');

class AuthController {
  static async register(req, res) {
    try {
      const result = await AuthService.register(req.body);
      if (result.status === 'error') {
        return res.status(result.code || 400).json({
          status: 'error',
          message: result.message || result.error,
          error: result.error || undefined,
          data: req.body
        });
      }
      return res.status(201).json({
        status: 'success',
        message: 'Registrasi berhasil',
        data: {
          userId: result.userId,
          username: req.body.username,
          email: req.body.email,
          nama_lengkap: req.body.nama_lengkap,
          nik: req.body.nik,
          alamat: req.body.alamat,
          no_hp: req.body.no_hp,
          role: req.body.role
        }
      });
    } catch (error) {
      console.error('Register error:', error, error.stack);
      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat registrasi',
        error: error.message,
        data: req.body
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, username, password } = req.body;

      if ((!username && !email) || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Email/Username dan password harus diisi'
        });
      }

      let loginIdentifier = username;
      // Jika email dikirim, cari username berdasarkan email
      if (email && !username) {
        // Query ke database untuk dapatkan username dari email
        const db = require('../../config/db');
        const result = await db.query('SELECT username FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
          return res.status(404).json({
            status: 'error',
            message: 'Email tidak ditemukan'
          });
        }
        loginIdentifier = result.rows[0].username;
      }

      const result = await AuthService.login(loginIdentifier, password);

      if (result.status === 'error') {
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

