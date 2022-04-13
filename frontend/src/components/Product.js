import { Link } from 'react-router-dom';

function Product(props) {
  const { product } = props;
  return (
    <div className="group relative bg-gray-100 border border-gray-200 rounded-lg flex flex-col overflow-hidden">
      <div className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 sm:aspect-none">
        <img
          // src={product.images['0'].src}
          src={product.image}

          alt={product.name}
          className="w-full object-center object-cover sm:w-full"
        />
      </div>
      <div className="flex-1 p-4 space-y-2 flex flex-col">
        <h3 className="text-sm font-medium text-gray-900 text-center">
          <Link to={`/product/${product.slug}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <div className="flex-1 flex flex-col justify-end">
          <p className="text-base font-medium text-gray-900">
            {product.price.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
export default Product;
