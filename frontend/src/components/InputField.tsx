import React from 'react';

interface InputProps {
    label: string;
    type: string;
    value: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputProps> = ({ label, type, value, onChange, placeholder }: InputProps) => {
    return (
        <div style={{ marginBottom: '10px' }}>
            <label>{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{ display: 'block', padding: '6px', width: '100%' }}
            />
        </div>
    );
};

export default InputField;