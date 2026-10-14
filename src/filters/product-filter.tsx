import { forwardRef, type ChangeEvent } from "react";
import { Select } from "ui/select";
import type { Product, ProductId } from "model";

interface ProductFilterProps {
  onSelect: (productId: ProductId | null) => void;
  products: readonly Product[];
  value: ProductId | null;
}

const ProductFilter = forwardRef<HTMLSelectElement, ProductFilterProps>(
  ({ onSelect, products, value }, ref) => {
    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
      const product = products.find(({ id }) => id === event.target.value);

      onSelect(product?.id ?? null);
    };

    return (
      <label
        className="grid gap-1.5 text-sm font-medium text-text-primary"
        htmlFor="product"
      >
        Product
        <Select
          id="product"
          ref={ref}
          onChange={handleChange}
          value={value ?? ""}
        >
          <option value="">Choose a product</option>
          {products.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </Select>
      </label>
    );
  },
);

ProductFilter.displayName = "ProductFilter";

export { ProductFilter };
