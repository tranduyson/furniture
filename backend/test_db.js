const pool = require('./src/config/db');

(async () => {
  try {
    const [cols] = await pool.query('SHOW COLUMNS FROM users');
    const hasRole = cols.some(c => c.Field === 'role');
    
    if (!hasRole) {
      console.log('Adding role column...');
      await pool.query("ALTER TABLE users ADD COLUMN role ENUM('customer', 'admin') DEFAULT 'customer'");
    }
    
    // Set admin
    console.log('Updating admin@sontd.vn to role admin...');
    const [result] = await pool.query("UPDATE users SET role = 'admin' WHERE email = 'admin@sontd.vn'");
    console.log('Update result:', result.affectedRows);

    const [users] = await pool.query("SELECT id, email, full_name, role FROM users");
    console.log(users);

  } catch (err) {
    console.error(err);
  }
  process.exit(0);
})();
