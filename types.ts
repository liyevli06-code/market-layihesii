export const MATERIAL_TYPES = {
  lecture: "Mühazirə qeydi",
  notes: "Konspekt",
  test: "Sınaq testi",
  summary: "Mövzu xülasəsi",
} as const;

export type MaterialType = keyof typeof MATERIAL_TYPES;

export interface Material {
  id: string;
  title: string;
  university: string;
  faculty: string;
  subject: string;
  type: MaterialType;
  file_path: string;
  file_size: number;
  downloads: number;
  likes: number;
  uploader: string;
  created_at: string;
}
