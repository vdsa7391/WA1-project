import crypto from 'crypto';
import readline from 'readline';

// Function to hash password with salt using scrypt
function hashPassword(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 32, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString('hex'));
    });
  });
}

// Function to generate a random salt
function generateSalt(length = 16) {
  return crypto.randomBytes(length).toString('hex');
}

// Read password from console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter password to hash: ', async (password) => {
  const salt = generateSalt();           // generate a random salt
  const hashed = await hashPassword(password, salt);

  console.log('\nHere is your password info:');
  console.log('Password:', password);
  console.log('Salt:', salt);
  console.log('Salted Hash (scrypt):', hashed);

  rl.close();
});
