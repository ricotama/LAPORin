// types/ReportTypes.ts

export type Category =
  | "jalan"
  | "jembatan"
  | "drainase"
  | "lampu"
  | "lainnya";

export interface Report {
  id: string;
  title: string;
  description: string;
  category: Category;
  latitude: number;
  longitude: number;
  address: string;
  photoUrl?: string;
  timestamp: string;
}

export interface FormDataType {
  title: string;
  description: string;
  category: Category;
  latitude: number;
  longitude: number;
  address: string;
  photoUrl?: string;
}
