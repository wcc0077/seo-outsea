interface SpacerProps {
  height?: 'small' | 'medium' | 'large';
}

const HEIGHT_MAP = {
  small: 'py-8',
  medium: 'py-16',
  large: 'py-24',
};

export default function Spacer({ height = 'medium' }: SpacerProps) {
  return <div className={HEIGHT_MAP[height]} />;
}
