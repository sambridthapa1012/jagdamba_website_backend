import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Filter,
  LayoutGrid,
  List,
  Star,
  ShoppingCart,
  SlidersHorizontal,
} from "lucide-react";
import { categories } from "../data/products";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";

const ProductList = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("popularity");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState(50000);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const { dispatch } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
   const { products, loading } = useProducts();

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  /* ---------- FILTER LOGIC ---------- */
  const brands = [...new Set(products.map((p) => p.brand))];

  const filterproducts = products.filter((p) => {
    if (selectedCategory !== "all" && p.category !== selectedCategory)
      return false;
    if (selectedBrands.length && !selectedBrands.includes(p.brand))
      return false;
    if (p.price > priceRange) return false;
    return true;
  });

  /* ---------- SORT LOGIC ---------- */
  filterproducts.sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return (b.reviewCount || 0) - (a.reviewCount || 0);
  });

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(price);

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const addToCart = (e, product) => {
    e.stopPropagation();
    dispatch({ type: "ADD_ITEM", payload: product });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">All Products</h1>
            <p className="text-gray-600">Construction materials & tools</p>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
            {/* VIEW MODE */}
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid" ? "bg-orange-100 text-orange-600" : ""
                }`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list" ? "bg-orange-100 text-orange-600" : ""
                }`}
              >
                <List size={18} />
              </button>
            </div>

            {/* SORT */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border px-3 py-2 rounded-lg"
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>

            {/* FILTER TOGGLE */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center border px-3 py-2 rounded-lg"
            >
              <SlidersHorizontal size={16} className="mr-1" />
              Filters
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* FILTER SIDEBAR */}
          <aside
            className={`w-64 bg-white p-5 rounded-lg shadow ${
              showFilters ? "block" : "hidden md:block"
            }`}
          >
            <h3 className="font-semibold flex items-center mb-4">
              <Filter size={18} className="mr-2" />
              Filters
            </h3>

            {/* CATEGORY */}
            <div className="mb-5">
              <h4 className="font-medium mb-2">Category</h4>
              <label className="block">
                <input
                  type="radio"
                  checked={selectedCategory === "all"}
                  onChange={() => setSelectedCategory("all")}
                />
                <span className="ml-2">All</span>
              </label>
              {categories.map((c) => (
                <label key={c.id} className="block">
                  <input
                    type="radio"
                    checked={selectedCategory === c.id}
                    onChange={() => setSelectedCategory(c.id)}
                  />
                  <span className="ml-2">{c.name}</span>
                </label>
              ))}
            </div>

            {/* BRAND */}
            <div className="mb-5">
              <h4 className="font-medium mb-2">Brand</h4>
              {brands.map((b) => (
                <label key={b} className="block">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b)}
                    onChange={() => toggleBrand(b)}
                  />
                  <span className="ml-2">{b}</span>
                </label>
              ))}
            </div>

            {/* PRICE */}
            <div>
              <h4 className="font-medium mb-2">Max Price</h4>
              <input
                type="range"
                min="0"
                max="50000"
                value={priceRange}
                onChange={(e) => setPriceRange(+e.target.value)}
                className="w-full"
              />
              <p className="text-sm mt-1">{formatPrice(priceRange)}</p>
            </div>
          </aside>

          {/* PRODUCTS */}
          <div className="flex-1">
            {filterproducts.length === 0 && (
              <p className="text-center text-gray-500 mt-10">
                No products found
              </p>
            )}

            {viewMode === "grid" ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterproducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/products/${p.id}`)}
                    className="bg-white rounded-lg shadow hover:shadow-lg cursor-pointer"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold">{p.name}</h3>
                      <div className="flex items-center my-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < p.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <p className="font-bold">{formatPrice(p.price)}</p>
                      <button
                        onClick={(e) => addToCart(e, p)}
                        className="mt-3 w-full bg-orange-600 text-white py-2 rounded-lg flex justify-center"
                      >
                        <ShoppingCart size={16} className="mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              filterproducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/products/${p.id}`)}
                  className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between"
                >
                  <div>
                    <h3 className="font-semibold">{p.name}</h3>
                    <p>{formatPrice(p.price)}</p>
                  </div>
                  <button
                    onClick={(e) => addToCart(e, p)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg"
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;

