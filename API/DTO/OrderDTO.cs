using API.Entities.OrderAggregate;
using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }        
        public ShippingAddress ShippingAddress { get; set; }
        public DateTime OrderDate { get; set; } 
        public List<OrderItemDTO> OrderItems { get; set; }
        public long SubTotal { get; set; }
        public long DeliveryFee { get; set; }
        public string Status { get; set; }
        public long Total {  get; set; }
    }
}
