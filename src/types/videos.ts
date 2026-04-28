export type VideoItem = {
  id: string | number;
  titulo: string;
  descricao: string;
  duracaoSegundos: number | null;
  videoUrl: string;
};

export type CreateVideoRequestDTO = {
  titulo: string;
  descricao: string;
  duracaoSegundos: number | null;
  videoUrl: string;
};

export type UpdateVideoRequestDTO = {
  id: string | number;
  titulo: string;
  descricao: string;
  duracaoSegundos: number | null;
  videoUrl: string;
};

export type VideoForm = {
  titulo: string;
  descricao: string;
  duracaoSegundos: number | '';
  videoUrl: string;
};

export type EditVideoForm = VideoForm;