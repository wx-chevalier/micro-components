export interface Image {
  src?: string;
  nano?: string;
  alt?: string;
  title?: string;
  description?: string;
  srcSet?: string;
  imageSet?: { srcSet: string; media: string; type: string }[];
  sizes?: string;
  className?: string;

  thumbnail?: string;
  thumbnailLabel?: string;
  thumbnailClassName?: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;

  bulletClass?: string;
  caption?: string;
  tags?: { value: string; title: string }[];

  isSelected?: boolean;
}
