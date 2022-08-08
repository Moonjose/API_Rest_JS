import jwt from 'jsonwebtoken';
import User from '../models/User';

export default async (req, res, next) => {
  const { authorization } = req.headers; // Obtém o token enviado no header da req

  if (!authorization) { // Se não tem token, lança erro
    return res.status(401).json({
      errors: ['Login Required'],
    });
  }
  // Divide o conteudo do header ( (Bearer) (Token) )
  const [, token] = authorization.split(' ');

  try {
    // Verifica o token baseado no secret usado
    const dados = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id, email } = dados; // Extrai o email e id dos dados obtidos do token

    // Busca no BD um usuário onde os dados correspondem aos do token
    const user = await User.findOne({
      where: {
        id,
        email,
      },
    });

    if (!user) { // Se não encontrou (Não existe || Email ou ID alterado)
      return res.status(401).json({
        errors: ['Usuário inválido'],
      });
    }

    req.userId = id; // Atrela esses dados direto na requisição
    req.userEmail = email; // Ao passar por esse middleware, esses dados existirão na req
    return next();
  } catch (e) {
    return res.status(401).json({
      errors: ['Token expirado ou inválido'],
    });
  }
};
