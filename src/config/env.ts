import "dotenv/config";

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing Environment Variable: ${name}`);
  }
  return value;
}

export const ENV = {
  NODE_ENV: getEnvVar("NODE_ENV") || "production",
  JWT_SECRET: getEnvVar("JWT_SECRET"),
  BCRYPT_SALT: parseInt(getEnvVar("BCRYPT_SALT"), 10),
};
