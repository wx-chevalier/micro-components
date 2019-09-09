export interface Image {
  src: string;
  nano?: string;
  alt?: string;
  thumbnail?: string;
  srcset: string[];
  caption?: string;
  tags?: { value: string; title: string }[];
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  isSelected: boolean;
}
