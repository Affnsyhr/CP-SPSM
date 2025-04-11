import UserModel from "../models/userModel.js";
import { successResponse, errorResponse } from "../utils/response.js";

const UserController = {
  getUserById: async (req, res) => {
    try {
      const user = await UserModel.findUserById(req.params.id);
      if (!user) return errorResponse(res, "Pengguna tidak ditemukan", null, 404);

      successResponse(res, "Pengguna ditemukan", user);
    } catch (error) {
      errorResponse(res, "Terjadi kesalahan server", error);
    }
  }
};

export default UserController;
