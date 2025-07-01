const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');

class AuthService {
  static async checkAxistUser(username) {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows.length > 0;
  }

  static async register(userData) {
    const { username, password, email, nama_lengkap, nik, alamat, no_hp, role = 2 } = userData;

    const userExist = await this.checkAxistUser(username);
    if (userExist) return { status: 'error', message: 'Username sudah terdaftar', code: 400 };

    const hashedPassword = await bcrypt.hash(password, 10);
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      const userResult = await client.query(
        'INSERT INTO users (username, password_hash, email, created_at, role_id) VALUES ($1, $2, $3, NOW(), $4) RETURNING user_id',
        [username, hashedPassword, email, role]
      );

      const userId = userResult.rows[0].user_id;

      if (role === 2) {
        await client.query(
          'INSERT INTO orang_tua (user_id, nama_lengkap, nik, alamat, no_hp) VALUES ($1, $2, $3, $4, $5)',
          [userId, nama_lengkap, nik, alamat, no_hp]
        );
      }

      await client.query('COMMIT');
      return { status: 'success', userId };
    } catch (error) {
      await client.query('ROLLBACK');
      return { status: 'error', message: 'Terjadi kesalahan saat registrasi', error: error.message, code: 500 };
    } finally {
      client.release();
    }
  }

  static async login(username, password) {
    try {
      console.log('Login attempt for:', username);

      const result = await db.query(`
        SELECT 
          u.*,
          r.nama_role,
          r.role_id,
          ot.nama_lengkap,
          ot.nik,
          ot.alamat,
          ot.no_hp
        FROM users u 
        JOIN role r ON u.role_id = r.role_id 
        LEFT JOIN orang_tua ot ON u.user_id = ot.user_id
        WHERE u.username = $1
      `, [username]);

      console.log('Query result:', {
        found: result.rows.length > 0,
        userData: result.rows[0] ? {
          username: result.rows[0].username,
          role: result.rows[0].nama_role,
          role_id: result.rows[0].role_id,
          nama_lengkap: result.rows[0].nama_lengkap,
          hasPassword: !!result.rows[0].password_hash
        } : null
      });

      if (result.rows.length === 0) {
        return { status: 'error', message: 'Username tidak ditemukan', code: 404 };
      }

      const user = result.rows[0];

      // Tambahkan pengecekan status aktif
      if (user.is_active === false) {
        return {
          status: 'error',
          message: 'Akun dinonaktifkan. Silakan hubungi admin.',
          code: 403
        };
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      console.log('Password verification:', { 
        isMatch,
        providedPassword: password,
        hashedPassword: user.password_hash
      });

      if (!isMatch) {
        return {
          status: 'error',
          message: 'Password salah',
          code: 401
        };
      }

      // Generate token
      const token = jwt.sign(
        { 
          user_id: user.user_id, 
          role_id: user.role_id,
          username: user.username,
          role: user.nama_role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );

      // Update last login
      await db.query(
        'UPDATE users SET last_login = NOW() WHERE user_id = $1',
        [user.user_id]
      );

      // Return response berdasarkan role dengan data yang lebih lengkap
      const userData = {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.nama_role,
        role_id: user.role_id,
        nama_lengkap: user.nama_lengkap,
        nik: user.nik,
        alamat: user.alamat,
        no_hp: user.no_hp
      };

      console.log('Login successful:', {
        username: user.username,
        role: user.nama_role,
        role_id: user.role_id,
        nama_lengkap: user.nama_lengkap,
        token: token.substring(0, 20) + '...'
      });

      return {
        status: 'success',
        message: 'Login berhasil',
        data: {
          token,
          user: userData
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        status: 'error',
        message: 'Terjadi kesalahan saat login',
        error: error.message,
        code: 500
      };
    }
  }

  static async getProfile(userId) {
    const result = await db.query(`
      SELECT 
        u.user_id, 
        u.username, 
        u.email, 
        u.role_id,
        r.nama_role,
        ot.nama_lengkap, 
        ot.nik, 
        ot.alamat, 
        ot.no_hp
      FROM users u
      LEFT JOIN role r ON u.role_id = r.role_id
      LEFT JOIN orang_tua ot ON u.user_id = ot.user_id
      WHERE u.user_id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return { status: 'error', message: 'Pengguna tidak ditemukan', code: 404 };
    }

    return { status: 'success', data: result.rows[0] };
  }

  static async updateProfile(userId, data) {
    const { nama_lengkap, nik, alamat, no_hp } = data;
    const result = await db.query('SELECT * FROM orang_tua WHERE user_id = $1', [userId]);

    if (result.rows.length === 0) return { status: 'error', message: 'Profil tidak ditemukan', code: 404 };

    await db.query(`
      UPDATE orang_tua 
      SET nama_lengkap = $1, nik = $2, alamat = $3, no_hp = $4 
      WHERE user_id = $5
    `, [nama_lengkap, nik, alamat, no_hp, userId]);

    return { status: 'success', message: 'Profil berhasil diperbarui' };
  }

  static async resetSuperadminPassword(username, newPassword) {
    try {
      const password = newPassword || 'admin123';
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await db.query(
        'UPDATE users SET password_hash = $1 WHERE username = $2 AND role_id = 1 RETURNING user_id',
        [hashedPassword, username]
      );

      if (result.rows.length === 0) {
        return {
          status: 'error',
          message: 'Superadmin tidak ditemukan',
          code: 404
        };
      }

      return {
        status: 'success',
        message: 'Password superadmin berhasil direset',
        password: password // hanya untuk development/testing
      };
    } catch (error) {
      console.error('Reset superadmin password error:', error);
      return {
        status: 'error',
        message: 'Terjadi kesalahan saat reset password',
        error: error.message,
        code: 500
      };
    }
  }

  static async resetOrangtuaPassword(username, newPassword) {
  try {
    const password = newPassword || 'orangtua123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // role_id = 2 untuk orang tua (pastikan sesuai dengan sistem Anda)
    const result = await db.query(
      'UPDATE users SET password_hash = $1 WHERE username = $2 AND role_id = 2 RETURNING user_id',
      [hashedPassword, username]
    );

    if (result.rows.length === 0) {
      return {
        status: 'error',
        message: 'Orang tua tidak ditemukan',
        code: 404
      };
    }

    return {
      status: 'success',
      message: 'Password orang tua berhasil direset',
      password: password // hanya untuk development/testing
    };
  } catch (error) {
    console.error('Reset orang tua password error:', error);
    return {
      status: 'error',
      message: 'Terjadi kesalahan saat reset password',
      error: error.message,
      code: 500
    };
  }
}

}


module.exports = AuthService;