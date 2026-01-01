import client from "./client";


export const getSellerById = async (sellerId: string) => {
    const response = await client.get(`/api/v1/sellers/${sellerId}`);
    return response.data;
}