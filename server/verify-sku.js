import { Product } from "./models/product.model.js";

try {
  const p = new Product({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    coverImage: "test.jpg",
    color: "Red",
  });

  console.log("Generated SKU:", p.sku);

  if (p.sku && p.sku.length === 10) {
    console.log("SKU generation successful");
  } else {
    console.error("SKU generation failed");
    process.exit(1);
  }
} catch (error) {
  console.error("Error:", error);
  process.exit(1);
}
