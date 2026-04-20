import type { FC } from 'react';

interface ButtonProps {
  text: string;        
  onClick?: () => void;  
  color?: string;
}

const Button: FC<ButtonProps> = ({ text, onClick, color="#111111" }) => {
    return (
        <button type="button" onClick={onClick}
        style={{
            backgroundColor: color,
            color: 'white',
            cursor: 'pointer',
            padding: '8px 12px',
        }}
        >{text}</button>
    );
};

export default Button;