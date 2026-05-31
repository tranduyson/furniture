const pool = require('./src/config/db');

async function test() {
  try {
    const [types] = await pool.execute('SELECT * FROM attribute_types');
    console.log('Types in DB:', types);

    const [values] = await pool.execute('SELECT * FROM attribute_values');
    console.log('Values in DB:', values);

    const [variants] = await pool.execute('SELECT * FROM product_variants');
    console.log('Variants in DB:', variants.slice(0, 3));
  } catch (e) {
    console.error('Error during test:', e);
  } finally {
    pool.end();
  }
}

test();
