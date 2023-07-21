import SecureLS from 'secure-ls';

export const secureLs = new SecureLS({
  encryptionSecret: process.env.REACT_APP_SECURE_LS
});