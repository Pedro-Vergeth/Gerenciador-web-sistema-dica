export type VideoIntroducaoItem = {
  id: string | number;
  dadosFicheiroBase64: string | null;
};

export type VideoIntroducaoRequestDTO = {
  dadosFicheiro: File;
};

export type VideoIntroducaoUpdateDTO = {
  dadosFicheiro: File;
};

export type VideoIntroducaoForm = {
  dadosFicheiro: File | null;
};