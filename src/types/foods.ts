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
  porcao: string;
  medidaCaseira: string;
  textoInformativo: string;
  grupoAlimentar: GrupoAlimentar;
  imagem64: string;
};

export type CreateFoodRequestDTO = {
  nomePrincipal: string;
  sinonimos: string;
  porcao: string;
  medidaCaseira: string;
  textoInformativo: string;
  grupoAlimentar: GrupoAlimentarOption;
  imagem: File | null;
};

export type FoodForm = Omit<CreateFoodRequestDTO, 'grupoAlimentar'> & {
  grupoAlimentar: CreateFoodRequestDTO['grupoAlimentar'] | '';
};

export type EditFoodForm = FoodForm;

export type UpdateFoodRequestDTO = {
  id: string | number;
  nomePrincipal?: string;
  sinonimos?: string;
  porcao?: string;
  medidaCaseira?: string;
  textoInformativo?: string;
  grupoAlimentar?: GrupoAlimentarOption;
  imagem?: File | null;
};