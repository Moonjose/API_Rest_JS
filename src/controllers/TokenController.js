import jwt from 'jsonwebtoken';
import User from '../models/User';

class TokenController {
  async store(req, res) {
    const { email = '', password = '' } = req.body; // Pega o email e senha da requisição

    if (!email || !password) { // Checa se faltou algum
      return res.status(401).json({
        errors: ['Credenciais inválidas'],
      });
    }

    // Busca no BD o usuario com o email correspondente
    const user = await User.findOne({ where: { email } });

    // Checa se o usuário existe no BD
    if (!user) {
      return res.status(401).json({
        errors: ['Usuário não existe'],
      });
    }
    // Se a senha da req não for a mesma encriptada no BD, não é valida
    if (!(await user.passIsValid(password))) {
      return res.status(401).json({
        errors: ['Senha Inválida'],
      });
    }

    const { id } = user;

    // Cria o token baseado no ID(Extraido do usuario acima)
    // no Email (Passado no corpo da req)
    // e no TOKEN SECRET (Environment Variable)
    const token = jwt.sign(
      { id, email },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_LIFETIME },
    );

    return res.json({ token });
  }
}

export default new TokenController();
