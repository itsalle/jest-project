const UserSchema = require("../models/userSchema");
const bcrypt = require("bcrypt");

const getAll = async (req, res) => {
  UserSchema.find(function (err, users) {
    if (err) {
      return res.status(500).send({
        message: err.message
      })
    }
    return res.status(200).json(users)
  })
};

const createUser = async (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;

  // const emailExists = await UserSchema.exists({ email: req.body.email });  

  // if(emailExists) {
  //   res.status(401).send({
  //     "message": "Email já cadastrado"
  //   })
  // }

  try {
    const newUser = new UserSchema(req.body);

    const savedUser = await newUser.save();

    return res.status(201).send({
      "message": "User criado com sucesso",
      savedUser
    });
  } catch (e) {
    console.error(e);
  };
};

const updateUserById = async (req, res) => {
  try {
    const findUser = await UserSchema.findById(req.params.id)

    if (findUser) {
      findUser.name = req.body.name || findUser.name
      findUser.email = req.body.email || findUser.email
    }

    const savedUser = await findUser.save()

    return res.status(200).send({
      message: "Usuário atualizada com sucesso!",
      savedUser
    })

  } catch (error) {
    console.error(error)
  }
}

const deleteUserById = async (req, res) => {
  try {
    const userFound = await UserSchema.findById(req.params.id)

    await userFound.delete()

    return res.status(200).json({
      mensagem: `Usuário '${userFound.email}' deletada com sucesso!`
    })

  } catch (err) {
    return res.status(400).json({
      mensagem: err.message
    })
  }
}

module.exports = {
  getAll,
  createUser,
  updateUserById,
  deleteUserById
};