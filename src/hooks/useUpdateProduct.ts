import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IProduct } from 'models';
import { productService } from 'services';

interface UseUpdateProductProps {
  queryKey: any[];
  product_id: number;
  onSuccess?: () => void;
  data: any;
}

export const useUpdateProduct = ({
  product_id,
  queryKey,
  onSuccess,
  data
}: UseUpdateProductProps) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => productService.update(data, product_id),
    onSuccess: (data) => {
      client.setQueryData(queryKey, (items: IProduct[] | undefined) =>
        items?.map((el) => (el.id === data.id ? data : el))
      );
      onSuccess && onSuccess();
    }
  });
};
