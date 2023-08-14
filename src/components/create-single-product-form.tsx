import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ICreateSingleProductsForm, IKeys, IProduct } from 'models';
import { productService } from 'services';

import { ProductForm } from './product-form';

interface CreateSingleProductFormProps {
  closeModal: (data: boolean) => void,
}

export const CreateSingleProductForm = ({ closeModal }: CreateSingleProductFormProps) => {
  const client = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: productService.createOne,
    onSuccess: (data) => {
      client.setQueriesData(
        [IKeys.PRODUCTS],
        (products: IProduct[] | undefined) => products ? [...products, data] : products
      );
      closeModal(true);
    }
  });

  const onFinish = (values: ICreateSingleProductsForm) => {
    mutate(values);
  };

  return <ProductForm onFinish={onFinish} isLoading={isLoading} />;
};