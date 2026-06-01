import SecureLS from 'secure-ls';

export const secureLs = new SecureLS({
  encryptionSecret: import.meta.env.VITE_SECURE_LS
});
