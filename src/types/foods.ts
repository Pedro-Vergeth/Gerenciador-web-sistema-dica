export type GrupoAlimentar = {
  id?: string | number;
  nome?: string;
} | string | null;

export const GRUPO_ALIMENTAR_OPTIONS = ['VERDE', 'AMARELO', 'AZUL', 'VERMELHO'] as const;

export type GrupoAlimentarOption = (typeof GRUPO_ALIMENTAR_OPTIONS)[number];

export type FoodItem = {
  id: string | number;
  nomePrincipal: string;
  sinonimos: string;
  unidade: string;
  unidadeMedidaCaseira: string;
  qtdParaUmCoracao: number | null;
  qtdMedidaCaseira: number | null;
  textoInformativo: string;
  grupoAlimentar: GrupoAlimentar;
  imagem64: string;
};

export type CreateFoodRequestDTO = {
  nomePrincipal: string;
  sinonimos: string;
  unidade: string;
  unidadeMedidaCaseira: string;
  qtdParaUmCoracao: number;
  qtdMedidaCaseira: number;
  textoInformativo: string;
  grupoAlimentar: GrupoAlimentarOption;
  imagem: File | null;
};

export type FoodForm = {
  nomePrincipal: string;
  sinonimos: string;
  unidade: string;
  unidadeMedidaCaseira: string;
  qtdParaUmCoracao: number | '';
  qtdMedidaCaseira: number | '';
  textoInformativo: string;
  grupoAlimentar: CreateFoodRequestDTO['grupoAlimentar'] | '';
  imagem: File | null;
};

export type EditFoodForm = FoodForm;

export type UpdateFoodRequestDTO = {
  id: string | number;
  nomePrincipal?: string;
  sinonimos?: string;
  unidade?: string;
  unidadeMedidaCaseira?: string;
  qtdParaUmCoracao?: number;
  qtdMedidaCaseira?: number;
  textoInformativo?: string;
  grupoAlimentar?: GrupoAlimentarOption;
  imagem?: File | null;
};