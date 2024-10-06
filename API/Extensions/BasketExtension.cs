using API.DTO;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class BasketExtension
    {
        public static BasketDTO MapBasketToDTo(this Basket basket)
        {
            return new BasketDTO()
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                PaymentIntentId = basket.PaymentIntentId,
                ClientSecret = basket.ClientSecret,
                basketItems = basket.Items.Select(item => new BasketItemDTO
                {
                    ProductId = item.ProductId,
                    PictureUrl = item.Product.PictureUrl,
                    Quantity = item.Quantity,
                    Brand = item.Product.Brand,
                    Type = item.Product.Type,
                    ProductName = item.Product.Name,
                    Price = item.Product.Price,
                }).ToList(),
            };
        }
        public static IQueryable<Basket> RetrieveBasket(this IQueryable<Basket> basket, string buyerId)
        {

            return basket.Include(b => b.Items).ThenInclude(p => p.Product).Where(x => x.BuyerId == buyerId);
        }
    }
}
