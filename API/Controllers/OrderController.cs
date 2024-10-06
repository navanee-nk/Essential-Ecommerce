using API.Data;
using API.DTO;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrderController : BaseAPIController
    {
        private readonly StoreContext _context;

        public OrderController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet("orders")]
        public async Task<ActionResult<List<OrderDTO>>> GetOrders()
        {
            return await _context.Orders
                .ProjectOrderToOrderDTO()
                .Where(o => o.BuyerId == User.Identity.Name)
                .ToListAsync();
        }
        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDTO>> GetOrder(int id)
        {
            var order = await _context.Orders
                .ProjectOrderToOrderDTO()
                .Where(o => o.BuyerId == User.Identity.Name && o.Id == id)
                .FirstOrDefaultAsync();
            return order;
        }
        [HttpPost]
        public async Task<ActionResult<int>> CreateOrder(CreateOrderDTO createOrderDTO)
        {
            var basket = await _context.Baskets.RetrieveBasket(User.Identity.Name).FirstOrDefaultAsync();

            if (basket == null)
            {
                return BadRequest(new ProblemDetails { Title = "Basket Not Found" });
            }
            var items = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                var productItem = await _context.Products.FindAsync(item.ProductId);
                var itemOrdered = new ProductItemOrdered
                {
                    Name = productItem.Name,
                    PictureUrl = productItem.PictureUrl,
                    ProductId = productItem.Id,
                };
                var OrderItem = new OrderItem
                {
                    ItemOrdered = itemOrdered,
                    Price = productItem.Price,
                    Quantity = item.Quantity
                };
                items.Add(OrderItem);
                productItem.QuantityInStock -= item.Quantity;
            }
            var subTotal = items.Sum(x => x.Price * x.Quantity);
            var deliveryFee = subTotal > 10000 ? 0 : 500;
            var order = new Order
            {
                BuyerId = User.Identity.Name,
                ShippingAddress = createOrderDTO.Address,
                SubTotal = subTotal,
                DeliveryFee = deliveryFee,
                OrderItems = items,
                PaymentIntentId = basket.PaymentIntentId
            };
            _context.Orders.Add(order);
            _context.Baskets.Remove(basket);

            if (createOrderDTO.SaveAddress)
            {
                var user = await _context.Users.Include(u => u.Address).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
                var address = new UserAddress
                {
                    FullName = createOrderDTO.Address.FullName,
                    Address1 = createOrderDTO.Address.Address1,
                    Address2 = createOrderDTO.Address.Address2,
                    City = createOrderDTO.Address.City,
                    State = createOrderDTO.Address.State,
                    Zip = createOrderDTO.Address.Zip,
                    Country = createOrderDTO.Address.Country
                };
                user.Address = address;
                _context.Update(user);
            }
            var result = await _context.SaveChangesAsync() > 0;
            if (result)
            {
                return CreatedAtRoute("GetOrder", new { id = order.Id }, order.Id);
            }
            return BadRequest(new ProblemDetails { Title = "Problem creating order.." });
        }
    }
}
