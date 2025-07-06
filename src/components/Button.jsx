import styled from "styled-components";

const StyledButton = styled.button`
  padding: 10px 16px;
  font-size: 1.2rem;
  border-radius: 8px;
  border: none;
  background-color: var(--color-primary, #0070f3);
  color: white;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-primary-dark, #005bb5);
  }
`;

export default function Button({ children, onClick, ...props }) {
  return (
    <StyledButton onClick={onClick} {...props}>
      {children}
    </StyledButton>
  );
}
