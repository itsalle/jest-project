const UserSchema = require('../models/userSchema');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET;

// login = autenticação
const login = (req, res) => {
    try {
        // UserSchema.findOne(filtro é o email do usuario, função anônima)
        UserSchema.findOne({ email: req.body.email }, (error, user) => {
            console.log("USUÁRIO", user)
            if(!user) {
                return res.status(401).send({
                    message: "User não encontrado",
                    email: `${req.body.email}`
                })
            }

            // o que eu tenho: usuário que veio da requisição e o usuário encontrado no banco dados. ambos os usuários possuem o mesmo email, agora preciso verificar se eles tbm possuem a mesma senha

            const validPassword = bcrypt.compareSync(req.body.password, user.password);
            console.log("A SENHA É VÁLIDA?", validPassword)

            if(!validPassword) {
                return res.status(401).send({
                    "message": "Login não autorizado",
                    "statusCode": 401
                })
            }

            // jwt.sign(nome do usuário, SEGREDO)
            const token = jwt.sign({name: user.name}, SECRET);
            console.log("TOKEN CRIADO:", token);

            res.status(200).send({
                "message": "Login autorizado",
                token
            });
        })
    } catch(err) {
        console.error(err)
    }
};

module.exports = {
    login
};