import asyncFetch from './base/request';

interface optionProps {
  params?: RequestInit;
  path?: string;
}

// 取得全部產品
export const getAllProduct = () => asyncFetch('admin/products/all', 'GET');
