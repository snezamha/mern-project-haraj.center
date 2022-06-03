import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Product(props) {
  const { product } = props;
  const { t } = useTranslation();

  return (
    <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
      <div className="group relative bg-gray-100 border border-gray-200 rounded-lg flex flex-col overflow-hidden">
        <div className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 sm:aspect-none">
          <img
            // src={product.images['0'].src}
            src={product.image}
            alt={product.name}
            className="w-full object-center object-cover sm:w-full"
          />
        </div>
        <div className="flex-1 pt-3 space-y-1 flex flex-col">
          <h3 className="text-sm font-medium text-gray-900 text-center">
            {product.name}
          </h3>
          <div className="flex-1 px-3 flex flex-col justify-end">
            <p className="text-base font-medium text-gray-900">
              {product.price.toLocaleString()} {t('common.rial')}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
export default Product;
