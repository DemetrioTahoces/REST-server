const jwt = require('jsonwebtoken');

// ====================
// Autenticación
// ====================

const verificaToken = (req, res, next) => {

    const token = req.get('token');
    verify(token, req, res, next);
}

const verify = (token, req, res, next) => {

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

const verificaTokenImg = (req, res, next) => {

    const token = req.query.token;
    verify(token, req, res, next);
}


module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}