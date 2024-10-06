using API.Entities.OrderAggregate;

namespace API.DTO
{
    public class CreateOrderDTO
    {
        public bool SaveAddress { get; set; }
        public ShippingAddress Address { get; set; }
    }
}
