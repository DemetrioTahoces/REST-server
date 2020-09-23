const jwt = require('jsonwebtoken');

// ====================
// Autenticación
// ====================

const verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (error, decoded) => {

        if (error) {
            return res.status(401).json({
                ok: false,
                error
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}

const verificaAdminRole = (req, res, next) => {

    const usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {

        return res.status(403).json({
            ok: false,
            error: {
                message: 'El usuario no es administrador'
            }
        });
    }

    next();
}

module.exports = {
    verificaToken,
    verificaAdminRole
}