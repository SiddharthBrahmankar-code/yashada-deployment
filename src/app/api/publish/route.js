import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const data = await request.json();

    // The data sent by admin/page.jsx is:
    // body: JSON.stringify({
    //   products: { categories },
    //   brands: { brands },
    // })

    if (data.products) {
      const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
      await fs.writeFile(productsPath, JSON.stringify(data.products, null, 2), 'utf-8');
    }

    if (data.brands) {
      const brandsPath = path.join(process.cwd(), 'src', 'data', 'brands.json');
      await fs.writeFile(brandsPath, JSON.stringify(data.brands, null, 2), 'utf-8');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'JSON files updated successfully on disk!',
      commitSha: 'FS-UPDATE' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Publish API Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Failed to write JSON files' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
