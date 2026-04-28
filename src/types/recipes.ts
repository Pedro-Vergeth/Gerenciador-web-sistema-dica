import type { GrupoAlimentar, GrupoAlimentarOption } from './foods.ts';

export const TIPO_REFEICAO_OPTIONS = ['CAFE_DA_MANHA', 'ALMOCO', 'JANTAR', 'LANCHE'] as const;

export type TipoRefeicao = (typeof TIPO_REFEICAO_OPTIONS)[number];

export const REGIAO_OPTIONS = ['NORTE', 'NORDESTE', 'CENTRO_OESTE', 'SUDESTE', 'SUL'] as const;

export type Regiao = (typeof REGIAO_OPTIONS)[number];

export const ESTADO_OPTIONS = [
  { id: 1, nome: 'Acre', sigla: 'AC', regiao: 'NORTE' },
  { id: 2, nome: 'Alagoas', sigla: 'AL', regiao: 'NORDESTE' },
  { id: 3, nome: 'Amapá', sigla: 'AP', regiao: 'NORTE' },
  { id: 4, nome: 'Amazonas', sigla: 'AM', regiao: 'NORTE' },
  { id: 5, nome: 'Bahia', sigla: 'BA', regiao: 'NORDESTE' },
  { id: 6, nome: 'Ceará', sigla: 'CE', regiao: 'NORDESTE' },
  { id: 7, nome: 'Distrito Federal', sigla: 'DF', regiao: 'CENTRO_OESTE' },
  { id: 8, nome: 'Espírito Santo', sigla: 'ES', regiao: 'SUDESTE' },
  { id: 9, nome: 'Goiás', sigla: 'GO', regiao: 'CENTRO_OESTE' },
  { id: 10, nome: 'Maranhão', sigla: 'MA', regiao: 'NORDESTE' },
  { id: 11, nome: 'Mato Grosso', sigla: 'MT', regiao: 'CENTRO_OESTE' },
  { id: 12, nome: 'Mato Grosso do Sul', sigla: 'MS', regiao: 'CENTRO_OESTE' },
  { id: 13, nome: 'Minas Gerais', sigla: 'MG', regiao: 'SUDESTE' },
  { id: 14, nome: 'Pará', sigla: 'PA', regiao: 'NORTE' },
  { id: 15, nome: 'Paraíba', sigla: 'PB', regiao: 'NORDESTE' },
  { id: 16, nome: 'Paraná', sigla: 'PR', regiao: 'SUL' },
  { id: 17, nome: 'Pernambuco', sigla: 'PE', regiao: 'NORDESTE' },
  { id: 18, nome: 'Piauí', sigla: 'PI', regiao: 'NORDESTE' },
  { id: 19, nome: 'Rio de Janeiro', sigla: 'RJ', regiao: 'SUDESTE' },
  { id: 20, nome: 'Rio Grande do Norte', sigla: 'RN', regiao: 'NORDESTE' },
  { id: 21, nome: 'Rio Grande do Sul', sigla: 'RS', regiao: 'SUL' },
  { id: 22, nome: 'Rondônia', sigla: 'RO', regiao: 'NORTE' },
  { id: 23, nome: 'Roraima', sigla: 'RR', regiao: 'NORTE' },
  { id: 24, nome: 'Santa Catarina', sigla: 'SC', regiao: 'SUL' },
  { id: 25, nome: 'São Paulo', sigla: 'SP', regiao: 'SUDESTE' },
  { id: 26, nome: 'Sergipe', sigla: 'SE', regiao: 'NORDESTE' },
  { id: 27, nome: 'Tocantins', sigla: 'TO', regiao: 'NORTE' },
] as const;

export type EstadoOption = (typeof ESTADO_OPTIONS)[number];

export type EstadoDto = {
  id: string | number;
  nome: string;
  sigla: string;
  regiao: Regiao | string;
};

export type RecipeItem = {
  id: string | number;
  titulo: string;
  tipoRefeicao: TipoRefeicao | string;
  tempoPreparoMinutos: number | null;
  porcao: string;
  rendimento: string;
  grupoAlimentar: GrupoAlimentar;
  ingredientes: string;
  modoPreparo: string;
  imagem64: string;
  estado: EstadoDto | null;
};

export type CreateRecipeRequestDTO = {
  titulo: string;
  tipoRefeicao: TipoRefeicao;
  tempoPreparoMinutos: number | null;
  porcao: string;
  rendimento: string;
  grupoAlimentar: GrupoAlimentarOption;
  ingredientes: string;
  modoPreparo: string;
  imagem: File | null;
  idEstado: string | number;
};

export type UpdateRecipeRequestDTO = {
  id: string | number;
  titulo: string;
  tipoRefeicao: TipoRefeicao;
  tempoPreparoMinutos: number | null;
  porcao: string;
  rendimento: string;
  grupoAlimentar: GrupoAlimentarOption;
  ingredientes: string;
  modoPreparo: string;
  imagem?: File | null;
  idEstado: string | number;
};

export type RecipeForm = {
  titulo: string;
  tipoRefeicao: TipoRefeicao | '';
  tempoPreparoMinutos: number | '';
  porcao: string;
  rendimento: string;
  grupoAlimentar: GrupoAlimentarOption | '';
  ingredientes: string;
  modoPreparo: string;
  imagem: File | null;
  idEstado: string | number | '';
};

export type EditRecipeForm = RecipeForm;