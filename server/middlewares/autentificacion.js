const jwt = require('jsonwebtoken');

//===============
// Verificar TOKEN
//===============

let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario; //cualquier petición podra acceder a la información del usuario
        next();
    });

    //console.log(token);

    /*
    res.json({
        token
    })
    */

};
let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: 'No tienes los permisos para agregar usuarios'
        });
    }
    next();
};

module.exports = {
    verificaToken,
    verificaAdminRole
}