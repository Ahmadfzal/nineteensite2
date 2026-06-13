import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { AdminLoginInput, AdminLoginResult, AdminSession, Category, CategoryInput, CategoryUpdate, ClientWebsite, ClientWebsiteInput, ClientWebsiteUpdate, DashboardStats, ErrorEnvelope, ErrorResponse, HealthStatus, ListProductsParams, Product, ProductInput, ProductUpdate, SiteSettings, SiteSettingsInput, UploadUrlRequest, UploadUrlResponse } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>, "queryKey"> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>, 'queryKey'> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListProductsUrl: (params?: ListProductsParams) => string;
/**
 * @summary List all products
 */
export declare const listProducts: (params?: ListProductsParams, options?: RequestInit) => Promise<Product[]>;
export declare const getListProductsQueryKey: (params?: ListProductsParams) => readonly ["/api/products", ...ListProductsParams[]];
export declare const getListProductsQueryOptions: <TData = Awaited<ReturnType<typeof listProducts>>, TError = ErrorType<unknown>>(params?: ListProductsParams, options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData>, "queryKey"> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListProductsQueryResult = NonNullable<Awaited<ReturnType<typeof listProducts>>>;
export type ListProductsQueryError = ErrorType<unknown>;
/**
 * @summary List all products
 */
export declare function useListProducts<TData = Awaited<ReturnType<typeof listProducts>>, TError = ErrorType<unknown>>(params?: ListProductsParams, options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData>, 'queryKey'> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateProductUrl: () => string;
/**
 * @summary Create a product (admin)
 */
export declare const createProduct: (productInput: ProductInput, options?: RequestInit) => Promise<Product>;
export declare const getCreateProductMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createProduct>>, TError, {
        data: BodyType<ProductInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createProduct>>, TError, {
    data: BodyType<ProductInput>;
}, TContext>;
export type CreateProductMutationResult = NonNullable<Awaited<ReturnType<typeof createProduct>>>;
export type CreateProductMutationBody = BodyType<ProductInput>;
export type CreateProductMutationError = ErrorType<unknown>;
/**
* @summary Create a product (admin)
*/
export declare const useCreateProduct: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createProduct>>, TError, {
        data: BodyType<ProductInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createProduct>>, TError, {
    data: BodyType<ProductInput>;
}, TContext>;
export declare const getGetProductUrl: (id: number) => string;
/**
 * @summary Get a single product
 */
export declare const getProduct: (id: number, options?: RequestInit) => Promise<Product>;
export declare const getGetProductQueryKey: (id: number) => readonly [`/api/products/${number}`];
export declare const getGetProductQueryOptions: <TData = Awaited<ReturnType<typeof getProduct>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData>, "queryKey"> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetProductQueryResult = NonNullable<Awaited<ReturnType<typeof getProduct>>>;
export type GetProductQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get a single product
 */
export declare function useGetProduct<TData = Awaited<ReturnType<typeof getProduct>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData>, 'queryKey'> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateProductUrl: (id: number) => string;
/**
 * @summary Update a product (admin)
 */
export declare const updateProduct: (id: number, productUpdate: ProductUpdate, options?: RequestInit) => Promise<Product>;
export declare const getUpdateProductMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProduct>>, TError, {
        id: number;
        data: BodyType<ProductUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateProduct>>, TError, {
    id: number;
    data: BodyType<ProductUpdate>;
}, TContext>;
export type UpdateProductMutationResult = NonNullable<Awaited<ReturnType<typeof updateProduct>>>;
export type UpdateProductMutationBody = BodyType<ProductUpdate>;
export type UpdateProductMutationError = ErrorType<unknown>;
/**
* @summary Update a product (admin)
*/
export declare const useUpdateProduct: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProduct>>, TError, {
        id: number;
        data: BodyType<ProductUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateProduct>>, TError, {
    id: number;
    data: BodyType<ProductUpdate>;
}, TContext>;
export declare const getDeleteProductUrl: (id: number) => string;
/**
 * @summary Delete a product (admin)
 */
export declare const deleteProduct: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteProductMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteProduct>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteProduct>>, TError, {
    id: number;
}, TContext>;
export type DeleteProductMutationResult = NonNullable<Awaited<ReturnType<typeof deleteProduct>>>;
export type DeleteProductMutationError = ErrorType<unknown>;
/**
* @summary Delete a product (admin)
*/
export declare const useDeleteProduct: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteProduct>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteProduct>>, TError, {
    id: number;
}, TContext>;
export declare const getListCategoriesUrl: () => string;
/**
 * @summary List all categories
 */
export declare const listCategories: (options?: RequestInit) => Promise<Category[]>;
export declare const getListCategoriesQueryKey: () => readonly ["/api/categories"];
export declare const getListCategoriesQueryOptions: <TData = Awaited<ReturnType<typeof listCategories>>, TError = ErrorType<unknown>>(options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof listCategories>>, TError, TData>, "queryKey"> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listCategories>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCategoriesQueryResult = NonNullable<Awaited<ReturnType<typeof listCategories>>>;
export type ListCategoriesQueryError = ErrorType<unknown>;
/**
 * @summary List all categories
 */
export declare function useListCategories<TData = Awaited<ReturnType<typeof listCategories>>, TError = ErrorType<unknown>>(options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof listCategories>>, TError, TData>, 'queryKey'> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateCategoryUrl: () => string;
/**
 * @summary Create a category (admin)
 */
export declare const createCategory: (categoryInput: CategoryInput, options?: RequestInit) => Promise<Category>;
export declare const getCreateCategoryMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCategory>>, TError, {
        data: BodyType<CategoryInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createCategory>>, TError, {
    data: BodyType<CategoryInput>;
}, TContext>;
export type CreateCategoryMutationResult = NonNullable<Awaited<ReturnType<typeof createCategory>>>;
export type CreateCategoryMutationBody = BodyType<CategoryInput>;
export type CreateCategoryMutationError = ErrorType<unknown>;
/**
* @summary Create a category (admin)
*/
export declare const useCreateCategory: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCategory>>, TError, {
        data: BodyType<CategoryInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createCategory>>, TError, {
    data: BodyType<CategoryInput>;
}, TContext>;
export declare const getUpdateCategoryUrl: (id: number) => string;
/**
 * @summary Update a category (admin)
 */
export declare const updateCategory: (id: number, categoryUpdate: CategoryUpdate, options?: RequestInit) => Promise<Category>;
export declare const getUpdateCategoryMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCategory>>, TError, {
        id: number;
        data: BodyType<CategoryUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateCategory>>, TError, {
    id: number;
    data: BodyType<CategoryUpdate>;
}, TContext>;
export type UpdateCategoryMutationResult = NonNullable<Awaited<ReturnType<typeof updateCategory>>>;
export type UpdateCategoryMutationBody = BodyType<CategoryUpdate>;
export type UpdateCategoryMutationError = ErrorType<unknown>;
/**
* @summary Update a category (admin)
*/
export declare const useUpdateCategory: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCategory>>, TError, {
        id: number;
        data: BodyType<CategoryUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateCategory>>, TError, {
    id: number;
    data: BodyType<CategoryUpdate>;
}, TContext>;
export declare const getDeleteCategoryUrl: (id: number) => string;
/**
 * @summary Delete a category (admin)
 */
export declare const deleteCategory: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteCategoryMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCategory>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteCategory>>, TError, {
    id: number;
}, TContext>;
export type DeleteCategoryMutationResult = NonNullable<Awaited<ReturnType<typeof deleteCategory>>>;
export type DeleteCategoryMutationError = ErrorType<unknown>;
/**
* @summary Delete a category (admin)
*/
export declare const useDeleteCategory: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCategory>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteCategory>>, TError, {
    id: number;
}, TContext>;
export declare const getListClientsUrl: () => string;
/**
 * @summary List all client websites
 */
export declare const listClients: (options?: RequestInit) => Promise<ClientWebsite[]>;
export declare const getListClientsQueryKey: () => readonly ["/api/clients"];
export declare const getListClientsQueryOptions: <TData = Awaited<ReturnType<typeof listClients>>, TError = ErrorType<unknown>>(options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof listClients>>, TError, TData>, "queryKey"> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listClients>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListClientsQueryResult = NonNullable<Awaited<ReturnType<typeof listClients>>>;
export type ListClientsQueryError = ErrorType<unknown>;
/**
 * @summary List all client websites
 */
export declare function useListClients<TData = Awaited<ReturnType<typeof listClients>>, TError = ErrorType<unknown>>(options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof listClients>>, TError, TData>, 'queryKey'> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateClientUrl: () => string;
/**
 * @summary Create a client website (admin)
 */
export declare const createClient: (clientWebsiteInput: ClientWebsiteInput, options?: RequestInit) => Promise<ClientWebsite>;
export declare const getCreateClientMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createClient>>, TError, {
        data: BodyType<ClientWebsiteInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createClient>>, TError, {
    data: BodyType<ClientWebsiteInput>;
}, TContext>;
export type CreateClientMutationResult = NonNullable<Awaited<ReturnType<typeof createClient>>>;
export type CreateClientMutationBody = BodyType<ClientWebsiteInput>;
export type CreateClientMutationError = ErrorType<unknown>;
/**
* @summary Create a client website (admin)
*/
export declare const useCreateClient: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createClient>>, TError, {
        data: BodyType<ClientWebsiteInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createClient>>, TError, {
    data: BodyType<ClientWebsiteInput>;
}, TContext>;
export declare const getLookupClientByWebsiteIdUrl: (websiteId: string) => string;
/**
 * @summary Look up a client website by its public website ID
 */
export declare const lookupClientByWebsiteId: (websiteId: string, options?: RequestInit) => Promise<ClientWebsite>;
export declare const getLookupClientByWebsiteIdQueryKey: (websiteId: string) => readonly [`/api/clients/lookup/${string}`];
export declare const getLookupClientByWebsiteIdQueryOptions: <TData = Awaited<ReturnType<typeof lookupClientByWebsiteId>>, TError = ErrorType<ErrorResponse>>(websiteId: string, options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof lookupClientByWebsiteId>>, TError, TData>, "queryKey"> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof lookupClientByWebsiteId>>, TError, TData> & {
    queryKey: QueryKey;
};
export type LookupClientByWebsiteIdQueryResult = NonNullable<Awaited<ReturnType<typeof lookupClientByWebsiteId>>>;
export type LookupClientByWebsiteIdQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Look up a client website by its public website ID
 */
export declare function useLookupClientByWebsiteId<TData = Awaited<ReturnType<typeof lookupClientByWebsiteId>>, TError = ErrorType<ErrorResponse>>(websiteId: string, options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof lookupClientByWebsiteId>>, TError, TData>, 'queryKey'> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetClientUrl: (id: number) => string;
/**
 * @summary Get a single client website
 */
export declare const getClient: (id: number, options?: RequestInit) => Promise<ClientWebsite>;
export declare const getGetClientQueryKey: (id: number) => readonly [`/api/clients/${number}`];
export declare const getGetClientQueryOptions: <TData = Awaited<ReturnType<typeof getClient>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof getClient>>, TError, TData>, "queryKey"> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getClient>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetClientQueryResult = NonNullable<Awaited<ReturnType<typeof getClient>>>;
export type GetClientQueryError = ErrorType<unknown>;
/**
 * @summary Get a single client website
 */
export declare function useGetClient<TData = Awaited<ReturnType<typeof getClient>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof getClient>>, TError, TData>, 'queryKey'> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateClientUrl: (id: number) => string;
/**
 * @summary Update a client website (admin)
 */
export declare const updateClient: (id: number, clientWebsiteUpdate: ClientWebsiteUpdate, options?: RequestInit) => Promise<ClientWebsite>;
export declare const getUpdateClientMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateClient>>, TError, {
        id: number;
        data: BodyType<ClientWebsiteUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateClient>>, TError, {
    id: number;
    data: BodyType<ClientWebsiteUpdate>;
}, TContext>;
export type UpdateClientMutationResult = NonNullable<Awaited<ReturnType<typeof updateClient>>>;
export type UpdateClientMutationBody = BodyType<ClientWebsiteUpdate>;
export type UpdateClientMutationError = ErrorType<unknown>;
/**
* @summary Update a client website (admin)
*/
export declare const useUpdateClient: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateClient>>, TError, {
        id: number;
        data: BodyType<ClientWebsiteUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateClient>>, TError, {
    id: number;
    data: BodyType<ClientWebsiteUpdate>;
}, TContext>;
export declare const getDeleteClientUrl: (id: number) => string;
/**
 * @summary Delete a client website (admin)
 */
export declare const deleteClient: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteClientMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteClient>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteClient>>, TError, {
    id: number;
}, TContext>;
export type DeleteClientMutationResult = NonNullable<Awaited<ReturnType<typeof deleteClient>>>;
export type DeleteClientMutationError = ErrorType<unknown>;
/**
* @summary Delete a client website (admin)
*/
export declare const useDeleteClient: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteClient>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteClient>>, TError, {
    id: number;
}, TContext>;
export declare const getExtendClientUrl: (id: number) => string;
/**
 * @summary Extend client subscription by 30 days
 */
export declare const extendClient: (id: number, options?: RequestInit) => Promise<ClientWebsite>;
export declare const getExtendClientMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof extendClient>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof extendClient>>, TError, {
    id: number;
}, TContext>;
export type ExtendClientMutationResult = NonNullable<Awaited<ReturnType<typeof extendClient>>>;
export type ExtendClientMutationError = ErrorType<unknown>;
/**
* @summary Extend client subscription by 30 days
*/
export declare const useExtendClient: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof extendClient>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof extendClient>>, TError, {
    id: number;
}, TContext>;
export declare const getToggleClientStatusUrl: (id: number) => string;
/**
 * @summary Activate or deactivate a client website
 */
export declare const toggleClientStatus: (id: number, options?: RequestInit) => Promise<ClientWebsite>;
export declare const getToggleClientStatusMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof toggleClientStatus>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof toggleClientStatus>>, TError, {
    id: number;
}, TContext>;
export type ToggleClientStatusMutationResult = NonNullable<Awaited<ReturnType<typeof toggleClientStatus>>>;
export type ToggleClientStatusMutationError = ErrorType<unknown>;
/**
* @summary Activate or deactivate a client website
*/
export declare const useToggleClientStatus: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof toggleClientStatus>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof toggleClientStatus>>, TError, {
    id: number;
}, TContext>;
export declare const getAdminLoginUrl: () => string;
/**
 * @summary Admin login
 */
export declare const adminLogin: (adminLoginInput: AdminLoginInput, options?: RequestInit) => Promise<AdminLoginResult>;
export declare const getAdminLoginMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<AdminLoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<AdminLoginInput>;
}, TContext>;
export type AdminLoginMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogin>>>;
export type AdminLoginMutationBody = BodyType<AdminLoginInput>;
export type AdminLoginMutationError = ErrorType<ErrorResponse>;
/**
* @summary Admin login
*/
export declare const useAdminLogin: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<AdminLoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<AdminLoginInput>;
}, TContext>;
export declare const getAdminLogoutUrl: () => string;
/**
 * @summary Admin logout
 */
export declare const adminLogout: (options?: RequestInit) => Promise<void>;
export declare const getAdminLogoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
export type AdminLogoutMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogout>>>;
export type AdminLogoutMutationError = ErrorType<unknown>;
/**
* @summary Admin logout
*/
export declare const useAdminLogout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
export declare const getAdminMeUrl: () => string;
/**
 * @summary Check admin session
 */
export declare const adminMe: (options?: RequestInit) => Promise<AdminSession>;
export declare const getAdminMeQueryKey: () => readonly ["/api/admin/me"];
export declare const getAdminMeQueryOptions: <TData = Awaited<ReturnType<typeof adminMe>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof adminMe>>, TError, TData>, "queryKey"> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof adminMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type AdminMeQueryResult = NonNullable<Awaited<ReturnType<typeof adminMe>>>;
export type AdminMeQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Check admin session
 */
export declare function useAdminMe<TData = Awaited<ReturnType<typeof adminMe>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof adminMe>>, TError, TData>, 'queryKey'> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetSettingsUrl: () => string;
/**
 * @summary Get site settings (public)
 */
export declare const getSettings: (options?: RequestInit) => Promise<SiteSettings>;
export declare const getGetSettingsQueryKey: () => readonly ["/api/settings"];
export declare const getGetSettingsQueryOptions: <TData = Awaited<ReturnType<typeof getSettings>>, TError = ErrorType<unknown>>(options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData>, "queryKey"> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSettingsQueryResult = NonNullable<Awaited<ReturnType<typeof getSettings>>>;
export type GetSettingsQueryError = ErrorType<unknown>;
/**
 * @summary Get site settings (public)
 */
export declare function useGetSettings<TData = Awaited<ReturnType<typeof getSettings>>, TError = ErrorType<unknown>>(options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData>, 'queryKey'> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateSettingsUrl: () => string;
/**
 * @summary Update site settings (admin)
 */
export declare const updateSettings: (siteSettingsInput: SiteSettingsInput, options?: RequestInit) => Promise<SiteSettings>;
export declare const getUpdateSettingsMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError, {
        data: BodyType<SiteSettingsInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError, {
    data: BodyType<SiteSettingsInput>;
}, TContext>;
export type UpdateSettingsMutationResult = NonNullable<Awaited<ReturnType<typeof updateSettings>>>;
export type UpdateSettingsMutationBody = BodyType<SiteSettingsInput>;
export type UpdateSettingsMutationError = ErrorType<ErrorResponse>;
/**
* @summary Update site settings (admin)
*/
export declare const useUpdateSettings: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError, {
        data: BodyType<SiteSettingsInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateSettings>>, TError, {
    data: BodyType<SiteSettingsInput>;
}, TContext>;
export declare const getGetDashboardStatsUrl: () => string;
/**
 * @summary Dashboard summary stats
 */
export declare const getDashboardStats: (options?: RequestInit) => Promise<DashboardStats>;
export declare const getGetDashboardStatsQueryKey: () => readonly ["/api/stats/dashboard"];
export declare const getGetDashboardStatsQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>, "queryKey"> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardStats>>>;
export type GetDashboardStatsQueryError = ErrorType<unknown>;
/**
 * @summary Dashboard summary stats
 */
export declare function useGetDashboardStats<TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>, 'queryKey'> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getRequestUploadUrlUrl: () => string;
/**
 * Returns a presigned GCS URL for direct upload. The client sends JSON
metadata here, then uploads the file directly to the returned URL.

 * @summary Request a presigned URL for file upload
 */
export declare const requestUploadUrl: (uploadUrlRequest: UploadUrlRequest, options?: RequestInit) => Promise<UploadUrlResponse>;
export declare const getRequestUploadUrlMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
        data: BodyType<UploadUrlRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
    data: BodyType<UploadUrlRequest>;
}, TContext>;
export type RequestUploadUrlMutationResult = NonNullable<Awaited<ReturnType<typeof requestUploadUrl>>>;
export type RequestUploadUrlMutationBody = BodyType<UploadUrlRequest>;
export type RequestUploadUrlMutationError = ErrorType<ErrorEnvelope>;
/**
* @summary Request a presigned URL for file upload
*/
export declare const useRequestUploadUrl: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
        data: BodyType<UploadUrlRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
    data: BodyType<UploadUrlRequest>;
}, TContext>;
export declare const getGetPublicObjectUrl: (filePath: string) => string;
/**
 * Unconditionally public — no authentication or ACL checks.
Searches PUBLIC_OBJECT_SEARCH_PATHS for the given file path.

 * @summary Serve a public asset from PUBLIC_OBJECT_SEARCH_PATHS
 */
export declare const getPublicObject: (filePath: string, options?: RequestInit) => Promise<Blob>;
export declare const getGetPublicObjectQueryKey: (filePath: string) => readonly [`/api/storage/public-objects/${string}`];
export declare const getGetPublicObjectQueryOptions: <TData = Awaited<ReturnType<typeof getPublicObject>>, TError = ErrorType<ErrorEnvelope>>(filePath: string, options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof getPublicObject>>, TError, TData>, "queryKey"> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPublicObject>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPublicObjectQueryResult = NonNullable<Awaited<ReturnType<typeof getPublicObject>>>;
export type GetPublicObjectQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary Serve a public asset from PUBLIC_OBJECT_SEARCH_PATHS
 */
export declare function useGetPublicObject<TData = Awaited<ReturnType<typeof getPublicObject>>, TError = ErrorType<ErrorEnvelope>>(filePath: string, options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof getPublicObject>>, TError, TData>, 'queryKey'> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetStorageObjectUrl: (objectPath: string) => string;
/**
 * Serves object entities uploaded via presigned URLs. These can optionally
be protected with authentication or ACL checks based on the use case.

 * @summary Serve an object entity from PRIVATE_OBJECT_DIR
 */
export declare const getStorageObject: (objectPath: string, options?: RequestInit) => Promise<Blob>;
export declare const getGetStorageObjectQueryKey: (objectPath: string) => readonly [`/api/storage/objects/${string}`];
export declare const getGetStorageObjectQueryOptions: <TData = Awaited<ReturnType<typeof getStorageObject>>, TError = ErrorType<ErrorEnvelope>>(objectPath: string, options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof getStorageObject>>, TError, TData>, "queryKey"> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStorageObject>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStorageObjectQueryResult = NonNullable<Awaited<ReturnType<typeof getStorageObject>>>;
export type GetStorageObjectQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary Serve an object entity from PRIVATE_OBJECT_DIR
 */
export declare function useGetStorageObject<TData = Awaited<ReturnType<typeof getStorageObject>>, TError = ErrorType<ErrorEnvelope>>(objectPath: string, options?: {
    query?: (Omit<UseQueryOptions<Awaited<ReturnType<typeof getStorageObject>>, TError, TData>, 'queryKey'> & {
        queryKey?: QueryKey;
    });
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map