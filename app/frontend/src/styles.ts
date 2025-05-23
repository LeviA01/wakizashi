export const colors = {
  background: '#1a1a1a',
  surface: '#2d2d2d',
  surfaceHover: '#3d3d3d',
  text: '#ffffff',
  textSecondary: '#b3b3b3',
  border: '#404040',
  error: '#ff4444',
  success: '#00ff00',
  warning: '#ffaa00',
  info: '#00aaff'
};

export const gradients = {
  primary: 'linear-gradient(135deg, #ff4444 0%, #ffaa00 100%)',
  success: 'linear-gradient(135deg, #00ff00 0%, #00aa00 100%)',
  info: 'linear-gradient(135deg, #00aaff 0%, #0044ff 100%)',
  surface: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
  error: 'linear-gradient(135deg, #ff4444 0%, #aa0000 100%)'
};

export const commonStyles = {
  container: {
    backgroundColor: colors.background,
    color: colors.text,
    minHeight: '100vh',
    padding: '2rem'
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${colors.border}`
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: colors.background,
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
    color: colors.text,
    fontSize: '1rem',
    transition: 'all 0.2s',
    outline: 'none',
    '&:focus': {
      borderColor: colors.info,
      boxShadow: `0 0 0 2px ${colors.info}33`
    }
  },
  button: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: colors.text,
    background: gradients.primary,
    '&:hover': {
      opacity: 0.9,
      transform: 'translateY(-1px)'
    }
  },
  buttonSuccess: {
    ...gradients.success,
    '&:hover': {
      opacity: 0.9,
      transform: 'translateY(-1px)'
    }
  },
  buttonInfo: {
    ...gradients.info,
    '&:hover': {
      opacity: 0.9,
      transform: 'translateY(-1px)'
    }
  }
}; 