import { AirQualityCategory } from "./enum";

export const toCategory = (pm: number) => {
  if (pm <= 25) return AirQualityCategory.GOOD;
  if (pm <= 50) return AirQualityCategory.FAIR;
  if (pm <= 100) return AirQualityCategory.POOR;
  if (pm <= 300) return AirQualityCategory.VERY_POOR;
  return AirQualityCategory.EXTREMELY_POOR;
};

export const getPercentage = (pm: number) => {
  return `${Math.min((pm / 300) * 100, 100)}%`;
};
