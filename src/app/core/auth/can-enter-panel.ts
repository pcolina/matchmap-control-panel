export const canEnterPanel = (role: string | null | undefined): boolean =>
  typeof role === 'string' && role.trim() !== '' && role !== 'USER';
