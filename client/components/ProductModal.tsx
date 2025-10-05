'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Star, ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  brand: string;
  rating: number;
  numReviews: number;
  featured: boolean;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { user } = useAuth();
  const router = useRouter();

  if (!product) return null;

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      router.push('/auth/login');
      return;
    }

    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    try {
      const cartItem = {
        _id: `${product._id}_${Date.now()}`,
        product: {
          _id: product._id,
          name: product.name,
          images: product.images,
          price: product.price,
        },
        quantity,
        price: product.price,
      };
      
      await addItem(cartItem);
      toast.success('Product added to cart!');
      onClose();
    } catch (error) {
      toast.error('Failed to add product to cart');
    }
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      router.push('/auth/login');
      return;
    }

    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product._id);
      toast.success('Added to wishlist');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="relative">
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-2 right-2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 max-h-[90vh] overflow-y-auto mobile-scroll">
          {/* Product Images */}
          <div className="space-y-3 lg:space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage] || '/placeholder-product.jpg'}
              alt={product.name}
              width={500}
              height={500}
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? 'border-primary-500'
                      : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-4 lg:space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs lg:text-sm text-gray-500 capitalize">{product.category}</span>
              {product.featured && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-xl lg:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-2 mb-3 lg:mb-4">
              <div className="flex items-center space-x-1">
                {renderStars(product.rating)}
              </div>
              <span className="text-xs lg:text-sm text-gray-600">
                {product.rating} ({product.numReviews} reviews)
              </span>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-primary-600 mb-3 lg:mb-4">
              {formatPrice(product.price)}
            </p>
          </div>

          <div>
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-sm lg:text-base text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 text-xs lg:text-sm">
            <div>
              <span className="font-medium text-gray-900">Brand:</span>
              <span className="ml-2 text-gray-600">{product.brand}</span>
            </div>
            <div>
              <span className="font-medium text-gray-900">Category:</span>
              <span className="ml-2 text-gray-600 capitalize">{product.category}</span>
            </div>
            <div>
              <span className="font-medium text-gray-900">Stock:</span>
              <span className={`ml-2 ${
                product.stock > 10 ? 'text-green-600' :
                product.stock > 0 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-900">Rating:</span>
              <span className="ml-2 text-gray-600">{product.rating}/5</span>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-3 lg:space-y-4">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <span className="font-medium text-gray-900 text-sm lg:text-base">Quantity:</span>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-8 w-8 lg:h-9 lg:w-9"
                >
                  <Minus className="h-3 w-3 lg:h-4 lg:w-4" />
                </Button>
                <span className="w-10 lg:w-12 text-center font-medium text-sm lg:text-base">{quantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="h-8 w-8 lg:h-9 lg:w-9"
                >
                  <Plus className="h-3 w-3 lg:h-4 lg:w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 h-10 lg:h-12"
                size="lg"
              >
                <ShoppingCart className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                <span className="text-sm lg:text-base">
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-10 lg:h-12 px-4 sm:px-6"
                onClick={handleWishlistToggle}
              >
                <Heart className={`h-4 w-4 lg:h-5 lg:w-5 ${isInWishlist(product._id) ? 'text-red-500 fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base">Shipping & Returns</h4>
            <ul className="text-xs lg:text-sm text-gray-600 space-y-1">
              <li>• Free shipping on orders over ₹1000</li>
              <li>• 30-day return policy</li>
              <li>• Secure payment processing</li>
              <li>• 24/7 customer support</li>
            </ul>
          </div>
        </div>
        </div>
      </div>
    </Modal>
  );
};
