export interface Image {
  src: string;
  nano?: string;
  alt?: string;
  title?: string;
  srcset: string[];
  originalClass?: string;

  thumbnail?: string;
  thumbnailLabel?: string;
  thumbnailClass?: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;

  bulletClass?: string;
  caption?: string;
  tags?: { value: string; title: string }[];

  isSelected: boolean;
}
