interface SpacerProps {
  height?: 'small' | 'medium' | 'large';
}

const HEIGHT_MAP = {
  small: 'py-10',
  medium: 'py-20',
  large: 'py-28',
};

export default function Spacer({ height = 'medium' }: SpacerProps) {
  return <div className={HEIGHT_MAP[height]} />;
}
