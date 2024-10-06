using API.DTO;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class OrderExtension
    {
        public static IQueryable<OrderDTO> ProjectOrderToOrderDTO(this IQueryable<Order> query)
        {
            return query.Select(o => new OrderDTO
            {
                Id = o.Id,
                BuyerId = o.BuyerId,
                OrderDate = o.OrderDate,
                ShippingAddress = o.ShippingAddress,
                SubTotal = o.SubTotal,
                DeliveryFee = o.DeliveryFee,
                Total = o.GetTotal(),
                Status = o.Status.ToString(),
                OrderItems = o.OrderItems.Select(item => new OrderItemDTO
                {
                    Price = item.Price,
                    Quantity = item.Quantity,
                    Name = item.ItemOrdered.Name,
                    ProductId = item.ItemOrdered.ProductId,
                    PictureUrl = item.ItemOrdered.PictureUrl,
                })
                .ToList()
            }).AsNoTracking();
        }
    }
}
