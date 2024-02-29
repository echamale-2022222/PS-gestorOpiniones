import { response, request } from "express";
import bcryptjs from "bcryptjs";
import User from "./user.model.js"

export const userPost = async (req, res) => {
    const { username, mail, password } = req.body;
    const user = new User({ username, mail, password });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();

    res.status(200).json({
        msg: "User added to database",
        user
    });
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, ...rest } = req.body;

    // Obtener el nombre de usuario del usuario autenticado desde el token
    const usernameFromToken = req.user.username;

    try {
        // Buscar el usuario utilizando el nombre de usuario del token
        const userAuth = await User.findOne({ username: usernameFromToken });

        if (!userAuth) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // Verificar si el ID del usuario autenticado coincide con el ID proporcionado en la solicitud
        if (userAuth._id.toString() !== id) {
            return res.status(403).json({ msg: "No tienes permiso para actualizar este usuario" });
        }

        // Si se encuentra el usuario y el ID coincide, procedemos con la actualización
        // Si el nombre de usuario en la solicitud es diferente al del token, se ignora y no se actualiza
        const updatedFields = { ...rest };
        
        // Si se proporcionó una nueva contraseña, la actualizamos
        if (password) {
            const salt = bcryptjs.genSaltSync();
            updatedFields.password = bcryptjs.hashSync(password, salt);
        }

        const user = await User.findByIdAndUpdate(id, updatedFields, { new: true });

        const userUpdated = await User.findById(id);

        res.status(200).json({
            msg: "Usuario actualizado correctamente",
            userUpdated
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

