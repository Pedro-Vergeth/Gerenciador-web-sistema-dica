export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
}

export interface ChangePasswordRequestDTO {
  senhaAtual: string;
  novaSenha: string;
}